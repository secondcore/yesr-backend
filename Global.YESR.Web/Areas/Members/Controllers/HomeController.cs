using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Global.YESR.Models;
using Global.YESR.Models.InvestmentUnitTransactions;
using Global.YESR.Models.MembershipTransactions;
using Global.YESR.Models.Stats;
using Global.YESR.Repositories;
using Global.YESR.Repositories.InvestmentUnitTransactionsRepositories;
using Global.YESR.Repositories.MembershipTransactionsRepositories;
using Global.YESR.Web.Areas.Members.ViewModels;
using Global.YESR.Web.Helpers;

namespace Global.YESR.Web.Areas.Members.Controllers
{
	[Authorize]
	public class HomeController : Controller
	{
		private IMembershipsRepository _membershipsRepository;
		private IPurchasesRepository _purchasesRepository;
		private ICashBackBonusesRepository _cashBackBonusesRepository;
		private IReferralBonusesRepository _referralBonusesRepository;
		private IAccumulationReservesRepository _accumulationReservesRepository;
		private IInvestmentUnitsRepository _investmentUnitsRepository;
		private IDividendBonusesRepository _dividendBonusesRepository;
        private IYesrRepository _yesrRepository;

		public HomeController(IMembershipsRepository memsRep, IPurchasesRepository purRep, ICashBackBonusesRepository cbRep, IReferralBonusesRepository refRep, IAccumulationReservesRepository arRep, IInvestmentUnitsRepository iuRep, IDividendBonusesRepository divRep, IYesrRepository ysrRep)
		{
			_membershipsRepository = memsRep;
			_purchasesRepository = purRep;
			_cashBackBonusesRepository = cbRep;
			_referralBonusesRepository = refRep;
			_accumulationReservesRepository = arRep;
			_investmentUnitsRepository = iuRep;
			_dividendBonusesRepository = divRep;
            _yesrRepository = ysrRep;
        }

        /// <summary>
		/// ChildActionOnly prevents direct URL into this method i.e. /Members/Home/MembershipDetail
		/// </summary>
		/// <returns></returns>
		[ChildActionOnly]
		public PartialViewResult MembershipDetail()
		{
			var authUser = SessionHelper.Authenticated;
			if (authUser == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

			var membership = _membershipsRepository.FindByMembershipNumber(authUser.MembershipNumber);
			if (membership == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user membership number is not valid!");

			// Call upon the memberships repository to return membership stats
			MembershipStats stats = _membershipsRepository.RetrieveMembershipStats(membership.Id);
			if (stats == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user membership returned bad stats!");

			MembershipDetailViewModel model = new MembershipDetailViewModel()
			{
				Membership = membership,
				Stats = stats
			};

			return PartialView("MembershipDetail", model);
		}

		public ActionResult Index()
		{
			var authUser = SessionHelper.Authenticated;
			if (authUser == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

			var membership = _membershipsRepository.FindByMembershipNumber(authUser.MembershipNumber);
			if (membership == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user membership number is not valid!");

			return View(membership);
		}

		public ActionResult Profile()
		{
			var authUser = SessionHelper.Authenticated;
			if (authUser == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

			var membership = _membershipsRepository.FindByMembershipNumber(authUser.MembershipNumber);
			if (membership == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user membership number is not valid!");

			return View(membership.Member);
		}

		public ActionResult AccumulationReserves(int page = 1, int count = 20)
		{
			var authUser = SessionHelper.Authenticated;
			if (authUser == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

			var membership = _membershipsRepository.FindByMembershipNumber(authUser.MembershipNumber);
			if (membership == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user membership number is not valid!");

			if (page < 1 || count < 1)
				throw new HttpException((int)HttpStatusCode.BadRequest, "Page or Count parameter has to be greater than 1.");

			Expression<Func<AccumulationReserve, bool>> filter = x => x.Membership.Id == membership.Id;
			var accumulationReserves = _accumulationReservesRepository.Search(filter, page, count);
			var maxPage = Math.Max((int)Math.Ceiling((double)_accumulationReservesRepository.Count(filter) / count), 1);
			AccumulationReservesViewModel model = new AccumulationReservesViewModel()
			{
				MembershipId = membership.Id,
				Page = page,
				MaxPage = maxPage,
				Items = accumulationReserves.Select(x => x)
			};

			return View(model);
		}

        public ActionResult ReferralBonuses(int page = 1, int count = 20)
        {
            var authUser = SessionHelper.Authenticated;
            if (authUser == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

            var membership = _membershipsRepository.FindByMembershipNumber(authUser.MembershipNumber);
            if (membership == null)
                throw new HttpException((int)HttpStatusCode.BadRequest, "The user membership number is not valid!");

            if (page < 1 || count < 1)
                throw new HttpException((int)HttpStatusCode.BadRequest, "Page or Count parameter has to be greater than 1.");

            Expression<Func<ReferralBonus, bool>> filter = x => x.Beneficiary.Id == membership.Id;
            var referralBonuses = _referralBonusesRepository.Search(filter, page, count);
            var maxPage = Math.Max((int)Math.Ceiling((double)_referralBonusesRepository.Count(filter) / count), 1);
            ReferralBonusesViewModel model = new ReferralBonusesViewModel()
            {
                MembershipId = membership.Id,
                Page = page,
                MaxPage = maxPage,
                Items = referralBonuses.Select(x => x)
            };

            return View(model);
        }

        public ActionResult InvestmentUnits(int page = 1, int count = 20)
		{
			var authUser = SessionHelper.Authenticated;
			if (authUser == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

			var membership = _membershipsRepository.FindByMembershipNumber(authUser.MembershipNumber);
			if (membership == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user membership number is not valid!");

			if (page < 1 || count < 1)
				throw new HttpException((int)HttpStatusCode.BadRequest, "Page or Count parameter has to be greater than 1.");

			Expression<Func<InvestmentUnit, bool>> filter = x => x.Membership.Id == membership.Id && x.SponsorReference != "";
			var bonds = _investmentUnitsRepository.Search(filter, page, count);
			var maxPage = Math.Max((int)Math.Ceiling((double)_investmentUnitsRepository.Count(filter) / count), 1);
			InvestmentUnitsViewModel model = new InvestmentUnitsViewModel()
			{
				MembershipId = membership.Id,
				Page = page,
				MaxPage = maxPage,
				Items = bonds.Select(x => x)
			};

			return View(model);
		}

		public ActionResult Dividends(int page = 1, int count = 20)
		{
			var authUser = SessionHelper.Authenticated;
			if (authUser == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user is not authenticated!");

			var membership = _membershipsRepository.FindByMembershipNumber(authUser.MembershipNumber);
			if (membership == null)
				throw new HttpException((int)HttpStatusCode.BadRequest, "The user membership number is not valid!");

			if (page < 1 || count < 1)
				throw new HttpException((int)HttpStatusCode.BadRequest, "Page or Count parameter has to be greater than 1.");

			Expression<Func<DividendBonus, bool>> filter = x => x.InvestmentUnit.Membership.Id == membership.Id;
			var bonds = _dividendBonusesRepository.Search(filter, page, count);
            var maxPage = Math.Max((int)Math.Ceiling((double)_dividendBonusesRepository.Count(filter) / count), 1);
			DividendBonusesViewModel model = new DividendBonusesViewModel()
			{
				MembershipId = membership.Id,
				Page = page,
				MaxPage = maxPage,
				Items = bonds.Select(x => x)
			};

			if (model.Items == null)
				model.Items = new List<DividendBonus>();

			return View(model);
		}
    }
}