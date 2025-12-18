using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class PhotosController : BaseApiController
{
    [HttpPost]
    public async Task<IActionResult> Add([FromForm] IFormFile photo)
    {
        return HandleResult(await Send(new AddPhoto.Command { Photo = photo }));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        return HandleResult(await Send(new DeletePhoto.Command { PublicId = id }));
    }

    [HttpPost("{id}/setMain")]
    public async Task<IActionResult> SetMainPhoto(string id)
    {
        return HandleResult(await Send(new SetMainPhoto.Command {PublicId = id}));
    }
}
