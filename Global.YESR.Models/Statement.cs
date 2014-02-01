using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// Statements are sent from YESR to inform external entities of their balances. We identified three types of statements:
    /// Member
    /// Merchant
    /// Sponsor
    /// 
    /// </summary>
    abstract public class Statement
    {
        public int Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public DateTime StatementDate { get; set; }
        public Period Period { get; set; }
        public bool IsReleased { get; set; }
    }
}
