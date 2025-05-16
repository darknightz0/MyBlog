using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyBlog.DBModels;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<UserDbContext>(
    op=>op.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddIdentity<MyUser,MyRole>(options =>
    {
        options.Password.RequireDigit = true;
        options.Password.RequireUppercase=false;
        options.Password.RequireLowercase=false;
        options.Password.RequiredLength = 6;
        options.Password.RequireNonAlphanumeric=false;
        options.User.RequireUniqueEmail=false;
        
    })
    .AddEntityFrameworkStores<UserDbContext>()
    .AddDefaultTokenProviders();
    
var app = builder.Build();
await Myinit.InitDBAync(app.Services);
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.UseAntiforgery();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
