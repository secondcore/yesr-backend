using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Global.YESR.Storage.Azure
{
    public class StorageConstants
    {
        // Storage Account Connection String
        public static readonly string StorageConnectionsString = "StorageConnectionString";

        // Queue Names - must be lower case
        public static readonly string MembershipsPumpQueue = "membershipsqueue";
        public static readonly string TestMembershipPumpQueue = "testmembershipqueue";
        public static readonly string TestMembershipDeleterQueue = "testmembershipdeleterqueue";

        // Table Names - must be lower case
        public static readonly string TestTable = "testtable";
    }
}
