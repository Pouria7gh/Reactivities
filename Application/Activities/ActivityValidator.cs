using Domain;
using FluentValidation;

namespace Application.Activities;

public class ActivityValidator : AbstractValidator<Activity>
{
    public ActivityValidator()
    {
        RuleFor(x => x.Category).NotEmpty().OverridePropertyName("Category");
        RuleFor(x => x.City).NotEmpty().OverridePropertyName("City");
        RuleFor(x => x.Date).NotEmpty().OverridePropertyName("Date");
        RuleFor(x => x.Description).NotEmpty().OverridePropertyName("Description");
        RuleFor(x => x.Title).NotEmpty().OverridePropertyName("Title");
        RuleFor(x => x.Venue).NotEmpty().OverridePropertyName("Venue");
    }
}
