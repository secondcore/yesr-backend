using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// This model class defines the YESR-Merchant contract:
    /// Total Discount %
    /// Cash Back Discount %
    /// Eligible Spends - although we are allowing it in the model, this will be very difficult to achieve but we are planning for it as it might be impossible to impose a merchant discount on all 
    /// items indiscrimantely
    /// </summary>
    public class Merchant
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Category { get; set; } // Categories the merchant such as 'Computers', 'Books', 'Grocery', etc
        public string Name { get; set; }
        public string Description { get; set; }
        public double TotalDiscount { get; set; }
        public double CashBackDiscount { get; set; }
        public string ImageUrl { get; set; }
        public int Rating { get; set; }
        public bool IsOnline { get; set; }
        public DateTime AcquisitionDate { get; set; }
        public int CurrentInvoiceCounter { get; set; }
        [NotMapped]
        public string InvoiceNumber
        {
            get { return Id + "-" + DateTime.Now.Year + "-" + DateTime.Now.Month + "-"/* + CurrentInvoiceCounter*/; }
        }
    }
}
