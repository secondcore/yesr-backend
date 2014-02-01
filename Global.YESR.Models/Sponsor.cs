using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// The Sponsor class defines the contact between YESR and the sponsor. Although Nationa Bonds is the only foreseable sponsor for a while, the system is designed to support multiple:
    /// National Bonds
    /// Hilal Bank
    /// Etc
    /// 
    /// Some of the contract attributes:
    /// Sponsor pays the member or YESR does
    /// - if YESR pays member, then there are two attributes:
    /// => Number of purchases to qualify for a refund
    /// => Percentage of investment unit purchases
    /// - if SPONSOR pays member, then there are no attributes:
    /// => YESR will determine when the member is due for an investment unit dividend 
    /// 
    /// In both cases, YESR will furnish an invoice. In the first case, the invoice will be paid to YESR while in the second case, the invoice will be paid to the member directly.
    /// 
    /// The CreateInvestmentUnit factory method returns the appropriate investment unit object applicable to each sponsor. In the case of National Bonds, YBond is the only one available. This also 
    /// means that it is not possible to have multiple investment units per sponsor...I don't think this is a great disadvantage. 
    /// </summary>
    abstract public class Sponsor
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Name { get; set; }
        // Signifies whether the sponsor pays the member directly. Hence we only invoice upon dividend
        // If this is false, it indicates that we invoice the sponsor for the refund
        public bool IsSponsorPayMember { get; set; } 
        public int PurchasesQualifyForRefund { get; set; }
        public double RefundPercentage { get; set; }
        // Refers to the percentage that we charge the sponsor (as an extra line item) in the invoice if the 
        // the Sposnor is configured to pay the member (i.e. Sponsor.IsSponsorPayMember)
        public double ManagementFeePercentage { get; set; }

        public int Rating { get; set; }
        public int CurrentInvoiceCounter { get; set; }
        public int CurrentCounter { get; set; }
        public int GlobalCounter { get; set; }
        public DateTime AcquisitionDate { get; set; }
        [NotMapped]
        public string InvoiceNumber
        {
            get { return Id + "-" + DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + CurrentInvoiceCounter; }
        }
    }
}
