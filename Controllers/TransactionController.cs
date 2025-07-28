using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MyBlog.DBModels;

namespace MyBlog.Controllers;
public class TransactionController : Controller{
    private readonly UserManager<MyUser> _userManager;
    private readonly UserDbContext _db;
    private MyUser? _user;
    public TransactionController(UserManager<MyUser> userManager,UserDbContext db){
        _userManager=userManager;
        _db=db;
    }
    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        _user=await _userManager.GetUserAsync(User);
        if(_user==null){
            RedirectToAction("LogPage","Log");
        }
        else
        await next();
    }
    public IActionResult test(){ 
        return Content("成功");
    }
}