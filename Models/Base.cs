using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using MyBlog.DBModels;

namespace MyBlog.Models;

public class DBSetBase{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    [Key]
    public string Id{get;set;}
    public DateTime LastModify{get;set;}=DateTime.UtcNow.AddHours(8);
}
public class ShopBase:DBSetBase{
    [ForeignKey("User")]
    public string UserId{get;set;}
    [ForeignKey("Product")]
    public string ProductId{get;set;}
    [JsonIgnore]
    public MyUser User{get;set;}
    [JsonIgnore]
    public Product Product{get;set;}
}