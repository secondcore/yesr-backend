using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// Receivables are payments that YESR receives based on invoices. The relationship between an invoice and receivables is  many to many. The reason is that it is possible to have 
    /// one receivable for multiple invoices and one invoice may be paid up by multiple receivables.
    /// </summary>
    public class Receivable
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime ReceivableDate { get; set; }
        public Period Period { get; set; }
    }
}
