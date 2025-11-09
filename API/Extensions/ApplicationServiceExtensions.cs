using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Presistence;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<DataContext>(options =>
        {
            options.UseSqlServer(config.GetConnectionString("Default"));
        });

        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy.AllowAnyMethod().AllowAnyHeader().WithOrigins("http://localhost:3000");
            });
        });

        services.AddMediatR(config => config.RegisterServicesFromAssembly(typeof(List).Assembly));

        services.AddAutoMapper(typeof(MappingProfiles).Assembly);

        return services;
    }
}
