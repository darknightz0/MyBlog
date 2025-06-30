using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using MyBlog.DBModels;

namespace MyBlog.Models;
public class Transaction:DBSetBase{
    [ForeignKey("User")]
    public string UserId{get;set;}
    [JsonIgnore]
    public MyUser User{get;set;}
    public int Total {get;set;}
    public string PaymentMethod{get;set;}
    //Json
    public string OrdersId{get;set;}="{}";
}