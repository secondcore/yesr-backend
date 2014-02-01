using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    public class ConfigurationItem
    {
        // Some configuration item keys
        public const string MembershipNumber = "MembershipNumber";
        public const string MerchantCode = "MerchantCode";
        public const string SponsorCode = "SponsorCode";
        public const string YesrCode = "YesrCode";

        public int Id { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }
        public User User { get; set; }
    }
}
