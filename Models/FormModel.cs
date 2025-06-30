namespace MyBlog.Models;
public class UserDto{
    public string? DisplayName { get; set; }
    public IFormFile? Icon { get; set; }
    public DateTime? Birthday { get; set; }
    public string? Introduction { get; set; }
    public string? Gender { get; set; }
}