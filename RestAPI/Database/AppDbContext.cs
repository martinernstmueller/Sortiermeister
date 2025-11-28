using Microsoft.EntityFrameworkCore;
using RestAPI.Models;

namespace RestAPI.Database
{
    public class AppDbContext : DbContext
    {
        public DbSet<WinnerRecord> WinnerRecords { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
    }
}
