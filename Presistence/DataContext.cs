using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Presistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(entity =>
            {
                entity.HasKey(e => new { e.ActivityId, e.AppUserId });
                entity.HasOne(e => e.Activity).WithMany(e => e.Attendees).HasForeignKey(e => e.ActivityId);
                entity.HasOne(e => e.AppUser).WithMany(e => e.Activities).HasForeignKey(e => e.AppUserId);
            });
        }
    }
}