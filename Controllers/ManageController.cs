using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using MyBlog.DBModels;
using MyBlog.Models;

namespace MyBlog.Controllers;

public class ManageController : Controller
{
    private readonly UserManager<MyUser>_userManager;
    private readonly UserDbContext _userDbContext;
    private MyUser? user;
    public  ManageController(UserManager<MyUser> userManager,UserDbContext userDbContext
    ){
        //UserDBContext
       _userManager=userManager;
        _userDbContext= userDbContext;
    }
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        user=await _userManager.GetUserAsync(User);
        await next();
    }
    

    [Authorize(Roles ="Admin")]
    public IActionResult Users(){
        return View(new LogForm());
    }
    [Authorize(Roles ="Admin")]
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> UserDelete(string userId){
        var user =await _userManager.FindByIdAsync(userId);
        Console.WriteLine("刪除"+user!.UserName+"開始");
        await _userManager.DeleteAsync(user);
        return RedirectToAction("Users"); 
    }
    [Authorize(Roles ="Admin")]
    [HttpPost]
    public async Task<IActionResult> UserCreate(LogForm info){
        if(await _userManager.FindByNameAsync(info.Name)==null){
            Console.WriteLine("新增"+info.Name+"開始");
            var user=new MyUser
            {
                UserName = info.Name,
                DisplayName = "使用者",
                EmailConfirmed = true
            };
            await _userManager.CreateAsync(user,info.Password);
            await _userManager.AddToRoleAsync(user,"User");
        }
        else
        Console.WriteLine("重複新增"+info.Name);
        return RedirectToAction("Users"); 
    }
    //Prodct
    
    [Authorize(Roles ="Admin")]
    public IActionResult Product(){
        var p=new Product();
        p.UserId=user!.Id;
        
        return View(p);
    }
    [Authorize(Roles ="Admin")]
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> ProductCreate(Product product){
       
        var filetype = new List<string> { ".png", ".jpg", ".jpeg" };
        
        Console.WriteLine("!!!!!"+product.formFile.FileName);
        string? type=Path.GetExtension(product.formFile.FileName).ToLower();
        if(filetype.Contains(type)){

            if (await _userDbContext.Product.Where(e=>e.UserId==user!.Id&&e.name==product.name).FirstOrDefaultAsync()==null){
                product.createDateTime=DateTime.Now;
                product.path=Myfun.Combine("/UserAsset",user!.Id,product.name+type);
                var path=Myfun.Combine(Myfun.GetCurrentDirectory(),"wwwroot","UserAsset",user!.Id);
                Directory.CreateDirectory(path);
                
                path=Myfun.Combine(path,product.name+type);
                Console.WriteLine( "錯誤"+ModelState.ErrorCount);
                foreach(var i in ModelState.Values.SelectMany(v => v.Errors))
                    Console.WriteLine( "!!!錯誤 "+i.ErrorMessage);
            if(true){
                
            Console.WriteLine("有效的檔案格式");
            using(var filestream=new FileStream(path,FileMode.Create)){
                await product.formFile.CopyToAsync(filestream);
            }
            await _userDbContext.Product.AddAsync(product);
            await _userDbContext.SaveChangesAsync();
            }
            else
                Console.WriteLine("無效驗證");
            }
            else
                Console.WriteLine("重複的檔案");
        }
        else
            Console.WriteLine("無效的檔案格式 "+type??" 空的");
        return RedirectToAction("Product");
    }
    [Authorize(Roles ="Admin")]
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> ProductDelete(string pId){
        var p=_userDbContext.Product.Single(e=>e.Id==pId);
        var path=Myfun.currentPath(p.path);//!!!!!!!!!!!! /path
        if(System.IO.File.Exists(path)){
            System.IO.File.Delete(path);
            Console.WriteLine("刪檔成功");
        }
        _userDbContext.Product.Remove(p);
        await _userDbContext.SaveChangesAsync();
        return RedirectToAction("Product"); 
    }
}
