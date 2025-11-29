using Microsoft.EntityFrameworkCore;
using RestAPI.Database;
using RestAPI.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("SortiermeisterPolicy", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
            ?? ["http://localhost:3000"];
        var allowedMethods = builder.Configuration.GetSection("AllowedMethods").Get<string[]>()
            ?? ["GET"];
        policy.WithOrigins(allowedOrigins)
              .WithMethods(allowedMethods)
              .WithHeaders("Content-Type", "Authorization")
              .AllowCredentials();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ConnectionSqlite")));

builder.Services.AddScoped<IWinnerRecordService, WinnerRecordService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("SortiermeisterPolicy");
app.UseAuthorization();
app.MapControllers();
app.UseStaticFiles();

app.Run();