using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// Invoice line items are the individual line items that make up an invoice.
    /// </summary>
    public class InvoiceLineItem
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public double PricePerUnit { get; set; }
        public Invoice Invoice { get; set; }
    }
}
