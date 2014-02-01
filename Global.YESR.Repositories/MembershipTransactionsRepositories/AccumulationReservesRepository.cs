using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public class AccumulationReservesRepository : GenericRepository<AccumulationReserve>, IAccumulationReservesRepository
    {
        IInvestmentUnitsRepository _investmentUnitsRepository = null;

        protected override IQueryable<AccumulationReserve> DefaultSet
        {
            get
            {
                return _Context.MembershipTransactions.Include("Period").Include("Membership").Include("Currency").Include("Purchase").Include("InvestmentUnit").OfType<AccumulationReserve>();
            }
        }

        protected override Func<AccumulationReserve, object> DefaultOrderBy
        {
            get
            {
                return x => x.TransactionDate;
            }
        }

        public AccumulationReservesRepository(YContext context, IInvestmentUnitsRepository invRep) : base(context)
        {
            _investmentUnitsRepository = invRep;
        }

        /*
         * Ok...the way I opted to deal with the investment unit is to always create a pending investment unit that can accumulate
         * the amount. Once the amount reaches the threshold value, the current investment unit will be purchased from a sponsor and
         * a sponsor reference will be added. 
         * 
         * So there has to be only a single pending investment unit available per membership. This will add more investment units 
         * to the system (as some will be never be sold because they will never reach threshold), but it is simpler to deal with ot
         * due to the possible left over that we may have.
         * 
        */
        public AccumulationReserve Purchase(Purchase purchase)
        {
            double[] rates = new double[2];
            rates[0] = purchase.ExchangeRate;
            rates[1] = purchase.GlobalExchangeRate;

            AccumulationReserve accumulationReserve = new AccumulationReserve();
            accumulationReserve.TransactionDate = purchase.TransactionDate;
            accumulationReserve.Period = purchase.Period;
            accumulationReserve.Amount = (purchase.Amount * purchase.AccumulationPercentage) / 100;
            accumulationReserve.ExchangeRate = purchase.ExchangeRate;
            accumulationReserve.GlobalExchangeRate = purchase.GlobalExchangeRate;
            accumulationReserve.Membership = purchase.Membership;
            accumulationReserve.Currency = purchase.Currency;
            accumulationReserve.Purchase = purchase;
            accumulationReserve.InvestmentUnit = _investmentUnitsRepository.ProcessByMembership(accumulationReserve.TransactionDate, purchase.Membership, purchase.Period, ((purchase.Amount * purchase.AccumulationPercentage) / 100) * rates[0], purchase.Membership.Instance.InvestmentThreshold);
            accumulationReserve.WalletAmount = accumulationReserve.InvestmentUnit.Amount;
            _Context.MembershipTransactions.Add(accumulationReserve);
            _Context.SaveChanges();

            return accumulationReserve;
        }
    }
}
