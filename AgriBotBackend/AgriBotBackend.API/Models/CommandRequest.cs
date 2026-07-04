using System.ComponentModel.DataAnnotations;

namespace AgriBotBackend.API.Models;

public class CommandRequest
{
    [Required(ErrorMessage = "Command is required")]
    [StringLength(20, MinimumLength = 1)]
    public string Command { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Value is required")]
    [RegularExpression(@"^[0-9]+$", ErrorMessage = "Value must be a number")]
    public string Value { get; set; } = string.Empty;
}