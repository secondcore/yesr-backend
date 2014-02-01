using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Models;
using Global.YESR.Models.Stats;
using Global.YESR.Repositories;
using Global.YESR.Repositories.MembershipTransactionsRepositories;
using Global.YESR.Web.Areas.Merchants.ViewModels;
using Global.YESR.Web.Areas.Sponsors.ViewModels;
using Global.YESR.Web.Helpers;

namespace Global.YESR.Web.Areas.Sponsors.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private ISponsorsRepository _sponsorsRepository;
        private IInvestmentUnitsRepository _investmentUnitsRepository;

        public HomeController(ISponsorsRepository spnsRep, IInvestmentUnitsRepository invRep)
        {
            _sponsorsRepository = spnsRep;
            _investmentUnitsRepository = invRep;
        }

        /// <summary>
        /// ChildActionOnly prevents direct URL into this method i.e. /Sponsors/Home/SponsorDetail
        /// </summary>
        /// <returns></returns>
        [ChildActionOnly]
        public PartialViewResult SponsorDetail()
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var sponsor = _sponsorsRepository.FindByRegistrationToken(authUser.SponsorCode);
            if (sponsor == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user sponsor code is not valid!");

            // Call upon the sponsors repository to return sponsor stats
            SponsorStats stats = _sponsorsRepository.RetrieveSponsorStats(sponsor.Id);
            if (stats == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user sponsor returned bad stats!");

            SponsorDetailViewModel model = new SponsorDetailViewModel()
            {
                Sponsor = sponsor,
                Stats = stats
            };

            return PartialView("SponsorDetail", model);
        }

        public ActionResult Index()
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var sponsor = _sponsorsRepository.FindByRegistrationToken(authUser.SponsorCode);
            if (sponsor == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user sponsor code is not valid!");

            return View(sponsor);
        }

        // TODO: Add a parameter to control the time frame: last 1 month, last 6 months, etc. 
        public ActionResult Bonds(int page = 1, int count = 20)
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var sponsor = _sponsorsRepository.FindByRegistrationToken(authUser.SponsorCode);
            if (sponsor == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user sponsor code is not valid!");

            if (page < 1 || count < 1)
                throw new HttpException((int)HttpStatusCode.BadRequest, "Page or Count parameter has to be greater than 1.");

            Expression<Func<InvestmentUnit, bool>> filter = x => x.Sponsor.Id == sponsor.Id && x.SponsorReference != "";
            var bonds = _investmentUnitsRepository.Search(filter, page, count);
            var maxPage = Math.Max((int)Math.Ceiling((double)_investmentUnitsRepository.Count(filter) / count), 1);
            InvestmentUnitsViewModel model = new InvestmentUnitsViewModel()
            {
                SponsorId = sponsor.Id,
                Page = page,
                MaxPage = maxPage,
                Items = bonds.Select(x => x)
            };

            return View(model);
        }
    }
}
