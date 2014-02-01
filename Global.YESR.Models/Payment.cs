using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// Payments are defined as the money that YESR has to pay out. Currently, YESR defines only one payment recipient and this is the member.
    /// </summary>
    abstract public class Payment
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime PaymentDate { get; set; }
        public Period Period { get; set; }
        public bool IsReleased { get; set; }
    }
}
