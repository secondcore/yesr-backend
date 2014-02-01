using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Invoices;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories
{
    public class InvoicesRepository : GenericRepository<Invoice>, IInvoicesRepository
    {
        protected override IQueryable<Invoice> DefaultSet
        {
            get
            {
                return _Context.Invoices
                    .Include("Period");
            }
        }

        protected override Func<Invoice, object> DefaultOrderBy
        {
            get
            {
                return x => x.CreateDate;
            }
        }

        public InvoicesRepository(YContext context) : base(context) { }

        public override Invoice FindById(int id)
        {
            var query = (from i in DefaultSet
                         where i.Id == id
                         select i).SingleOrDefault();

            return query;
        }

        public SponsorInvoice FindBySponsor(DateTime transactionDate, Sponsor sponsor)
        {
            var invoice = (from i in DefaultSet.OfType<SponsorInvoice>()
                           where (i.Sponsor.Id == sponsor.Id && i.IsGenerated == false)
                           orderby i.Id descending
                           select i).FirstOrDefault();

            if (invoice == null)
                invoice = CreateSponsorInvoice(transactionDate, sponsor);

            return invoice;
        }

        public SponsorInvoice FindBySponsor(DateTime transactionDate, Sponsor sponsor, Period period, string invoiceNumber, double total, double tax)
        {
            var invoice = (from i in DefaultSet.OfType<SponsorInvoice>()
                           where (i.Sponsor.Id == sponsor.Id && i.IsGenerated == false)
                           orderby i.Id descending
                           select i).FirstOrDefault();
            
            if (invoice == null)
                invoice = CreateSponsorInvoice(transactionDate, sponsor);

            invoice.GenerateDate = transactionDate; 
            invoice.Period = period;
            invoice.InvoiceNumber = sponsor.InvoiceNumber;
            invoice.Total = total;
            invoice.Tax = tax;
            invoice.Net = invoice.Total - invoice.Tax;
            invoice.IsReleased = false;
            invoice.IsGenerated = true;
            _Context.SaveChanges();
            return invoice;
        }

        public SponsorInvoice FindBySponsor(DateTime transactionDate, InvestmentUnit invUnit, Sponsor sponsor, Period period, string invoiceNumber, double total, double tax)
        {
            var invoice = (from i in DefaultSet.OfType<SponsorInvoice>()
                           where (i.Sponsor.Id == sponsor.Id && i.IsGenerated == false)
                           orderby i.Id descending
                           select i).FirstOrDefault();

            if (invoice == null)
                invoice = CreateSponsorInvoice(transactionDate, sponsor);

            invoice.GenerateDate = transactionDate;
            invoice.Period = period;
            invoice.InvestmentUnit = invUnit; // so we can trace back the invoice
            invoice.InvoiceNumber = sponsor.InvoiceNumber;
            invoice.Total = total;
            invoice.Tax = tax;
            invoice.Net = invoice.Total - invoice.Tax;
            invoice.IsReleased = false;
            invoice.IsGenerated = true;
            _Context.SaveChanges();
            return invoice;
        }

        public MerchantInvoice FindByMerchant(DateTime transactionDate, Merchant merchant)
        {
            var invoice = (from i in DefaultSet.OfType<MerchantInvoice>()
                           where (i.Merchant.Id == merchant.Id && i.IsGenerated == false)
                           orderby i.Id descending
                           select i).FirstOrDefault();

            if (invoice == null)
                invoice = CreateMerchantInvoice(transactionDate, merchant);

            return invoice;
        }

        public MerchantInvoice FindByMerchant(DateTime transactionDate, Merchant merchant, Period period, string invoiceNumber, double total, double tax)
        {
            var invoice = (from i in DefaultSet.OfType<MerchantInvoice>()
                           where (i.Merchant.Id == merchant.Id && i.IsGenerated == false)
                           orderby i.Id descending
                           select i).FirstOrDefault();

            if (invoice == null)
                invoice = CreateMerchantInvoice(transactionDate, merchant);

            invoice.GenerateDate = transactionDate;
            invoice.Period = period;
            invoice.InvoiceNumber = merchant.InvoiceNumber;
            invoice.Total = total;
            invoice.Tax = tax;
            invoice.Net = invoice.Total - invoice.Tax;
            invoice.IsReleased = false;
            invoice.IsGenerated = true;
            _Context.SaveChanges();
            return invoice;
        }

        /* P R I V A T E  M E T H O D S */
        private SponsorInvoice CreateSponsorInvoice(DateTime transactionDate, Sponsor sponsor)
        {
            SponsorInvoice invoice = new SponsorInvoice();
            invoice.CreateDate = transactionDate;
            invoice.GenerateDate = transactionDate; // TODO: Due to a bug in EF
            invoice.Period = null;
            invoice.InvoiceNumber = "";
            invoice.Total = 0;
            invoice.Tax = 0;
            invoice.Net = invoice.Total - invoice.Tax;
            invoice.IsReleased = false;
            invoice.IsGenerated = false;
            invoice.Sponsor = sponsor;
            invoice.InvestmentUnit = (InvestmentUnit) null;
            _Context.Invoices.Add(invoice);
            _Context.SaveChanges();
            return invoice;
        }

        private MerchantInvoice CreateMerchantInvoice(DateTime transactionDate, Merchant merchant)
        {
            MerchantInvoice invoice = new MerchantInvoice();
            invoice.CreateDate = transactionDate;
            invoice.GenerateDate = transactionDate; // TODO: Due to a bug in EF
            invoice.Period = null;
            invoice.InvoiceNumber = "";
            invoice.Total = 0;
            invoice.Tax = 0;
            invoice.Net = invoice.Total - invoice.Tax;
            invoice.IsReleased = false;
            invoice.IsGenerated = false;
            invoice.Merchant = merchant;
            _Context.Invoices.Add(invoice);
            _Context.SaveChanges();
            return invoice;
        }
    }
}
