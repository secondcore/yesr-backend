using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using Global.YESR.Models.Invoices;

namespace Global.YESR.Models
{
    /// <summary>
    /// The investment unit is a base class for all possible investment units. Currently there is only one which is the YBond. 
    /// The investment unit is a part of an investment scheme and belongs to a membership
    /// </summary>
    public class InvestmentUnit
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime CreateDate { get; set; } // Adjusted per member's time zone preference
        public DateTime PurchaseDate { get; set; } // Adjusted per member's time zone preference
        public bool IsPurchased { get; set; } // TODO: Added due to a bug in EF
        public double Amount { get; set; } // Adjusted per member's time zone preference
        public string SponsorReference { get; set; }
        public Membership Membership { get; set; } // Owner
        public Sponsor Sponsor { get; set; } // Sponsor
        public InvestmentScheme InvestmentScheme { get; set; }
        public Period Period { get; set; } // Owner
        public SponsorInvoice SponsorInvoice { get; set; } // Owner
        public PayoutEvent PayoutEvent { get; set; } // Owner
        public InvestmentUnit Parent { get; set; }
        public InvestmentUnit LeftChild { get; set; }
        public InvestmentUnit RightChild { get; set; }
    }
}
