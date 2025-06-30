using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using MyBlog.DBModels;

namespace MyBlog.Models;
public enum OrderStatus{
start,deliver,deliverPay,waitPay,finish
}
public static class OrderExtesion{
    public static string content(this OrderStatus orderStatus){
        return orderStatus switch{
            OrderStatus.start=>"未出貨",
            OrderStatus.deliver=>"已出貨 運送中",
            OrderStatus.deliverPay=>"已出貨 運送中(貨到付款)",
            OrderStatus.waitPay=>"貨到待付款",
            OrderStatus.finish=>"完成"
        };
    }
}
public class Order:DBSetBase{
    [ForeignKey("Buyer")]
    public string BuyerId{set;get;}
    [ForeignKey("Seller")]
    public string SellerId{set;get;}
    [ForeignKey("Product")]
    public string ProductId{set;get;}
    public int Price{set;get;}
    public int Number{set;get;}
    public string Name{set;get;}
    public string Destination{set;get;}
    public string Address{set;get;}
    public string Status{set;get;}
    public DateTime DeliveryTimeFrom{set;get;}
    public DateTime DeliveryTimeTo{set;get;}
    [JsonIgnore]
    public MyUser Buyer{get;set;}
    [JsonIgnore]
    public MyUser Seller{get;set;}
    [JsonIgnore]
    public Product Product{get;set;}
}