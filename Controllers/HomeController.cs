using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Models;

namespace MyBlog.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
       
        _logger = logger;
    }

    public IActionResult Index()
    {
        
        return View();
    }
    public IActionResult MyGame()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),"wwwroot","MyGame","main.html"),"text/html");
    }
    public IActionResult MyMatlab()
    {
        return View();
    }
    public IActionResult MyMVC()
    {
        return View();
    }
    public IActionResult MyGL()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),"wwwroot","MySource","MyGL.zip"),"application/zip","MyGL.zip");
    }
    public IActionResult DownloadWave(){
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),"wwwroot","MySource","wave.zip"),"application/zip","wave.zip");
    }
    public IActionResult DownloadTyphoonPath(){
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),"wwwroot","MySource","typhoon_path.zip"),"application/zip","typhoon_path.zip");
    }
    public IActionResult DownloadTyphoonArea(){
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),"wwwroot","MySource","typhoon_area.zip"),"application/zip","typhoon_area.zip");
    }
    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
