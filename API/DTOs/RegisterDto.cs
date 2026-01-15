using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [MinLength(3)]
    public string Username { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    [RegularExpression("(?=.*\\d)(?=.*[A-Z])(?=.*[a-z]).{4,20}$", ErrorMessage = "Password is too weak")]
    public string Password { get; set; }
    [Required]
    [MinLength(3)]
    public string DisplayName { get; set; }
}
