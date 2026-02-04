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
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ActivityAttendee>(entity =>
            {
                entity.HasKey(e => new { e.ActivityId, e.AppUserId });
                entity.HasOne(e => e.Activity).WithMany(e => e.Attendees).HasForeignKey(e => e.ActivityId);
                entity.HasOne(e => e.AppUser).WithMany(e => e.Activities).HasForeignKey(e => e.AppUserId);
            });

            builder.Entity<Comment>(comment =>
            {
                comment.HasKey(c => c.Id);
                comment.HasOne(c => c.Activity).WithMany(a => a.Comments).OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<UserFollowing>(entity =>
            {
               entity.HasKey(k => new {k.ObserverId, k.TargetId});

               entity.HasOne(e => e.Observer)
                .WithMany(e => e.Followings)
                .HasForeignKey(e => e.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Target)
                    .WithMany(e => e.Followers)
                    .HasForeignKey(e => e.TargetId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}