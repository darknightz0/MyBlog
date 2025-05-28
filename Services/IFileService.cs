using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyBlog.Models;

namespace MyBlog.Services;

public interface IFileService{
    public bool IsFileType(IFormFile formFile,FileMines fileMines);
    public Task Upload(IFormFile formFile,string path);
    public FileStreamResult DownloadFromWwwroot(string filePath,string rename="");
   public void DeletUserData(string wPath);
}
