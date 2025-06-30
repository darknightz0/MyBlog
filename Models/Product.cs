
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
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
    //Json Array
    [JsonIgnore]
    public string Feature{get;set;}=string.Empty;
    [NotMapped]
    public string[] FeatureObj{get;set;}
    public DateTime CreateDateTime_TW{get;set;}=DateTime.UtcNow.AddHours(8);
    public string UserId{get;set;}=string.Empty;
    
    [JsonIgnore]
    public MyUser? User{get;set;}
}
