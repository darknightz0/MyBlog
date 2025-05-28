
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
    public DateTime CreateDateTime_TW{get;set;}=DateTime.UtcNow.AddHours(8);
    public string UserId{get;set;}=string.Empty;
    public MyUser? User{get;set;}
}
public class UserProduct{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string? Id{get;set;}
    [ForeignKey("User")]
    public string UserId{get;set;}
    [ForeignKey("Product")]
    public string ProductId{get;set;}
    public MyUser User{get;set;}
    public Product Product{get;set;}

    public DateTime LastModify{get;set;}=DateTime.UtcNow.AddHours(8);
}