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
using Global.YESR.Web.Areas.Yesr.ViewModels;
using Global.YESR.Web.Helpers;

namespace Global.YESR.Web.Areas.Yesr.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private IYesrRepository _yesrRepository;

        public HomeController(IYesrRepository ysrRep)
        {
            _yesrRepository = ysrRep;
        }

        /// <summary>
        /// ChildActionOnly prevents direct URL into this method i.e. /Yesr/Home/YesrDetail
        /// </summary>
        /// <returns></returns>
        [ChildActionOnly]
        public PartialViewResult YesrDetail()
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            // Call upon the sponsors repository to return sponsor stats
            YesrStats stats = _yesrRepository.RetrieveYesrStats();
            if (stats == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user sponsor returned bad stats!");

            YesrDetailViewModel model = new YesrDetailViewModel()
            {
                Stats = stats
            };

            return PartialView("YesrDetail", model);
        }

        public ActionResult Index()
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            return View();
        }

        public ActionResult SponsorInvoicesMonitor()
        {
            return View();
        }

        public ActionResult DividendsVsMgmtFeesMonitor()
        {
            return View();
        }

        public ActionResult SpendsVsDividendsMonitor()
        {
            return View();
        }
    }
}
