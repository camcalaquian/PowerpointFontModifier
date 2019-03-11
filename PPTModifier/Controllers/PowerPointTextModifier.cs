using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PPTModifier.Config;
using PPTModifier.Utilities;
using Spire.Presentation;

namespace PPTModifier2.Controllers
{
    [Route("api/[controller]")]
    public class PowerPointTextModifier : Controller
    {
        /// <summary>
        /// Takes a powerpoint file, font name and font size then updates the power point file's font to the input font and font size
        /// </summary>
        /// <param name="file">The powerpoint file</param>
        /// <param name="fontName">The new font to be used</param>
        /// <param name="fontSize">The new font size to be used</param>
        /// <returns>Returns the link of the new powerpoint file</returns>
        [HttpPost("ModifyFontAttribute")]
        public IActionResult ModifyText(IFormFile file, string fontName, float fontSize)
        {
            string outputFileRoute = string.Empty;
            using (var presentation = new Presentation())
            {
                //Load uploaded file
                presentation.LoadFromStream(file.OpenReadStream(), FileFormat.Auto);
                //Update all fonts
                PowerPointFontUtility.UpdateAllFontStyle(presentation, fontName, fontSize);
                //Generate filename
                string fileOutputName = $"{Config.OutputPrefix}-{DateTime.Now.ToFileTime()}.pptx";
                //Save to new file
                presentation.SaveToFile($"{Config.OutputFolder}/{fileOutputName}", FileFormat.Auto);
                outputFileRoute = $"{Config.OutputRoute}/{fileOutputName}";
            }

            return Ok(outputFileRoute);
        }
        /// <summary>
        /// Gets all system fonts
        /// </summary>
        /// <returns>Returns a list of system fonts</returns>
        [HttpGet("GetAvailableFonts")]
        public IActionResult GetAvailableFonts()
        {
            //Get system fonts
            IEnumerable<FontFamily> fonts = System.Drawing.FontFamily.Families;
            return Json(fonts.Where(font=> font.Name != string.Empty).Select(font=> new { name = font.Name }));
        }
    }
}
