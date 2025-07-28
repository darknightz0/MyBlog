using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using MyBlog.DBModels;
namespace MyBlog.Models;

public class EmailVerification{
    public EmailVerification(string userId){
        UserId=userId;
        var rnd=new Random();
            foreach(var i in Enumerable.Range(0,6)){
                Code+=rnd.Next(10).ToString();
            }
        Expire="".Now().AddMinutes(3);
    }
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id{get;set;}
    [ForeignKey("User")]
    public string UserId{get;set;}
    public string Code{get;set;}="";
    public DateTime Expire{get;set;}
    [JsonIgnore]
    public MyUser User{get;set;}
}