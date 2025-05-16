using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MyBlog.DBModels;

namespace MyBlog.Models;

public class Product{
    [Required]
    [NotMapped]
    public IFormFile formFile{get;set;}
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string? Id{get;set;}
    [Required]
    public string name{get;set;}=string.Empty;
    [Required]
    [Range(0,int.MaxValue)]
    public int number{get;set;}
    [Required]
    [Range(0,int.MaxValue)]
    public int price{get;set;}
    public string path{get;set;}=string.Empty;
    public DateTime createDateTime;
    public string UserId{get;set;}=string.Empty;
    public MyUser? User{get;set;}
    [NotMapped]
    public static string[] columesName{get;set;}=["編號","名稱","數量","價錢","圖片"];
    
}