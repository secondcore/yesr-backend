using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    public class Role
    {
        public const string Admins = "Admins";
        public const string Officers = "Officers";
        public const string SupportAgents = "SupportAgents";
        public const string Marketing = "Marketing";
        public const string IT = "IT";

        [Key, DatabaseGenerated((DatabaseGeneratedOption.None))]
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<User> Users { get; set; }

        public Role()
        {
            Users = new List<User>();
        }
    }
}
