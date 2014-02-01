using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Stats;
using Global.YESR.Repositories.Utilities;

namespace Global.YESR.Repositories
{
    public class SponsorsRepository : GenericRepository<Sponsor>, ISponsorsRepository
    {
        private IInvoicesRepository _invoicesRepository = null;

        protected override IQueryable<Sponsor> DefaultSet
        {
            get
            {
                return _Context.Sponsors;
            }
        }

        protected override Func<Sponsor, object> DefaultOrderBy
        {
            get
            {
                return x => x.Name;
            }
        }

        public SponsorsRepository(YContext context, IInvoicesRepository invRep) : base(context)
        {
            _invoicesRepository = invRep;
        }

        public override Sponsor FindById(int id)
        {
            var query = (from d in DefaultSet
                         where d.Id == id
                         select d).FirstOrDefault();

            return query;
        }

        public Sponsor FindByName(string name)
        {
            var query = (from d in DefaultSet
                        where d.Name == name
                        select d).FirstOrDefault();

            return query;
        }

        public Sponsor FindByRegistrationToken(string token)
        {
            var query = (from i in _Context.SponsorRegistrationTokens.Include("Sponsor")
                             orderby i.Token == token
                             select i).FirstOrDefault();

            if (query != null)
                return query.Sponsor;
            else
                return null;
        }

        public string Purchase(DateTime transactionDate, Membership membership, Period period)
        {
            if (membership.IsTest)
                return "Test Reference";

            Sponsor sponsor = membership.Instance.Sponsor;
            sponsor.GlobalCounter++;
            sponsor.CurrentCounter++;

            if (membership.InvestmentScheme.Id == InvestmentScheme.StandardScheme &&
                sponsor.CurrentCounter >= sponsor.PurchasesQualifyForRefund)
            {
                var total = ((sponsor.PurchasesQualifyForRefund * membership.Instance.InvestmentThreshold) * membership.Instance.Sponsor.RefundPercentage) / 100;
                var tax = 0;

                sponsor.CurrentCounter = 0;
                
                //If the sponsor is not to pay the member, we must invoice them for the refund
                if (!sponsor.IsSponsorPayMember)
                {
                    _invoicesRepository.FindBySponsor(transactionDate, sponsor, period, sponsor.InvoiceNumber, total, tax);
                    sponsor.CurrentInvoiceCounter++;
                }
            }

            _Context.SaveChanges();

            //TODO: do something to buy something from the sponsor
            return Utils.GenerateRandomNumber(20);
        }

        public SponsorStats RetrieveSponsorStats(int id)
        {
            SponsorStats stats = new SponsorStats();

            try
            {
                Sponsor sponsor = FindById(id);
                if (sponsor == null)
                    throw new Exception("Sponsor [" + id + "] does not exist!!");

                stats.Bonds = 100;
                stats.BondsAmount = 20000;
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

            return stats;
        }

        public void CreateRegistrationTokens()
        {
            var sponsors = (from i in DefaultSet
                             select i).ToList();

            foreach (Sponsor spnsr in sponsors)
            {
                CreateRegistrationToken(spnsr);
            }
        }

        public void CreateRegistrationToken(int id)
        {
            Sponsor sponsor = FindById(id);
            if (sponsor != null)
            {
                CreateRegistrationToken(sponsor);
                // TODO: Send an email to the sponsor letting him know that the registration token changed
            }
        }

        public Sponsor IsRegistrationTokenValid(string token)
        {
            var existingToken = (from i in _Context.SponsorRegistrationTokens.Include("Sponsor")
                                 where i.Token == token
                                 select i).FirstOrDefault();

            if (existingToken == null)
                return null;

            var lastToken = (from i in _Context.SponsorRegistrationTokens.Include("Sponsor")
                             where i.Sponsor.Id == existingToken.Sponsor.Id
                             orderby i.CreateDate descending 
                            select i).FirstOrDefault();

            if (lastToken != null && lastToken.Token == token)
                return lastToken.Sponsor;
            else
                return null;
        }

        /* P R I V A T E  M E T H O D S */

        private void CreateRegistrationToken(Sponsor sponsor)
        {
            SponsorRegistrationToken token = new SponsorRegistrationToken();
            token.CreateDate = DateTime.Now;
            token.Sponsor = sponsor;
            token.Token = sponsor.Id + "-" + Utils.GenerateRandomNumber(8);
            _Context.SponsorRegistrationTokens.Add(token);
            _Context.SaveChanges();
        }
    }
}
