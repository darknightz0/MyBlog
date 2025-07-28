using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using MyBlog.DBModels;
using MyBlog.Models;
using MyBlog.Services;
using MyBlog.StaticData;

namespace MyBlog.Controllers;

public class ManageController : Controller
{
    private readonly UserManager<MyUser>_userManager;
    private readonly UserDbContext _userDbContext;
    private readonly IFileService _fileService;
    private MyUser? user;
    public  ManageController(UserManager<MyUser> userManager,UserDbContext userDbContext,IFileService fileService
    ){
        //UserDBContext
       _userManager=userManager;
        _userDbContext= userDbContext;
        _fileService=fileService;
    }
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        user=await _userManager.GetUserAsync(User);
        await next();
    }
    

    [Authorize(Roles ="Admin")]
    public async Task<IActionResult> Users(){
        var f=new LogForm();
        f.select=new List<SelectListItem>();
        var str=await _userDbContext.Roles.Select(e=>new{e.Name,e.Description}).Where(e=>e.Name!="Admin").ToListAsync();
        str.ForEach(e=>{
            f.select.Add(new SelectListItem(){Text=e.Description,Value=e.Name});
        });
        
        return View(f);
    }
    [Authorize(Roles ="Admin")]
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> UserDelete(string userId){
        var nuser =await _userManager.FindByIdAsync(userId);
        await user.AddLogAsync(LogTitle.DUser,nuser);
        await _userManager.DeleteAsync(nuser!);
        Directory.Delete("".GetUserFullPath(nuser),true);
        return RedirectToAction("Users"); 
    }
    [Authorize(Roles ="Admin")]
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> UserCreate(LogForm info){
        if(await _userManager.FindByNameAsync(info.Name)==null){
            
            var nuser=new MyUser
            {
                UserName = info.Name.Substring(0,32),
                DisplayName = "使用者"+DateTime.Now.ToString("-yyyy-MM-dd"),
                EmailConfirmed = false
            };
            await _userManager.CreateAsync(nuser,info.Password);
            await user.AddLogAsync(LogTitle.CUser,nuser);
            switch (info.Role)
            {
                case "Manager":
                    await _userManager.AddToRoleAsync(nuser,"Manager");
                    await _userManager.AddToRoleAsync(nuser,"User");
                    break;
                case "User":
                    await _userManager.AddToRoleAsync(nuser,"User");
                    break;    
                default:
                break;
            }
            Directory.CreateDirectory("".GetUserFullPath(nuser));
        }
        else
        Console.WriteLine("重複新增"+info.Name);
        return RedirectToAction("Users"); 
    }
    //Prodct
    
    [Authorize(Roles ="Manager")]
    public IActionResult Product(){
        var p=new Product();
        p.UserId=user!.Id;
        
        return View(p);
    }
    [Authorize(Roles ="Manager")]
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> ProductCreate([FromForm]Product product){
       
        
        
        Console.WriteLine("!!!!!"+product.formFile.FileName);
        string? type=product.formFile.FileName.GetExtension();
        if(_fileService.IsFileType(product.formFile,FileMines.Image)){

            if (await _userDbContext.Product.Where(e=>e.UserId==user!.Id&&e.name==product.name).FirstOrDefaultAsync()==null){
                
                product.path="".Combine("/UserAsset",user!.Id,product.name+type);
                
                Console.WriteLine( "錯誤"+ModelState.ErrorCount);
                foreach(var i in ModelState.Values.SelectMany(v => v.Errors))
                    Console.WriteLine( "!!!錯誤 "+i.ErrorMessage);
            if(true){
                
            Console.WriteLine("有效的檔案格式");
            
            await _fileService.Upload(product.formFile,"".Combine("".GetUserFullPath(user),product.name+type));
            await user.AddLogAsync(LogTitle.CProdut,product);
            await _userDbContext.Product.AddAsync(product);
            await _userDbContext.SaveChangesAsync();
            StaticProductInfo.DisplayPage++;
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
    [Authorize(Roles ="Manager")]
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> ProductDelete(string pId){
        var p=_userDbContext.Product.Single(e=>e.Id==pId);
        await user.AddLogAsync(LogTitle.DProdut,p);
        _fileService.DeletUserData(p.path.Abs2Rel());
        _userDbContext.Product.Remove(p);
        await _userDbContext.SaveChangesAsync();
        StaticProductInfo.DisplayPage--;
        return RedirectToAction("Product"); 
    }
    [Authorize(Roles ="Admin")]
    public async Task<IActionResult> Log(){
        return View(await _userDbContext.Log.ToArrayAsync()); 
    }
}
