
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using MyBlog.DBModels;
using MyBlog.Models;


namespace MyBlog.Controllers;
public class ShopController : Controller{
    private readonly UserManager<MyUser> _userManager;
    private readonly UserDbContext _db;
    private MyUser? _user;
    public ShopController(UserManager<MyUser> userManager,UserDbContext db){
        _userManager=userManager;
        _db=db;
    }
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        _user=await _userManager.GetUserAsync(User);
        await next();
    }
   
    public async Task<IActionResult> Shop([FromRoute] int Id){
        ViewData["Page"]=Id;
        if(Request.Cookies.TryGetValue("Records",out string? Records)){

            return View(await _db.Product.Skip(int.Parse(Records)*(Id-1)).Take(int.Parse(Records)).ToArrayAsync());
        }
        else{
            Response.Cookies.Append("Records","6",new CookieOptions{
                HttpOnly=false,
                Secure=false,
                SameSite=SameSiteMode.Strict,
                Expires=DateTime.UtcNow.AddMonths(1)
            });
            return View(await _db.Product.Skip(6*(Id-1)).Take(6).ToArrayAsync());
        }
  
    }
    
    //各個商品頁面
    public async Task<IActionResult> Product([FromRoute] string Id){
        return View(await _db.Product.Where(e=>e.Id==Id).FirstAsync());
    }
    public IActionResult Cart(){
        ViewData["user"]=_user;
        if(_user==null){
            return View("CartEmpty");
        }
        _db.Cart.Where(e=>e.UserId==_user.Id).Select(e=>new {e.Product.name,e.Product.path,e.Product.price,e.Number});
        
        return View();
    }
    [HttpPost]
    public async Task<IActionResult> CartAdd([FromBody]Cart cart){
        cart.UserId=_user.Id;
        var data=await _db.Cart.Include(c=>c.Product).Where(e=>e.UserId==cart.UserId&&e.ProductId==cart.ProductId).FirstOrDefaultAsync();
        if(data==null){
            if(cart.Delta.HasValue)
                cart.Number=(int)cart.Delta;
            await _db.Cart.AddAsync(cart);
            await _db.SaveChangesAsync();
            data=await _db.Cart.Include(c=>c.Product).Where(e=>e.UserId==cart.UserId&&e.ProductId==cart.ProductId).FirstOrDefaultAsync();
            await CartCheck(data!);
            return Json(new {data.ProductId,data.Number,Icon=data.Product.path,Price=data.Product.price});
        }
        else{
            if(cart.Delta.HasValue)
                data.Number+=(int)cart.Delta;
            else
                data.Number=cart.Number;
            _db.Cart.Update(data);
            await _db.SaveChangesAsync();
            await CartCheck(data);
            return Json(new {data.ProductId,data.Number,Icon=data.Product.path,Price=data.Product.price});
        }
    }
    public async Task CartCheck(Cart cart){
        if(cart.Number<=0){
            _db.Cart.Remove(cart);
            await _db.SaveChangesAsync();
        }
    }
    [HttpGet]
    public  async Task<IActionResult> CartAll(){
        return Json(new{data=await _db.Cart.Include(e=>e.Product).Where(e=>e.UserId==_user.Id)
        .Select(e=>new{e.ProductId,e.Number,Icon=e.Product.path,Price=e.Product.price,Name=e.Product.name}).ToArrayAsync()});
    }
    
}