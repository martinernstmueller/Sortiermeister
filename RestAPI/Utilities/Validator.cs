using RestAPI.Models;
using System.Drawing;
using System.Xml.Linq;

namespace RestAPI.Utilities
{
    public class Validator
    {
        public static void ValidateString(string value, string paramName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("Value cannot be null or empty.", paramName);
            }
        }
    }
}