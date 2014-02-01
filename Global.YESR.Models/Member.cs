using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// The Parent property refers to the member who referred this member
    /// A member may have multiple Memberships....perhaps for different instances or sponsors
    /// The Member time zone is quite important as the system adjusts all date stamps to the member's preferred zone
    /// A member may opt out from receiving any communication from YESR via the preferred contact if set to NONE
    /// 
    /// There are several types of YESR members:
    /// Regular  
    /// Founding - those that seeded the YESR platform with an initial 7000 DHS investmant
    /// YESR - sits on top of the Matrix and every other member is referred by this top-seeded member 
    /// Merchant - one of the benefits of merchants in the YESR platform is that they themselves are members allowing them to get bonuses
    /// Sponsor - same as merchants. National Bonds, for example, might refer all of its 650,000 members to become YESR members.   
    /// </summary>
    abstract public class Member
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 1)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; }
        [Required]
        [StringLength(150, MinimumLength = 5)]
        [DataType(DataType.EmailAddress)]
        [RegularExpression(@"^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$")]
        public string Email { get; set; }
        [Required]
        [StringLength(150, MinimumLength = 5)]
        public string City { get; set; }
        [StringLength(150, MinimumLength = 5)]
        public string Postal { get; set; }
        [StringLength(20, MinimumLength = 6)]
        [Display(Name = "Land Phone")]
        public string LandPhone { get; set; }
        [StringLength(20, MinimumLength = 6)]
        [Display(Name = "Mobile Phone")]
        public string MobilePhone { get; set; }
        [Required]
        [StringLength(150, MinimumLength = 5)]
        [Display(Name = "National Id")]
        public string NationalId { get; set; } // Passport or Emirates Id, for example
        [Display(Name = "Member Since")]
        public DateTime MemberSince { get; set; }
        public Country CitizenshipCountry { get; set; }
        public Channel EnrollmentChannel { get; set; }
        public Contact PreferredContact { get; set; }
        public Language PreferredLanguage { get; set; }
        public Currency PreferredCurrency { get; set; }
        public Country ResidenceCountry { get; set; }
        public YESR.Models.TimeZone PreferredTimeZone { get; set; }
        public MemberType Type { get; set; }
    }
}
