

namespace MyBlog.Models;
public enum FileMines{
    Image,
    Music,
    Video,
    App,
    Text
}
public static class FileMinesExtension{
    /// <summary>
    /// 枚舉變實際值
    /// </summary>
    /// <param name="fileMines"></param>
    /// <returns>
    /// Mines type array
    /// </returns>
     public static string[] Content(this FileMines fileMines){
        return fileMines switch
        {
            FileMines.Image=> [".png", ".jpg", ".jpeg"],
            FileMines.Music=> [".mp3"],
            FileMines.Video=> [".mp4"],
            FileMines.App=> [".pdf",".zip",".json",".js"],
            FileMines.Text=>[".html",".css",".csv"],
            _=>["unknowContent"]
        };
    }
    /// <summary>
    /// 取的所屬 "[mine]/" 字串 
    /// </summary>
    /// <param name="fileMines"></param>
    /// <returns></returns>
    public static string Category(this FileMines fileMines){
        return fileMines switch
        {
            FileMines.Image=> "image/",
            FileMines.Music=> "audio/",
            FileMines.Video=> "video/",
            FileMines.App=> "application/",
            FileMines.Text=> "text/",
            _=>"unknowCategory"
        };
    }
    public static bool IsInCategory(this FileMines fileMines, string fileName){
        var str=Path.GetExtension(fileName);
        return fileMines.Content().Contains(str);
    }
    public static bool IsInCategory(this string fileName,FileMines fileMines){
        var str=Path.GetExtension(fileName);
        return fileMines.Content().Contains(str);
    }
    /// <summary>
    /// 取的所屬 "[mine]/[file.Extension]" 字串 
    /// 下載時 FileStreamResult 可用
    /// </summary>
    public static string Mine(this string fileName){
        var str=Path.GetExtension(fileName);
        foreach(FileMines i in Enum.GetValues(typeof(FileMines))){
           if(i.IsInCategory(str))
            return i.Category()+str.Replace(".","");
        }
        return "unknowMine";
    }
}
