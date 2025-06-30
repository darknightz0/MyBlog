using System.ComponentModel.DataAnnotations;
using System.Dynamic;
using System.Text.Json;

namespace MyBlog.Models;


public static class DataExtension{
    /// <summary>
    /// JsonSerializer.Serialize(this)
    /// </summary>
    /// <param name="obj"></param>
    /// <returns></returns>
    public static string toJson(this object obj){
        
        return JsonSerializer.Serialize(obj);
    }
    
    public static object? toObject(this string Json){
        return JsonSerializer.Deserialize<object>(Json);
    }
    /// <summary>
    /// Product[Feature]=Array;
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="JsonDB"></param>
    /// <returns></returns>
    public static T? toObject<T>(this string JsonDB)where T:new(){
        return JsonSerializer.Deserialize<T>(JsonDB);
    }
   
   public static DateTime twNow(this DateTime empty){
    return DateTime.UtcNow.AddHours(8);
   }
}