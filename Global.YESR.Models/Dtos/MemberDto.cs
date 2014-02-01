using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Dtos
{
    public class MemberDto
    {
        public string EnrollmentChannel { get; set; }
        public string PrefContact { get; set; }
        public string PrefCurrency { get; set; }
        public string PrefLanguage { get; set; }
        public int PrefTimeZone { get; set; }
        public string PrefMemberType { get; set; }
        public string NationalId { get; set; }
        public string CitizenshipCountry { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string LandPhone { get; set; }
        public string MobilePhone { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Postal { get; set; }
        public DateTime CreateDate { get; set; }
        public int MerchantId { get; set; }
        public int SponsorId { get; set; }
    }
}
