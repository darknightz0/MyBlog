
using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MyBlog.DBModels;

namespace MyBlog.Controllers;

public class LogController : Controller
{
    private readonly UserManager<MyUser>_userManager;
    private readonly RoleManager<MyRole>_roleManager;
    private readonly SignInManager<MyUser>_signInManager;
    public LogController(UserManager<MyUser> userManager,RoleManager<MyRole> roleManager,SignInManager<MyUser> signInManager
    )

    {
        //UserDBContext
       _userManager=userManager;
       _roleManager=roleManager;
       _signInManager=signInManager;
    }
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> LogIn(LogForm info){
        
        var res=await _signInManager
        .PasswordSignInAsync(info.Name ?? "", info.Password??"",false,false);
        if(res.Succeeded){
            Console.WriteLine("登入成功");
            return View("Start",await _userManager.GetUserAsync(User));
        }
        else{
            Console.WriteLine("登入失敗");
            return View("LogPage",info);
        }
            
    }
    public async Task<IActionResult> LogOut(){
        Console.WriteLine("登出");
        await _signInManager.SignOutAsync();
        return RedirectToAction("LogPage");
    }
    
    public IActionResult LogPage(){ 
        return View(new LogForm());
    }
    
    
}
