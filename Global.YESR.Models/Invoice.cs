using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// Invoices have lines iems and receivables. The relationship between an invoice and its line items is one to many. However, the relationship between an invoice and receivables is 
    /// many to many. The reason is that it is possible to have one receivable for multiple invoices and one invoice may be paid up by multiple receivables. 
    /// 
    /// By the way, a receivable is a payment that YESR receives from its partners: merchants or sponsors. A payment, on the other hand, is something that YESR pays to a member, for example.
    /// 
    /// </summary>
    abstract public class Invoice
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime GenerateDate { get; set; }
        public string InvoiceNumber { get; set; }
        public double Total { get; set; }
        public double Tax { get; set; }
        public double Net { get; set; }
        public bool IsReleased { get; set; }
        public bool IsGenerated { get; set; }
        public Period Period { get; set; }
    }
}
