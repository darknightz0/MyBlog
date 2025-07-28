using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace MyBlog.Models;
public class UserDto{
    public string? DisplayName { get; set; }
    public IFormFile? Icon { get; set; }
    public DateTime? Birthday { get; set; }
    public string? Introduction { get; set; }
    public string? Gender { get; set; }
}
public class EmailDto{
    //UserId
    public string Id{get;set;}
    public string Code{get;set;}
}

public class SignUpDto{
    [Required(ErrorMessage ="使用者名稱欄位不可為空")]
    [DisplayName("使用者名稱")]
    [Length(3,16,ErrorMessage ="需在3~16字之間")]
    [RegularExpression(@"^[A-Za-z0-9_]{3,16}$",ErrorMessage ="只可用數字大小寫英文和_")]
    public string Name{get;set;}
    [Required(ErrorMessage ="電子郵件欄位不可為空")]
    [DisplayName("電子郵件")]
    public string Email{get;set;}
    [DisplayName("密碼")]
    [Required(ErrorMessage ="密碼欄位不可為空")]
    [Length(6,16,ErrorMessage ="密碼長度需在6~16之間")]
    [RegularExpression(@"^[A-Za-z0-9!@#$%^&]{6,16}$",ErrorMessage ="只可用數字大小寫英文和!@#$%^&組成")]
    public string Password{get;set;}

}