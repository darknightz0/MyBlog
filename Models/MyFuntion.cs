namespace MyBlog.Models;
class Myfun{
    /// <summary>
    /// 使wwwroot(~)路徑轉為本機實際路徑
    /// </summary>
    /// <param name="wpath">
    /// wwwroot/wpath...
    /// </param>
    /// <returns>
    /// Directory.GetCurrentDirectory()/wwwroot/wpath
    /// </returns>
    public static string currentPath(string wpath)
    {
        return Combine(GetCurrentDirectory(),"wwwroot"+wpath);
    }
    /// <summary>
    /// 區的當前本機目錄路徑 /
    /// Directory.GetCurrentDirectory().Replace("\\", "/")
    /// </returns>
    public static string GetCurrentDirectory(){
        return Directory.GetCurrentDirectory().Replace("\\", "/");
    }
    public static string Combine(string path1,string path2){
        return Path.Combine(path1,path2).Replace("\\", "/");
    }
    public static string Combine(string path1,string path2,string path3){
        return Path.Combine(path1,path2,path3).Replace("\\", "/");
    }
    public static string Combine(string path1,string path2,string path3,string path4){
        return Path.Combine(path1,path2,path3,path4).Replace("\\", "/");
    }
    public static string Combine(string path1,string path2,string path3,string path4,string path5){
        return Path.Combine(path1,path2,path3,path4,path5).Replace("\\", "/");
    }
}