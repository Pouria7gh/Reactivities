using Application.Core;

namespace API.Middlewares;

public class ExceptionMiddleware
{
    private readonly IHostEnvironment _env;
    private readonly ILogger<AppException> _logger;
    private readonly RequestDelegate _next;
    public ExceptionMiddleware(RequestDelegate next,
        ILogger<AppException> logger,
        IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
        
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex.Message, ex);
            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            var error = new AppException(
                status: StatusCodes.Status500InternalServerError,
                message: ex.Message,
                details: _env.IsDevelopment() ? ex.StackTrace?.ToString() : null
            );

            await context.Response.WriteAsJsonAsync<AppException>(error);
        }
    }
}
