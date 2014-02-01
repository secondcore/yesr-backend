using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Repositories;
using Global.YESR.Repositories.MembershipTransactionsRepositories;

namespace Global.YESR.Web.Controllers
{
    public class DataServiceController : Controller
    {
        private IPurchasesRepository _purchasesRepository = null;
        private IMembershipsRepository _membershipsRepository = null;
        private IMembersRepository _membersRepository = null;
        private IMerchantsRepository _merchantsRepository = null;
        private IInvestmentUnitsRepository _investmentUnitsRepository = null;
        private IYesrRepository _yesrRepository = null;

        public DataServiceController(IPurchasesRepository purRep, IMembershipsRepository mRep, IMembersRepository memRep, IMerchantsRepository merRep, IInvestmentUnitsRepository invuRep, IYesrRepository ysrRep)
        {
            _purchasesRepository = purRep;
            _membershipsRepository = mRep;
            _membersRepository = memRep;
            _merchantsRepository = merRep;
            _investmentUnitsRepository = invuRep;
            _yesrRepository = ysrRep;
        }

        public ActionResult RetrievePurchaseMonthlyAverageSpends()
        {
            var monthlies = _purchasesRepository.RetrieveMonthlyAverageSpends();
            return Json(monthlies, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrievePurchaseMonthlyAverageSpendsByMerchant(int id)
        {
            var monthlies = _purchasesRepository.RetrieveMonthlyAverageSpendsByMerchant(id);
            return Json(monthlies, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrievePurchaseMonthlyAverageSpendsByMembership(int id)
        {
            var monthlies = _purchasesRepository.RetrieveMonthlyAverageSpendsByMembership(id);
            return Json(monthlies, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrievePurchaseMonthlyTotalSpends()
        {
            var monthlies = _purchasesRepository.RetrieveMonthlyTotalSpends();
            return Json(monthlies, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrievePurchaseMonthlyTotalSpendsByMerchant(int id)
        {
            var monthlies = _purchasesRepository.RetrieveMonthlyTotalSpendsByMerchant(id);
            return Json(monthlies, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrievePurchaseMonthlyTotalSpendsByMembership(int id)
        {
            var monthlies = _purchasesRepository.RetrieveMonthlyTotalSpendsByMembership(id);
            return Json(monthlies, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMembersDistributionByCity()
        {
            var stats = _membersRepository.RetrieveMembersDistributionByCity();
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMembersDistributionByCitizenshipCountry()
        {
            var stats = _membersRepository.RetrieveMembersDistributionByCitizenshipCountry();
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMembersDistributionByEnrollmentChannel()
        {
            var stats = _membersRepository.RetrieveMembersDistributionByEnrollmentChannel();
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMerchantsDistributionByType()
        {
            var stats = _merchantsRepository.RetrieveMerchantsDistributionByType();
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMerchantsDistributionByTotalDiscount()
        {
            var stats = _merchantsRepository.RetrieveMerchantsDistributionByTotalDiscount();
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMerchantsDistributionByCashDiscount()
        {
            var stats = _merchantsRepository.RetrieveMerchantsDistributionByCashDiscount();
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMonthlyEnrollmentsByMerchant(int id)
        {
            var stats = _membershipsRepository.RetrieveMonthlyEnrollmentsByMerchant(id);
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMonthlyCashDiscountVsReferralBonusByMerchant(int id)
        {
            var stats = _membershipsRepository.RetrieveMonthlyCashDiscountVsReferralBonusByMerchant(id);
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMonthlyTotalBondAmountsBySponsor(int id)
        {
            var stats = _investmentUnitsRepository.RetrieveMonthlyTotalBondAmountsBySponsor(id);
            return Json(stats, JsonRequestBehavior.AllowGet);
        }

        public ActionResult RetrieveMonthlyStatsByMembership(int id)
        {
            //TODO: Currency
            var stats = _yesrRepository.RetrieveMonthlyStatsByMembership(id, "AED");
            return Json(stats, JsonRequestBehavior.AllowGet);
        }
    }
}
