using System.ComponentModel.DataAnnotations.Schema;

namespace MyBlog.Models;
public class Cart:ShopBase{
    public int Number{get;set;}
    [NotMapped]
    public int? Delta { get; set; }
}
