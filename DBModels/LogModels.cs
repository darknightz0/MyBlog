using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MyBlog.Models;

namespace MyBlog.DBModels;

public class UserDbContext: IdentityDbContext<MyUser,MyRole, string>
{
    public UserDbContext(DbContextOptions<UserDbContext> options)
        : base(options)
    {
       //Database.EnsureCreated();
       
    }
    public DbSet<Product> Product{get;set;}
    // 也可以自行加 DbSet<YourModel>
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Product>()
        .HasOne(e=>e.User)
        .WithMany(e=>e.Products)
        .HasForeignKey(e=>e.UserId)
        .OnDelete(DeleteBehavior.Cascade);
    }
}
public sealed class Myinit{
    public static async Task InitDBAync(IServiceProvider serviceProvider){
        /*
        如果你直接使用 app.Services會導致錯誤，
        但 roleManager 和 userManager 需要Scoped，而 app.Services 是 根級 (root-level) 容器
        */
        using var scope = serviceProvider.CreateScope(); // ✅ 建立 Scope
        var services = scope.ServiceProvider;

        var roleManager = services.GetRequiredService<RoleManager<MyRole>>();
        var userManager = services.GetRequiredService<UserManager<MyUser>>();
        // 建立角色
     
        var roles = new[] { "Admin", "User" };
        foreach (var role in roles)
        {

            if (!await roleManager.RoleExistsAsync(role))
            {
                var result = await roleManager.CreateAsync(new MyRole { Name = role, Description = $"Default {role} role" });
if (!result.Succeeded)
{
    Console.WriteLine($"建立角色失敗: {string.Join(", ", result.Errors.Select(e => e.Description))}");
}
            }
        }
        
         // 建立管理員帳號
        var adminEmail = "admin@example.com";
        var adminUser = await userManager.FindByEmailAsync(adminEmail);
        if (adminUser == null)
        {
            adminUser = new MyUser
            {
                UserName = "admin",
                Email = adminEmail,
                DisplayName = "系統管理員",
                EmailConfirmed = true
            };
            
            var result = await userManager.CreateAsync(adminUser, "admin123");
if (!result.Succeeded)
{
    Console.WriteLine($"建立管理員失敗: {string.Join(", ", result.Errors.Select(e => e.Description))}");
}
            await userManager.AddToRoleAsync(adminUser, "Admin");
        }
        var uu=await userManager.FindByNameAsync("admin");
        if(await userManager.IsInRoleAsync(uu,"User"))
        await userManager.AddToRoleAsync(uu, "User");
    }
} 
// Models/ApplicationUser.cs
public class MyUser : IdentityUser
{
    public string DisplayName { get; set; }=string.Empty;
    public ICollection<Product> Products{ get; set; }
   
}

public class MyRole : IdentityRole
{
    public string Description { get; set; }=string.Empty;

}
public class LogForm{
    [Required]
    public string Name{get;set;}=string.Empty;
    [Required]
    [DataType(DataType.Password)]
    public string Password{get;set;}=string.Empty;
    [NotMapped]
    public static readonly string[] name=["帳號","密碼"];
    [NotMapped]
    public static readonly string mess ="";
}