using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ComponentModel.DataAnnotations;

namespace Global.YESR.Models
{
    /// <summary>
    /// This has a compound primary key consisting of Spend and Merchant. In EF, it is strange, the foreign keys have to specified so they can be used in the key.
    /// </summary>
    public class EligibleSpend
    {
        public int MerchantId { get; set; }
        public Merchant Merchant { get; set; }

        public string SpendId { get; set; }
        public Spend Spend { get; set; }

        public string Description { get; set; }
    }
}
