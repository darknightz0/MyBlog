using Microsoft.AspNetCore.Identity;
using MyBlog.DBModels;

namespace MyBlog.Models;
public enum LogTitle{
    CUser,DUser,CProdut,DProdut,
}
public static class LogExtension{
    //!!!! 可變
    public static UserDbContext? db;
    public static string Context(this LogTitle logTitle){
       return logTitle switch
        {
            LogTitle.CUser=> "新增使用者",
            LogTitle.DUser=> "刪除使用者",
            LogTitle.CProdut=> "新增商品",
            LogTitle.DProdut=> "刪除商品",
            _=>"unknowContent"
        }; 
    }
    public static async Task AddLogAsync(this IdentityUser user,LogTitle logTitle,MyUser myUser,string? context=null){
        var log =new MyLog(){
            UserId=user.Id,
            Title=logTitle.Context(),
            Content=context??myUser.UserName??""
        };
        await db.Log.AddAsync(log);
        await db.SaveChangesAsync();
    }
    public static async Task AddLogAsync(this IdentityUser user,LogTitle logTitle,Product product,string? context=null){
        var log =new MyLog(){
            UserId=user.Id,
            Title=logTitle.Context(),
            Content=context??product.name
        };
        await db.Log.AddAsync(log);
        await db.SaveChangesAsync();
    }
}

