

using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.CodeAnalysis.Differencing;
using MyBlog.DBModels;
using MyBlog.Models;
using MyBlog.Services;

namespace MyBlog.Controllers;
public class UserController : Controller{
    private readonly UserManager<MyUser> _userManager;
    private readonly UserDbContext _db;
    private MyUser? _user;
    public UserController(UserManager<MyUser> userManager,UserDbContext db){
        _userManager=userManager;
        _db=db;
    }
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        _user=await _userManager.GetUserAsync(User);
       if(_user!=null){
        await next();
       }
       else{
        NotLog();
       }
    }
    public IActionResult NotLog(){
        return RedirectToAction("LogPage","Log");
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
}