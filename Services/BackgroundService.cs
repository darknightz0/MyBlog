
using Microsoft.EntityFrameworkCore;
using MyBlog.DBModels;

namespace MyBlog.Services;
public class LogClearService:BackgroundService{
    private readonly IServiceProvider _serviceProvider;
    public LogClearService(IServiceProvider serviceProvider){
        _serviceProvider=serviceProvider;
    }
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        
        while (!stoppingToken.IsCancellationRequested)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<UserDbContext>();
                //Console.WriteLine($"背景任務執行中：{DateTime.Now}");
                await db.Log.OrderByDescending(e=>e.Time).Skip(100).ExecuteDeleteAsync();
            }
            await Task.Delay(TimeSpan.FromDays(1), stoppingToken);
            
        }
    }
}