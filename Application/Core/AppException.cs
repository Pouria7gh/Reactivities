namespace Application.Core;

public class AppException
{
    public int Status { get; set; }
    public string Message { get; set; }
    public string Details { get; set; }

    public AppException(int status, string message, string details)
    {
        Status = status;
        Message = message;
        Details = details;
    }
}
