using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Global.YESR.Models;
using Global.YESR.Models.Invoices;
using Global.YESR.Models.MembershipTransactions;

namespace Global.YESR.Repositories
{
    public interface IInvoicesRepository : IGenericRepository<Invoice>
    {
        SponsorInvoice FindBySponsor(DateTime transactionDate, Sponsor sponsor);
        SponsorInvoice FindBySponsor(DateTime transactionDate, Sponsor sponsor, Period period, string invoiceNumber, double total, double tax);
        SponsorInvoice FindBySponsor(DateTime transactionDate, InvestmentUnit invUnit, Sponsor sponsor, Period period, string invoiceNumber, double total, double tax);

        MerchantInvoice FindByMerchant(DateTime transactionDate, Merchant merchant);
        MerchantInvoice FindByMerchant(DateTime transactionDate, Merchant merchant, Period period, string invoiceNumber, double total, double tax);
    }
}
