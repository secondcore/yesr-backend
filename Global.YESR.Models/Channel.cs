using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Global.YESR.Models
{
    /// <summary>
    /// The Channel data must be seeded in the database upom initilization. The equated values are used throughout the code.
    /// </summary>
    public class Channel
    {
        public const string Web = "Web";
        public const string Form = "Form";

        [Key, DatabaseGenerated((DatabaseGeneratedOption.None))]
        public string Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
    }
}
