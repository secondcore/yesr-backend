using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading;
using Global.YESR.Repositories;
using Global.YESR.Repositories;
using Global.YESR.Storage.Azure;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.Diagnostics;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace Global.YESR.Worker
{
    // This will be used for generic background cleanup tasks
    public class WorkerRole : RoleEntryPoint
    {
        private YContext _context;
        private IYesrRepository _yesrRepository;
        private CloudQueue _membershipsPumpQueue;
        private CloudQueue _testMembershipsPumpQueue;
  
        public override void Run()
        {
            // This is a sample worker implementation. Replace with your logic.
            Trace.WriteLine("Global.YESR.Worker entry point called", "Information");

            while (true)
            {

                // I wanted to make sure that the context is per request!!!!
                // This is a best practice!!
                // We may have to place this inside the while loop!! 
                _context = new YContext();
                _yesrRepository = new YesrRepository(_context);

                // Give a priority to test membership pumps
                // Initially I wanted to create a worker role for each queue. But the local emulator was running really slow and also 
                // the Azure prices are centered around the hours an instance is running! So the more running instances, the more expensive
                // it becomes. 
                
                // Currently the role instances cost between .12 cents/hr to .96 cents/hr. So if we have two small instances (Web and Worker), 
                // our monthly bill is about 750 hrs * .24 cents = $180/month!!
                var msg = _testMembershipsPumpQueue.GetMessage(TimeSpan.FromSeconds(5));
                while (msg != null)
                {
                    var pumpKey = msg.AsString;
                    _yesrRepository.ProcessPumpTestMembership(Int32.Parse(pumpKey));

                    _testMembershipsPumpQueue.DeleteMessage(msg.Id, msg.PopReceipt);
                    msg = _testMembershipsPumpQueue.GetMessage(TimeSpan.FromSeconds(5));
                }

                msg = _membershipsPumpQueue.GetMessage(TimeSpan.FromSeconds(5));
                while (msg != null)
                {
                    var pumpKey = msg.AsString;
                    _yesrRepository.ProcessPumpMemberships(Int32.Parse(pumpKey));

                    _membershipsPumpQueue.DeleteMessage(msg.Id, msg.PopReceipt);
                    msg = _membershipsPumpQueue.GetMessage(TimeSpan.FromSeconds(5));
                }

                if (_context != null)
                {
                    _context.Dispose();
                    _context = null;
                }

                Thread.Sleep(1000);
                Trace.WriteLine("Working", "Information");
            }
        }

        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections 
            ServicePointManager.DefaultConnectionLimit = 12;

            // For information on handling configuration changes
            // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.

            _membershipsPumpQueue = StorageService.GetCloudQueue(StorageConstants.MembershipsPumpQueue);
            _testMembershipsPumpQueue = StorageService.GetCloudQueue(StorageConstants.TestMembershipPumpQueue);

            return base.OnStart();
        }

        public override void OnStop()
        {
            if (_context != null)
                _context.Dispose();

            base.OnStop();
        }
    }
}
