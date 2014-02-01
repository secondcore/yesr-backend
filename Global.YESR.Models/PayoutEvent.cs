using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// Only applicable for the Standards Scheme where 
    /// </summary>
    public class PayoutEvent
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        //TODO: Due to a bug, in EF where dates must have values, we added the flag to reflect the true status
        public DateTime PayDate { get; set; }
        public bool IsPaid { get; set; }
    }
}
