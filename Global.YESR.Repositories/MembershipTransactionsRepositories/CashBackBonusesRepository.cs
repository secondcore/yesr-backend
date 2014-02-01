using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public class CashBackBonusesRepository : GenericRepository<CashBackBonus>, ICashBackBonusesRepository
    {
        protected override IQueryable<CashBackBonus> DefaultSet
        {
            get
            {
                return _Context.MembershipTransactions.Include("Period").Include("Membership").Include("Currency").Include("Purchase").OfType<CashBackBonus>();
            }
        }

        protected override Func<CashBackBonus, object> DefaultOrderBy
        {
            get
            {
                return x => x.TransactionDate;
            }
        }

        public CashBackBonusesRepository(YContext context) : base(context) { }
        
        public CashBackBonus Purchase(Purchase purchase)
        {
            CashBackBonus cashBackBonus = new CashBackBonus();
            cashBackBonus.TransactionDate = purchase.TransactionDate;
            cashBackBonus.Period = purchase.Period;
            cashBackBonus.Amount = (purchase.Amount * purchase.CashBackPercentage) / 100;
            cashBackBonus.ExchangeRate = purchase.ExchangeRate;
            cashBackBonus.GlobalExchangeRate = purchase.GlobalExchangeRate;
            cashBackBonus.Membership = purchase.Membership;
            cashBackBonus.Currency = purchase.Currency;
            cashBackBonus.Purchase = purchase;
            _Context.MembershipTransactions.Add(cashBackBonus);
            _Context.SaveChanges();

            return cashBackBonus;
        }
    }
}
