using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Models;
using MyBlog.Services;

namespace MyBlog.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly IFileService _fileService;
    public HomeController(ILogger<HomeController> logger,IFileService fileService)
    {
       
        _logger = logger;
        _fileService=fileService;
    }

    public IActionResult Index()
    {
        
        return View();
    }
    public IActionResult MyGame()
    {
        return _fileService.DownloadFromWwwroot("".Combine("MyGame","main.html"));
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
        return _fileService.DownloadFromWwwroot("".Combine("MySource","MyGL.zip"),"MyGL.zip");
    }
    public IActionResult DownloadWave(){
        return _fileService.DownloadFromWwwroot("".Combine("MySource","wave.zip"),"wave.zip");
    }
    public IActionResult DownloadTyphoonPath(){
         return _fileService.DownloadFromWwwroot("".Combine("MySource","typhoon_path.zip"),"typhoon_path.zip");
    }
    public IActionResult DownloadTyphoonArea(){
        return _fileService.DownloadFromWwwroot("".Combine("MySource","typhoon_area.zip"),"typhoon_area.zip");
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
