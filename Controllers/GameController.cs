using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MyBlog.DBModels;

namespace MyBlog.Controllers;
public class GameController : Controller{
    private readonly UserManager<MyUser> _userManager;
    private readonly UserDbContext _db;
    private MyUser? _user;
    public GameController(UserManager<MyUser> userManager,UserDbContext db){
        _userManager=userManager;
        _db=db;
    }
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        _user=await _userManager.GetUserAsync(User);
        await next();
    }
    public IActionResult G1(){ 
        return View();
    }
    public IActionResult Tree(){ 
        return View();
    }
}