

using System.Threading.Tasks;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.CodeAnalysis.Differencing;
using MyBlog.DBModels;
using MyBlog.Models;
using MyBlog.Services;

namespace MyBlog.Controllers;
public class UserController : Controller{
    private readonly SignInManager<MyUser>_signInManager;
    private readonly UserManager<MyUser> _userManager;
    private readonly UserDbContext _db;
    private MyUser? _user;
    public UserController(UserManager<MyUser> userManager,UserDbContext db,SignInManager<MyUser> signInManager){
        _userManager=userManager;
        _db=db;
        _signInManager=signInManager;
    }
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        _user=await _userManager.GetUserAsync(User);
        await next();
    }
    
    public IActionResult Info(){ 
        return View(_user);
    }
    public IActionResult Name(){ 
        return View(new UserDto());
    }
    public IActionResult Gender(){ 
        return View(new UserDto());
    }
    public IActionResult Birthday(){ 
        return View(new UserDto());
    }
    public IActionResult Icon(){ 
        return View(new UserDto());
    }
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> Revise([FromForm] UserDto data,[FromServices] IFileService _fileService){ 
    if (data.DisplayName != null) _user.DisplayName = data.DisplayName;
    if (data.Birthday!= null) _user.Birthday =data.Birthday;
    if (data.Gender != null) _user.Gender = data.Gender;
        if (data.Icon != null) {
        var type=data.Icon.FileName.GetExtension();
        if(type.IsInCategory(FileMines.Image)){
            Console.WriteLine("".Combine("".GetUserPath(_user),"Icon"+type));
            _user.Icon="".Combine("".GetUserPath(_user),"Icon"+type);
            await _fileService.Upload(data.Icon,"".Combine("".GetUserFullPath(_user),"Icon"+type));
        }
        }
        
        _db.Users.Update(_user);
        await _db.SaveChangesAsync();
        return RedirectToAction("Info");
    }
    [Authorize(Roles ="User")]
    public async Task<IActionResult> Delete()
    {
        if (!(await _userManager.GetRolesAsync(_user)).Contains("Admin"))
        {
            await _signInManager.SignOutAsync();
            await _userManager.DeleteAsync(_user);
            Directory.Delete("".GetUserFullPath(_user), true);
            return RedirectToAction("LogPage","Log");
        }
        ViewData["welcomeError"]="系統管理員無法被刪除";
        return View("Log/Start",_user);
    }
}