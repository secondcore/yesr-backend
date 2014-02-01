using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public class ReferralBonusesRepository : GenericRepository<ReferralBonus>, IReferralBonusesRepository
    {
        protected override IQueryable<ReferralBonus> DefaultSet
        {
            get
            {
                return _Context.MembershipTransactions.Include("Period").Include("Membership").Include("Currency").Include("Beneficiary").Include("Purchase").OfType<ReferralBonus>();
            }
        }

        protected override Func<ReferralBonus, object> DefaultOrderBy
        {
            get
            {
                return x => x.TransactionDate;
            }
        }

        public ReferralBonusesRepository(YContext context) : base(context) { }

        public ReferralBonus Purchase(Purchase purchase, bool grandParent = false)
        {
            Membership membership = purchase.Membership;

            // Explicitly load the parent and the grand parent (just in case)
            if (!_Context.Entry(membership).Reference(l => l.Parent).IsLoaded)
                _Context.Entry(membership).Reference(l => l.Parent).Load();
            if (grandParent == true && membership.Parent != null && !_Context.Entry(membership.Parent).Reference(l => l.Parent).IsLoaded)
                _Context.Entry(membership.Parent).Reference(l => l.Parent).Load();

            ReferralBonus referralBonus = new ReferralBonus();
            referralBonus.TransactionDate = purchase.TransactionDate;
            referralBonus.Period = purchase.Period;
            referralBonus.Amount = (purchase.Amount * purchase.ReferralPercentage) / 100;
            referralBonus.ExchangeRate = purchase.ExchangeRate;
            referralBonus.GlobalExchangeRate = purchase.GlobalExchangeRate;
            referralBonus.Membership = purchase.Membership;
            referralBonus.Currency = purchase.Currency;

            if (!grandParent && membership.Parent != null)
                referralBonus.Beneficiary = membership.Parent;
            else if (grandParent && membership.Parent != null && membership.Parent.Parent != null)
                referralBonus.Beneficiary = membership.Parent.Parent;
            else
                return null;

            referralBonus.Purchase = purchase;
            _Context.MembershipTransactions.Add(referralBonus);
            _Context.SaveChanges();

            return referralBonus;
        }
    }
}
