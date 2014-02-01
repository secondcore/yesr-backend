using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Global.YESR.Models
{
    /// <summary>
    /// There are several types of YESR members:
    /// Regular  
    /// Founding - those that seeded the YESR platform with an initial 7000 DHS investmant
    /// YESR - sits on top of the Matrix and every other member is referred by this top-seeded member 
    /// Merchant - one of the benefits of merchants in the YESR platform is that they themselves are members allowing them to get bonuses
    /// Sponsor - same as merchants. National Bonds, for example, might refer all of its 650,000 members to become YESR members.   
    /// </summary>
    public class MemberType
    {
        public const string Regular = "Regular";
        public const string Founding = "Founding";
        public const string Yesr = "Yesr";
        public const string Merchant = "Merchant";
        public const string Sponsor = "Sponsor";

        [Key, DatabaseGenerated((DatabaseGeneratedOption.None))]
        public string Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
    }
}
