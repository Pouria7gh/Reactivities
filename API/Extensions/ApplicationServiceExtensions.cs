using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Presistence;
using FluentValidation;
using Application.Common;
using Application.Interfaces;
using Infrastructure.Security;
using Infrastructure.Photos;
using AutoMapper;

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
                policy.AllowAnyMethod()
                    .AllowAnyHeader()
                    .WithOrigins("http://localhost:3000")
                    .AllowCredentials();
            });
        });
        services.AddValidatorsFromAssembly(typeof(Edit.Validator).Assembly);
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(List).Assembly);
            config.AddOpenBehavior(typeof(ValidationBehavior<,>));
        });
        services.AddSingleton<IUserAccessor, UserAccessor>();
        services.AddSingleton(provider => new MapperConfiguration(cnf =>
        {
            cnf.AddProfile(new MappingProfiles(provider.GetService<IUserAccessor>()));
        }).CreateMapper());
        services.AddSwaggerGen();
        services.AddHttpContextAccessor();
        services.AddScoped<IPhotoAccessor, PhotoAccessor>();
        services.Configure<CloudinarySettings>(config.GetSection("Cloudinary"));
        services.AddSignalR();

        return services;
    }
}
