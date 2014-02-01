using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Stats;
using Global.YESR.Repositories.Utilities;

namespace Global.YESR.Repositories
{
    public class MerchantsRepository : GenericRepository<Merchant>, IMerchantsRepository
    {
        protected override IQueryable<Merchant> DefaultSet
        {
            get
            {
                return _Context.Merchants;
            }
        }

        protected override Func<Merchant, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public MerchantsRepository(YContext context) : base(context) { }

        public Merchant FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        public Merchant FindByName(string name)
        {
            var query = (from i in DefaultSet
                         where i.Name == name
                         select i).SingleOrDefault();

            return query;
        }

        public Merchant FindByRegistrationToken(string token)
        {
            var query = (from i in _Context.MerchantRegistrationTokens.Include("Merchant")
                         orderby i.Token == token
                         select i).FirstOrDefault();

            if (query != null)
                return query.Merchant;
            else
                return null;
        }

        public MerchantStats RetrieveMerchantStats(int id)
        {
            MerchantStats stats = new MerchantStats();

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
                Merchant merchant = FindById(id);
                if (merchant == null)
                    throw new Exception("Merchant [" + id + "] does not exist!!");

                stats.Purchases = 100;
                stats.PurchasesAmount = 20000;
                stats.CashBackAmount = 200;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return stats;
        }

        public void CreateRegistrationTokens()
        {
            var merchants = (from i in DefaultSet
                             select i).ToList();

            foreach (Merchant mer in merchants)
            {
                CreateRegistrationToken(mer);
            }
        }

        public void CreateRegistrationToken(int id)
        {
            Merchant merchant = FindById(id);
            if (merchant != null)
            {
                CreateRegistrationToken(merchant);
                // TODO: Send an email to the merchant letting him know that the registration token changed
            }
        }

        public Merchant IsRegistrationTokenValid(string token)
        {
            var existingToken = (from i in _Context.MerchantRegistrationTokens.Include("Merchant")
                                 where i.Token == token
                                 select i).FirstOrDefault();

            if (existingToken == null)
                return null;

            var lastToken = (from i in _Context.MerchantRegistrationTokens.Include("Merchant")
                             where i.Merchant.Id == existingToken.Merchant.Id
                             orderby i.CreateDate descending
                             select i).FirstOrDefault();

            if (lastToken != null && lastToken.Token == token)
                return lastToken.Merchant;
            else
                return null;
        }

        public List<KeyIntegerValueDataPoint> RetrieveMerchantsDistributionByType()
        {
            return _Context.Database.SqlQuery<KeyIntegerValueDataPoint>(
                    " SELECT CASE WHEN IsOnline = 0 THEN 'Regular' WHEN IsOnline = 1 THEN 'Online' END as Identifier, count(*) as Value FROM Merchants GROUP BY CASE WHEN IsOnline = 0 THEN 'Regular' WHEN IsOnline = 1 THEN 'Online' END "
                    ).ToList();
        }

        public List<KeyIntegerValueDataPoint> RetrieveMerchantsDistributionByTotalDiscount()
        {
            return _Context.Database.SqlQuery<KeyIntegerValueDataPoint>(
                    " SELECT CAST(TotalDiscount AS varchar(5)) as Identifier, count(*) as Value FROM Merchants GROUP BY CAST(TotalDiscount AS varchar(5)) "
                    ).ToList();
        }

        public List<KeyIntegerValueDataPoint> RetrieveMerchantsDistributionByCashDiscount()
        {
            return _Context.Database.SqlQuery<KeyIntegerValueDataPoint>(
                    " SELECT CAST(CashBackDiscount AS varchar(5)) as Identifier, count(*) as Value FROM Merchants GROUP BY CAST(CashBackDiscount AS varchar(5)) + '' "
                    ).ToList();
        }

        /* P R I V A T E  M E T H O D S */

        private void CreateRegistrationToken(Merchant mer)
        {
            MerchantRegistrationToken token = new MerchantRegistrationToken();
            token.CreateDate = DateTime.Now;
            token.Merchant = mer;
            token.Token = mer.Id + "-" + Utils.GenerateRandomNumber(8);
            _Context.MerchantRegistrationTokens.Add(token);
            _Context.SaveChanges();
        }
    }
}
