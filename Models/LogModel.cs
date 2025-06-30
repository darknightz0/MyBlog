using System.ComponentModel.DataAnnotations;
namespace MyBlog.Models;

public class MyLog{
    [Key]
    public DateTime Time{get;set;}=DateTime.UtcNow.AddHours(8);
    public string UserId{get;set;}
    public string Title{get;set;}=string.Empty;
    public string Content{get;set;}=string.Empty;

}