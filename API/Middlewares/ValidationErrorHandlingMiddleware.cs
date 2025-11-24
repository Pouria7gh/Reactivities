using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace API.Exceptions;

public class ValidationErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    public ValidationErrorHandlingMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (ValidationException ex)
        {
            var details = new ProblemDetails()
            {
                Type = "ValidationFailure",
                Title = "One or more validation errors occurred",
                Status = (int)StatusCodes.Status400BadRequest,
            };
            if (ex.Errors.Any())
            {
                details.Extensions["errors"] = ex.Errors
                    .GroupBy(x => x.PropertyName)
                    .ToDictionary(x => x.Key, x => x.Select(e => e.ErrorMessage).ToArray());
            }
            context.Response.StatusCode = StatusCodes.Status400BadRequest;
            await context.Response.WriteAsJsonAsync(details);
        }
    }
}
