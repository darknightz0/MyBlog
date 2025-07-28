
using System.Threading.Tasks;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using MyBlog.DBModels;
using MyBlog.Models;

namespace MyBlog.Controllers;

public class LogController : Controller
{
    private readonly UserManager<MyUser>_userManager;
    private readonly SignInManager<MyUser>_signInManager;
    private readonly UserDbContext _DB;
    public LogController(UserManager<MyUser> userManager,SignInManager<MyUser> signInManager
    ,UserDbContext userDbContext)

    {
        //UserDBContext
       _userManager=userManager;

       _signInManager=signInManager;
       _DB=userDbContext;
    }
    
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> LogIn(LogForm info){
        
        var v=await _DB.Users.Where(e=>e.Email==info.Name).FirstOrDefaultAsync();
        if(v==null){
            v=await _DB.Users.Where(e=>e.UserName==info.Name).FirstOrDefaultAsync();
        }
        if(v==null){
            ModelState.AddModelError("","帳號或密碼錯誤");
            return View("LogPage",info);
        }
        if ((await _signInManager.CheckPasswordSignInAsync(v, info.Password?? "", false)).Succeeded)
        {
            if (v.EmailConfirmed)
            {
                var res = await _signInManager
                .PasswordSignInAsync(v.UserName!, info.Password! , false, false);
                if (res.Succeeded)
                {
                    return View("Start", await _userManager.GetUserAsync(User));
                }
                else
                {
                    ModelState.AddModelError("", "伺服器錯誤");
                    return View("LogPage", info);
                }
            }
            return NonVerification(v.Id);
        }
        ModelState.AddModelError("", "帳號或密碼錯誤");
        return View("LogPage", info);            
    }
    public async Task<IActionResult> LogOut(){
        Console.WriteLine("登出");
        await _signInManager.SignOutAsync();
        return RedirectToAction("LogPage");
    }
    
    public IActionResult LogPage(){ 
        return View(new LogForm());
    }
    private async Task<EmailDto> SendEmail(MyUser myUser, string subject){
        var it=await _DB.EmailVerification.Where(e=>e.UserId==myUser.Id).FirstOrDefaultAsync();
        EmailVerification e;
        if(it==null||it.Expire<"".Now()){
            if(it!=null)
                _DB.EmailVerification.Remove(it);
            e=new EmailVerification(myUser.Id);
            await _DB.EmailVerification.AddAsync(e);
            await _DB.SaveChangesAsync();
            e=await _DB.EmailVerification.Where(el=>el.UserId==e.UserId).FirstAsync();
        }
        else{
            e=it;
        }
        var email=new MimeMessage();
        email.From.Add(new MailboxAddress("伺服器自動發送","a21641330@gmail.com"));
        email.To.Add(MailboxAddress.Parse(myUser.Email));
        email.Subject = subject;
               
        var    body = $@"
    <html>
    <body style='font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;'>
        <div style='max-width: 600px; margin: auto; background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);'>
            <h2 style='color: #4CAF50;'>您的驗證碼</h2>
            <p>請在 3 分鐘內輸入以下驗證碼完成信箱驗證：</p>
            <div style='font-size: 24px; font-weight: bold; color: #333; background: #eee; padding: 10px 20px; display: inline-block; border-radius: 5px;'>
                <span>{e.Code}</span>
            </div>
            <p style='margin-top: 30px;'>若您未申請此驗證，請忽略此封信。</p>
            <p style='color: #888;'>來自MyBlog</p>
        </div>
    </body>
    </html>";
        email.Body = new TextPart("html") { Text = body };
        using var smtp = new SmtpClient();
        await smtp.ConnectAsync("smtp.gmail.com", 587, MailKit.Security.SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync("a21641330@gmail.com", "faqclomupyftqepo"); // 這裡放剛剛產生的 
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);

        var res = new EmailDto
        {
            Id = e.Id!
        };
        return res;
    }
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> EmailVerificationPage(EmailDto form){
       
        var user=await _DB.Users.Where(e=>e.Id==form.Id).FirstAsync();
        if(user.EmailConfirmed==false){
            return View(await SendEmail(user,"Email驗證"));
        }
        else{
            return RedirectToAction("LogPage");
        }
    }
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> EmailCode([FromForm] EmailDto data){
        
        var it=_DB.EmailVerification.Where(e=>e.UserId==data.Id).FirstOrDefault();
        if(it==null){
            return View("lost");
        }
        else if(it.Expire<"".Now()){
            ViewData["error"]="你的驗證碼已過期!";
            _DB.EmailVerification.Remove(it);
            await _DB.SaveChangesAsync();
            return NonVerification(it.Id);
        }
        else if(it.Code!=data.Code){
            ViewData["error"]="驗證碼錯誤!";
            return View("EmailVerificationPage",data);
        }
        else {
            var user= await _DB.Users.Where(e=>e.Id==it.UserId).FirstAsync();
            user.EmailConfirmed=true;
            _DB.Users.Update(user);
            _DB.EmailVerification.Remove(it);
            await _DB.SaveChangesAsync();
            return RedirectToAction("LogPage");
        }
    }
    [HttpPost]
    [RequireAntiforgeryToken]
    public async Task<IActionResult> SignUp([FromForm]SignUpDto form){
        MyUser? unknowUser,unknowUser2;
        unknowUser=await _DB.Users.Where(e=>e.UserName==form.Name).FirstOrDefaultAsync();
        if(unknowUser!=null&&unknowUser.EmailConfirmed){   
            ModelState.AddModelError("Name","使用者名稱已被使用");
        }
        unknowUser2=await _DB.Users.Where(e=>e.Email==form.Email).FirstOrDefaultAsync();
        if(unknowUser2!=null&&unknowUser2.EmailConfirmed){
            ModelState.AddModelError("Email","Email已被註冊");
        }
        if(ModelState.IsValid){
            await UserDelete(unknowUser);
            await UserDelete(unknowUser2);
            var user=new MyUser
            {
                UserName = form.Name,
                DisplayName = "使用者"+DateTime.Now.ToString("-yyyy-MM-dd"),
                Email=form.Email
            };
            
            await _userManager.CreateAsync(user,form.Password);
            await user.AddLogAsync(LogTitle.CUser,user);
            await _userManager.AddToRoleAsync(user,"User");
                
            Directory.CreateDirectory("".GetUserFullPath(user));
            return NonVerification((await _userManager.FindByEmailAsync(user.Email))!.Id);
        }   
        return View("SignUpPage",form);
    }
    public IActionResult SignUpPage(){
        return View(new SignUpDto());
    }
    public IActionResult Welcome(){
        return View();
    }
    private IActionResult NonVerification(string Id){
        var e=new EmailDto{Id=Id};

        return View("NonVerification",e);
    }
    private async Task UserDelete(MyUser? user){
        if (user != null)
        {
            await _userManager.DeleteAsync(user);
            Directory.Delete("".GetUserFullPath(user), true);
        }
    }
}
