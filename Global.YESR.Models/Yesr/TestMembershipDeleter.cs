using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Models.Yesr
{
    public class TestMembershipDeleter
    {
        public int Id { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime CompleteDate { get; set; }
        public bool IsCompleted { get; set; }
        public string Token { get; set; }
    }
}
