using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace Global.YESR.Models
{
    /// <summary>
    /// The Spend is a look up entity that defines the spends that can be eligble at different merchants. Please refer to the EligibleSpend model class for more information.
    /// </summary>
    public class Spend
    {
        [Key, DatabaseGenerated((DatabaseGeneratedOption.None))]
        public String Id { get; set; }
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public String Name { get; set; }
    }
}
