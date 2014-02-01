using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Global.YESR.Models
{
    /// <summary>
    /// The Contact data must be seeded in the database upom initilization. The equated values are used throughout the code.
    /// </summary>
    public class Contact
    {
        public const string None = "None";
        public const string Email = "Email";
        public const string Sms = "Sms";

        [Key, DatabaseGenerated((DatabaseGeneratedOption.None))]
        public string Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
    }
}
