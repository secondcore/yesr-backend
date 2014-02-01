using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Models.Stats;
using Global.YESR.Repositories;
using Global.YESR.Repositories.MembershipTransactionsRepositories;
using Global.YESR.Web.Areas.Merchants.ViewModels;
using Global.YESR.Web.Helpers;

namespace Global.YESR.Web.Areas.Merchants.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private IMerchantsRepository _merchantsRepository;
        private IPurchasesRepository _purchasesRepository;

        public HomeController(IMerchantsRepository merRep, IPurchasesRepository purRep)
        {
            _merchantsRepository = merRep;
            _purchasesRepository = purRep;
        }

        /// <summary>
        /// ChildActionOnly prevents direct URL into this method i.e. /Merchants/Home/MerchantDetail
        /// </summary>
        /// <returns></returns>
        [ChildActionOnly]
        public PartialViewResult MerchantDetail()
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var merchant = _merchantsRepository.FindByRegistrationToken(authUser.MerchantCode);
            if (merchant == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user merchant code is not valid!");

            // Call upon the merchants repository to return membership stats
            MerchantStats stats = _merchantsRepository.RetrieveMerchantStats(merchant.Id);
            if (stats == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user merchant returned bad stats!");

            MerchantDetailViewModel model = new MerchantDetailViewModel()
            {
                Merchant = merchant,
                Stats = stats
            };

            return PartialView("MerchantDetail", model);
        }

        public ActionResult Index()
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var merchant = _merchantsRepository.FindByRegistrationToken(authUser.MerchantCode);
            if (merchant == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user merchant code is not valid!");

            return View(merchant);
        }

        public ActionResult Enrollments()
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var merchant = _merchantsRepository.FindByRegistrationToken(authUser.MerchantCode);
            if (merchant == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user merchant code is not valid!");

            return View(merchant);
        }

        public ActionResult Discounts()
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var merchant = _merchantsRepository.FindByRegistrationToken(authUser.MerchantCode);
            if (merchant == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user merchant code is not valid!");

            return View(merchant);
        }

        // TODO: Add a parameter to control the time frame: last 1 month, last 6 months, etc. 
        public ActionResult Purchases(int page = 1, int count = 20)
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var merchant = _merchantsRepository.FindByRegistrationToken(authUser.MerchantCode);
            if (merchant == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user merchant code is not valid!");

            if (page < 1 || count < 1)
                throw new HttpException((int)HttpStatusCode.BadRequest, "Page or Count parameter has to be greater than 1.");

            Expression<Func<Purchase, bool>> filter = x => x.Merchant.Id == merchant.Id;
            var purchases = _purchasesRepository.Search(filter, page, count);
            var maxPage = Math.Max((int)Math.Ceiling((double)_purchasesRepository.Count(filter) / count), 1);
            PurchasesViewModel model = new PurchasesViewModel()
            {
                MerchantId = merchant.Id,
                Page = page,
                MaxPage = maxPage,
                Items = purchases.Select(x => x)
            };

            return View(model);
        }
    }
}
