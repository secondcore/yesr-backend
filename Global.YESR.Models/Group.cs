using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    public class Group
    {
        public const string Yesr = "Yesr";
        public const string Members = "Members";
        public const string Merchants = "Merchants";
        public const string Sponsors = "Sponsors";

        [Key, DatabaseGenerated((DatabaseGeneratedOption.None))]
        public string Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
