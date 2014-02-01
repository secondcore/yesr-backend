using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using Global.YESR.Models;
using Global.YESR.Models.Stats;
using Global.YESR.Models.Yesr;
using Global.YESR.Repositories.Helpers;
using Global.YESR.Repositories.Utilities;
using Global.YESR.Storage.Azure;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.StorageClient;

namespace Global.YESR.Repositories
{
    public class YesrRepository : GenericRepository<MembershipsPump>, IYesrRepository
    {
        protected override IQueryable<MembershipsPump> DefaultSet
        {
            get
            {
                return _Context.MembershipsPumps;
            }
        }

        protected override Func<MembershipsPump, object> DefaultOrderBy
        {
            get
            {
                return x => x.CreateDate;
            }
        }

        public YesrRepository(YContext context) : base(context) { }

        public YesrStats RetrieveYesrStats()
        {
            YesrStats stats = new YesrStats();

            // Get the latest dividend bonus transaction
            //var latestDividend = _Context.Database.SqlQuery<DividendIdentifier>(
            //    " SELECT TOP 1 iut.Id, iut.TransactionDate " +
            //    " FROM InvestmentUnitTransactions iut, InvestmentUnits ius, Memberships m" +
            //    " WHERE iut.InvestmentUnitId = ius.Id " +
            //    " AND ius.MembershipId = m.Id " +
            //    " AND ius.MembershipId = " + invUnit.Membership.Id +
            //    " ORDER BY iut.TransactionDate DESC "
            //    ).FirstOrDefault();

            try
            {
                stats.Bonds = 100;
                stats.BondsAmount = 20000;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return stats;
        }

        public List<MonthlyDataPoint> RetrieveMonthlyStatsByMembership(int id, string currency)
        {
            List<MonthlyDataPoint> points = new List<MonthlyDataPoint>();

            // TODO: Add currency support

            // Get the spends
            List<MonthlyDataPoint> spends = _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT Year(mt.TransactionDate) as Year, Month(mt.TransactionDate) as Month, " +
                " SUM (mt.Amount) as Value0 " +
                " FROM MembershipTransactions mt " +
                " WHERE mt.MembershipId = " + id +
                " AND mt.Discriminator = 'Purchase' " +
                " GROUP BY Year(mt.TransactionDate), Month(mt.TransactionDate) " +
                " ORDER BY Year(mt.TransactionDate), Month(mt.TransactionDate) "
                ).ToList();

            // Get the cash back bonuses
            List<MonthlyDataPoint> cashBackBonuses = _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT Year(mt.TransactionDate) as Year, Month(mt.TransactionDate) as Month, " +
                " SUM (mt.Amount) as Value0 " +
                " FROM MembershipTransactions mt " +
                " WHERE mt.MembershipId = " + id +
                " AND mt.Discriminator = 'CashBackBonus' " +
                " GROUP BY Year(mt.TransactionDate), Month(mt.TransactionDate) " +
                " ORDER BY Year(mt.TransactionDate), Month(mt.TransactionDate) "
                ).ToList();

            // Get the referral bonuses
            List<MonthlyDataPoint> referralBonuses = _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT Year(mt.TransactionDate) as Year, Month(mt.TransactionDate) as Month, " +
                " SUM (mt.Amount) as Value0 " +
                " FROM MembershipTransactions mt " +
                " WHERE mt.BeneficiaryId = " + id +
                " AND mt.Discriminator = 'ReferralBonus' " +
                " GROUP BY Year(mt.TransactionDate), Month(mt.TransactionDate) " +
                " ORDER BY Year(mt.TransactionDate), Month(mt.TransactionDate) "
                ).ToList();

            // Get the dividends
            List<MonthlyDataPoint> dividends = _Context.Database.SqlQuery<MonthlyDataPoint>(
                " SELECT Year(it.TransactionDate) as Year, Month(it.TransactionDate) as Month, " +
                " SUM (it.Amount) as Value0 " +
                " FROM InvestmentUnitTransactions it, InvestmentUnits ius, Memberships m " + 
                " WHERE it.InvestmentUnitId = ius.Id " + 
                " AND ius.MembershipId = m.Id " + 
                " AND m.id = " + id +
                " GROUP BY Year(it.TransactionDate), Month(it.TransactionDate) " +
                " ORDER BY Year(it.TransactionDate), Month(it.TransactionDate) "
                ).ToList();

            // Do the spends
            foreach(MonthlyDataPoint spend in spends)
            {
                points.Add(spend);
            }

            // Do the cash back bonuses
            foreach (MonthlyDataPoint cbbonus in cashBackBonuses)
            {
                MonthlyDataPoint final = FindMonthlyDataPoint(ref points, cbbonus.Month, cbbonus.Year);
                final.Value1 += cbbonus.Value0;
            }

            // Do the referral bonuses
            foreach (MonthlyDataPoint refbonus in referralBonuses)
            {
                MonthlyDataPoint final = FindMonthlyDataPoint(ref points, refbonus.Month, refbonus.Year);
                final.Value1 += refbonus.Value0;
            }

            // Do the dividends
            foreach (MonthlyDataPoint div in dividends)
            {
                MonthlyDataPoint final = FindMonthlyDataPoint(ref points, div.Month, div.Year);
                final.Value1 += div.Value0;
            }

            return points;
        }

        public TestMembershipPump RetrieveTestMembershipPumpByToken(string token)
        {
            return (from i in _Context.TestMembershipPumps
                           where i.Token == token
                           select i).SingleOrDefault();
        }

        public Thread PumpMemberships(int memberships, int purchasesPerMembership, int daysBetweenPurchases)
        {
            var current = (from i in DefaultSet
                         where i.IsCompleted == false
                         select i).SingleOrDefault();

            // If there is a membershipsPump running, do not create another one
            if (current != null)
                return null;

            MembershipsPump pump = new MembershipsPump();
            pump.CreateDate = DateTime.Now;
            pump.CompleteDate = DateTime.Now; // TODO: Due to a bug in EF 4.x
            pump.IsCompleted = false;
            pump.Memberships = memberships;
            pump.PurchasesPerMembership = purchasesPerMembership;
            pump.DaysBetweenPurchases = daysBetweenPurchases;
            _Context.MembershipsPumps.Add(pump);
            _Context.SaveChanges();
    
            // Run a thread and             
            Thread thread = new Thread(new ParameterizedThreadStart(this.PumpMembershipsWorkedTread));
            thread.IsBackground = true;
            thread.Name = "Memberships Pumper";

            try
            {
                object[] parameters = new object[] { pump };
                thread.Start(parameters);
            }
            catch (Exception e)
            {
                // not sure what to do ...this is usually un-attended code              
            }
            
            return thread;
        }

        public Thread PumpTestMembership(string token, int expectedReferrals, double avgMonthlySpend, int years)
        {
            var current = (from i in _Context.TestMembershipPumps
                           where i.IsCompleted == false
                           select i).SingleOrDefault();

            // If there is a membershipsPump running, do not create another one
            if (current != null)
                return null;

            TestMembershipPump pump = new TestMembershipPump();
            pump.CreateDate = DateTime.Now;
            pump.CompleteDate = DateTime.Now; // TODO: Due to a bug in EF 4.x
            pump.IsCompleted = false;
            pump.Token = token;
            pump.ExpectedReferrals = expectedReferrals;
            pump.AverageMonthlySpend = avgMonthlySpend;
            pump.Years = years;
            _Context.TestMembershipPumps.Add(pump);
            _Context.SaveChanges();

            // Run a thread and             
            Thread thread = new Thread(new ParameterizedThreadStart(this.PumpTestMembershipWorkedTread));
            thread.IsBackground = true;
            thread.Name = "Test Membership Pumper";

            try
            {
                object[] parameters = new object[] { pump };
                thread.Start(parameters);
            }
            catch (Exception e)
            {
                // not sure what to do ...this is usually un-attended code              
            }

            return thread;
        }

        public Thread DeleteTestMembership(string token)
        {
            var current = (from i in _Context.Memberships
                           where i.TestToken == token
                           select i).SingleOrDefault();

            // If there is no test membership with this token, do not do anything
            if (current == null)
                return null;

            TestMembershipDeleter deleter = new TestMembershipDeleter();
            deleter.CreateDate = DateTime.Now;
            deleter.CompleteDate = DateTime.Now; // TODO: Due to a bug in EF 4.x
            deleter.IsCompleted = false;
            deleter.Token = token;
            _Context.TestMembershipDeleters.Add(deleter);
            _Context.SaveChanges();

            // Run a thread and             
            Thread thread = new Thread(new ParameterizedThreadStart(this.DeleteTestMembershipWorkedTread));
            thread.IsBackground = true;
            thread.Name = "Test Membership Deleter";

            try
            {
                object[] parameters = new object[] { deleter };
                thread.Start(parameters);
            }
            catch (Exception e)
            {
                // not sure what to do ...this is usually un-attended code              
            }

            return thread;
        }

        // These are method pairs: the first one is a request by the web role while the second one is a process by the worker role
        // Invoked by the web role
        public void PumpMemberships(int memberships, int purchasesPerMembership, int daysBetweenPurchases, bool ignore)
        {
            MembershipsPump pump = new MembershipsPump();
            pump.CreateDate = DateTime.Now;
            pump.CompleteDate = DateTime.Now; // TODO: Due to a bug in EF 4.x
            pump.IsCompleted = false;
            pump.Memberships = memberships;
            pump.PurchasesPerMembership = purchasesPerMembership;
            pump.DaysBetweenPurchases = daysBetweenPurchases;
            _Context.MembershipsPumps.Add(pump);
            _Context.SaveChanges();
    
            // Enqueue to the worker role             
            var queue = StorageService.GetCloudQueue(StorageConstants.MembershipsPumpQueue);
            var message = new CloudQueueMessage("" + pump.Id);
            queue.AddMessage(message);
        }

        // Invoked by the worker role
        public void ProcessPumpMemberships(int pumpId)
        {
            var pump = (from i in _Context.MembershipsPumps
                         where i.Id == pumpId
                         select i).SingleOrDefault();

            if (pump != null)
            {
                var seeder = new DatabaseSeeder(false);
                seeder.CreateTransactions(pump.Memberships, pump.PurchasesPerMembership, pump.DaysBetweenPurchases);

                // Once done, save the object
                pump.CompleteDate = DateTime.Now;
                pump.IsCompleted = true;
                _Context.SaveChanges();
            }
        }

        // Invoked by the web role
        public void PumpTestMembership(string token, int expectedReferrals, double avgMonthlySpend, int years, bool ignore)
        {
            TestMembershipPump pump = new TestMembershipPump();
            pump.CreateDate = DateTime.Now;
            pump.CompleteDate = DateTime.Now; // TODO: Due to a bug in EF 4.x
            pump.IsCompleted = false;
            pump.Token = token;
            pump.ExpectedReferrals = expectedReferrals;
            pump.AverageMonthlySpend = avgMonthlySpend;
            pump.Years = years;
            _Context.TestMembershipPumps.Add(pump);
            _Context.SaveChanges();

            // Enqueue to the worker role             
            var queue = StorageService.GetCloudQueue(StorageConstants.TestMembershipPumpQueue);
            var message = new CloudQueueMessage("" + pump.Id);
            queue.AddMessage(message);
        }

        // Invoked by the worker role
        public void ProcessPumpTestMembership(int pumpId)
        {
            var pump = (from i in _Context.TestMembershipPumps
                         where i.Id == pumpId
                         select i).SingleOrDefault();

            if (pump != null)
            {
                var seeder = new DatabaseSeeder(false);
                seeder.CreateTestMembership(pump.Token, pump.ExpectedReferrals, pump.AverageMonthlySpend, pump.Years);

                // Once done, save the object
                pump.CompleteDate = DateTime.Now;
                pump.IsCompleted = true;
                _Context.SaveChanges();
            }
        }

        // Invoked by the web role
        public void DeleteTestMembership(string token, bool ignore)
        {
            TestMembershipDeleter deleter = new TestMembershipDeleter();
            deleter.CreateDate = DateTime.Now;
            deleter.CompleteDate = DateTime.Now; // TODO: Due to a bug in EF 4.x
            deleter.IsCompleted = false;
            deleter.Token = token;
            _Context.TestMembershipDeleters.Add(deleter);
            _Context.SaveChanges();

            // Enqueue to the worker role             
            var queue = StorageService.GetCloudQueue(StorageConstants.TestMembershipDeleterQueue);
            var message = new CloudQueueMessage("" + deleter.Id);
            queue.AddMessage(message);
        }

        // Invoked by the worker role
        public void ProcessDeleteTestMembership(int deleterId)
        {
            var deleter = (from i in _Context.TestMembershipDeleters
                         where i.Id == deleterId
                         select i).SingleOrDefault();

            if (deleter != null)
            {
                // TODO: Find the membership based on token

                // TODO: Enumerate the child memberships and delete each membership with its associated transactions i.e. cascade delete

                // TODO: Delete the membership and its associated transactions i.e. cascade delete

                // Once done, save the object
                deleter.CompleteDate = DateTime.Now;
                deleter.IsCompleted = true;
                _Context.SaveChanges();
            }
        }

        // P R I V A T E  M E T H O D S
        private void PumpMembershipsWorkedTread(object parameters)
        {
            object[] parameterArray = (object[])parameters;
            MembershipsPump pump = (MembershipsPump)parameterArray[0];
            ProcessPumpMemberships(pump.Id);
        }

        private void PumpTestMembershipWorkedTread(object parameters)
        {
            object[] parameterArray = (object[])parameters;
            TestMembershipPump pump = (TestMembershipPump)parameterArray[0];
            ProcessPumpTestMembership(pump.Id);
        }

        private void DeleteTestMembershipWorkedTread(object parameters)
        {
            object[] parameterArray = (object[])parameters;
            TestMembershipDeleter deleter = (TestMembershipDeleter)parameterArray[0];
            ProcessDeleteTestMembership(deleter.Id);
        }

        private static MonthlyDataPoint FindMonthlyDataPoint(ref List<MonthlyDataPoint> points, int month, int year )
        {
            foreach (MonthlyDataPoint point in points)
            {
                if (point.Year == year && point.Month == month)
                    return point;
            }

            MonthlyDataPoint newPoint = new MonthlyDataPoint();
            newPoint.Year = year;
            newPoint.Month = month;
            newPoint.Value0 = 0;
            newPoint.Value1 = 0;
            newPoint.Value2 = 0;
            newPoint.Value3 = 0;
            newPoint.Value4 = 0;
            newPoint.Value5 = 0;
            points.Add(newPoint);
            return newPoint;
        }
    }
}
