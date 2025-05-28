namespace MyBlog.Models;
public enum FormColumeName{
    User,Product,Log
}
public static class FormExtension{
    public static string[] Content(this FormColumeName type){
        return type switch
        {
            FormColumeName.User=>["使用者名稱","階級","刪除"],
            FormColumeName.Product=> ["編號","名稱","數量","價錢","圖片","持有者","刪除"],
            FormColumeName.Log=> ["時間","使用者Id","動作","詳細內容"],
            
            _=>["unknowContent"]
        };
    }
    public static string[] ColumeWidth(this FormColumeName type){
        return type switch
        {
            FormColumeName.User=>["使用者名稱","階級","刪除"],
            FormColumeName.Product=> ["編號","名稱","數量","價錢","圖片","持有者","刪除"],
            FormColumeName.Log=> ["15%","15%","20%","50%"],
            
            _=>["unknowContent"]
        };
    }
}