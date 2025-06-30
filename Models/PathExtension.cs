using Microsoft.AspNetCore.Identity;

namespace MyBlog.Models;
public static class PathExtension{
    /// <summary>
    /// 回傳在wwwroot下檔案的全路徑
    /// </summary>
    public static string GetWwwPath(this string empty)
    {
        return "".Combine("".GetCurrentDirectory(),"wwwroot");
    }
    /// <summary>
    /// 回傳在wwwroot下檔案的全路徑
    /// </summary>
    public static string GetWwwPath(this string empty,string wpath)
    {
        return "".Combine("".GetCurrentDirectory(),"wwwroot",wpath);
    }
    public static string GetCurrentDirectory(this string empty){
        return Directory.GetCurrentDirectory().Replace("\\", "/");
    }
    public static string Combine(this string empty,string path1,string path2){
        return Path.Combine(path1,path2).Replace("\\", "/");
    }
    public static string Combine(this string empty,string path1,string path2,string path3){
        return Path.Combine(path1,path2,path3).Replace("\\", "/");
    }
    public static string Combine(this string empty,string path1,string path2,string path3,string path4){
        return Path.Combine(path1,path2,path3,path4).Replace("\\", "/");
    }
    public static string Combine(this string empty,string path1,string path2,string path3,string path4,string path5){
        return Path.Combine(path1,path2,path3,path4,path5).Replace("\\", "/");
    }
    public static string GetUserFullPath(this string empty,IdentityUser user)
    {
        return "".Combine("".GetCurrentDirectory(),"wwwroot","UserAsset",user.Id);
    }
    public static string GetUserPath(this string empty,IdentityUser user)
    {
        return "".Combine("/UserAsset",user.Id);
    }
    
    public static string? GetExtension(this string path)
    {
        return Path.GetExtension(path).ToLower();
    }
    public static string Abs2Rel(this string path)
    {
        return path.Substring(1);
    }
}