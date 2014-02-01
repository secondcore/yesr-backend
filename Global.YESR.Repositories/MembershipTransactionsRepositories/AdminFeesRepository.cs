using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public class AdminFeesRepository : GenericRepository<AdminFee>, IAdminFeesRepository
    {
        protected override IQueryable<AdminFee> DefaultSet
        {
            get
            {
                return _Context.MembershipTransactions.Include("Period").Include("Membership").Include("Currency").Include("Purchase").OfType<AdminFee>();
            }
        }

        protected override Func<AdminFee, object> DefaultOrderBy
        {
            get
            {
                return x => x.TransactionDate;
            }
        }

        public AdminFeesRepository(YContext context) : base(context) { }

        public AdminFee Purchase(Purchase purchase)
        {
            AdminFee adminFee = new AdminFee();
            adminFee.TransactionDate = purchase.TransactionDate;
            adminFee.Period = purchase.Period;
            adminFee.Amount = (purchase.Amount * purchase.AdminFeePercentage) / 100;
            adminFee.ExchangeRate = purchase.ExchangeRate;
            adminFee.GlobalExchangeRate = purchase.GlobalExchangeRate;
            adminFee.Membership = purchase.Membership;
            adminFee.Currency = purchase.Currency;
            adminFee.Purchase = purchase;
            _Context.MembershipTransactions.Add(adminFee);
            _Context.SaveChanges();

            return adminFee;
        }
    }
}
