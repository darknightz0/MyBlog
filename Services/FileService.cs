using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MyBlog.DBModels;
using MyBlog.Models;

namespace MyBlog.Services;
public class FileService:IFileService{
    public bool IsFileType(IFormFile formFile,FileMines fileMines){
        return fileMines.IsInCategory(Path.GetExtension(formFile.FileName));
    }
    public async Task Upload(IFormFile formFile,string path){
        using var filestream = new FileStream(path, FileMode.Create);
        await formFile.CopyToAsync(filestream);
        Console.WriteLine(path+formFile.FileName+"已建立");
    }
    /// <summary>
    /// 
    /// </summary>
    /// <param name="wPath">
    /// 在wwwroot之下的路徑
    /// </param>
    /// <param name="rename"></param>
    /// <returns></returns>
    /// <exception cref="FileNotFoundException"></exception>
    public FileStreamResult DownloadFromWwwroot(string wPath,string? rename=null){
        var safePath = "".GetWwwPath(wPath);
         if (!File.Exists(safePath))
        {
            throw new FileNotFoundException("檔案不存在");
        }

        var stream = new FileStream(safePath, FileMode.Open, FileAccess.Read);
        
        if(rename==null)
            return new FileStreamResult(stream, wPath.Mine());
        return new FileStreamResult(stream, wPath.Mine()) { FileDownloadName = rename };
    }
    public void DeletUserData(string wPath){ 
        var safePath = "".Combine("".GetWwwPath(),wPath);
         if (!File.Exists(safePath))
        {
            throw new FileNotFoundException("檔案不存在"+safePath);
            
        }
        File.Delete(safePath);
        Console.WriteLine("刪檔成功");
    }
}

