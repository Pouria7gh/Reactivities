using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class ProfileUpdateDto
{
    [Required]
    [MaxLength(100)]
    [MinLength(2)]
    public string DisplayName { get; set; }
    
    [MaxLength(300)]
    public string Bio { get; set; }
}