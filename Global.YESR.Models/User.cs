using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 5)]
        public string Name { get; set; }

        [Required]
        [StringLength(30, MinimumLength = 5)]
        public string Login { get; set; }

        [Required]
        [StringLength(128, MinimumLength = 128)]
        public string Password { get; set; }

        [Required]
        [StringLength(150, MinimumLength = 5)]
        [DataType(DataType.EmailAddress)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")]
        public string Email { get; set; }

        public string PhotoUrl { get; set; }

        public Group Group { get; set; }
        public ICollection<Role> Roles { get; set; }
        public ICollection<ConfigurationItem> ConfigurationItems { get; set; }

        [NotMapped]
        public string MembershipNumber
        {
            get
            {
                if (ConfigurationItems.Count > 0)
                {
                    foreach (ConfigurationItem item in ConfigurationItems)
                    {
                        if (item.Key == ConfigurationItem.MembershipNumber)
                            return item.Value;
                    }

                    return "";
                }
                else
                {
                    return "";
                }
            }
        }

        [NotMapped]
        public string MerchantCode
        {
            get
            {
                if (ConfigurationItems.Count > 0)
                {
                    foreach (ConfigurationItem item in ConfigurationItems)
                    {
                        if (item.Key == ConfigurationItem.MerchantCode)
                            return item.Value;
                    }

                    return "";
                }
                else
                {
                    return "";
                }
            }
        }

        [NotMapped]
        public string SponsorCode
        {
            get
            {
                if (ConfigurationItems.Count > 0)
                {
                    foreach (ConfigurationItem item in ConfigurationItems)
                    {
                        if (item.Key == ConfigurationItem.SponsorCode)
                            return item.Value;
                    }

                    return "";
                }
                else
                {
                    return "";
                }
            }
        }

        [NotMapped]
        public string YesrCode
        {
            get
            {
                if (ConfigurationItems.Count > 0)
                {
                    foreach (ConfigurationItem item in ConfigurationItems)
                    {
                        if (item.Key == ConfigurationItem.YesrCode)
                            return item.Value;
                    }

                    return "";
                }
                else
                {
                    return "";
                }
            }
        }

        public User()
        {
            Roles = new List<Role>();
            ConfigurationItems = new List<ConfigurationItem>();
        }
    }
}
