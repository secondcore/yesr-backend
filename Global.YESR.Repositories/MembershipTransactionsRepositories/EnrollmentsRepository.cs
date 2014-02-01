using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories.MembershipTransactionsRepositories
{
    public class EnrollmentsRepository : GenericRepository<Enrollment>, IEnrollmentsRepository
    {
        private IPeriodsRepository _periodsRepository = null;

        protected override IQueryable<Enrollment> DefaultSet
        {
            get
            {
                return _Context.MembershipTransactions.Include("Period").Include("Membership").Include("Currency").OfType<Enrollment>();
            }
        }

        protected override Func<Enrollment, object> DefaultOrderBy
        {
            get
            {
                return x => x.TransactionDate;
            }
        }

        public EnrollmentsRepository(YContext context, IPeriodsRepository perRep) : base(context)
        {
            _periodsRepository = perRep;
        }
        
        public Enrollment Enroll(Membership membership)
        {
            DateTime transactionDate = DateTime.Now.AddHours(membership.Member.PreferredTimeZone.Id);
            Period period = _periodsRepository.FindByDate(transactionDate);

            // Create an enrollment transaction
            Enrollment enrollment = new Enrollment();
            enrollment.TransactionDate = transactionDate;
            enrollment.Amount = 0;
            enrollment.ExchangeRate = 0;
            enrollment.GlobalExchangeRate = 0;
            enrollment.Period = period;
            enrollment.Membership = membership;
            _Context.MembershipTransactions.Add(enrollment);
            _Context.SaveChanges();

            return enrollment;
        }
    }
}
