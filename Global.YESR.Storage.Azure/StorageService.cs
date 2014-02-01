using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.WindowsAzure;
using Microsoft.WindowsAzure.ServiceRuntime;
using Microsoft.WindowsAzure.StorageClient;

namespace Global.YESR.Storage.Azure
{
    public class StorageService
    {
        private static bool _isStorageInitialized = false;
        private static object _initializeLock = new Object();
        private static CloudQueueClient _cloudQueueClient;
        private static CloudTableClient _cloudTableClient;

        private static void Initialize()
        {
            if (_isStorageInitialized)
                return;

            lock(_initializeLock)
            {
                if (_isStorageInitialized)
                    return;

                CloudStorageAccount.SetConfigurationSettingPublisher((setting, setter) =>
                {
                    setter(RoleEnvironment.GetConfigurationSettingValue(setting));
                });

                var cloudStorageAccount = CloudStorageAccount.FromConfigurationSetting(StorageConstants.StorageConnectionsString);
                _cloudQueueClient = cloudStorageAccount.CreateCloudQueueClient();

                CloudQueue membershipsPumpQueue = _cloudQueueClient.GetQueueReference(StorageConstants.MembershipsPumpQueue);
                membershipsPumpQueue.CreateIfNotExist();

                CloudQueue testMembershipPumpQueue = _cloudQueueClient.GetQueueReference(StorageConstants.TestMembershipPumpQueue);
                testMembershipPumpQueue.CreateIfNotExist();

                CloudQueue testMembershipDeleterQueue = _cloudQueueClient.GetQueueReference(StorageConstants.TestMembershipDeleterQueue);
                testMembershipDeleterQueue.CreateIfNotExist();

                _cloudTableClient = cloudStorageAccount.CreateCloudTableClient();
                _cloudTableClient.CreateTableIfNotExist(StorageConstants.TestTable);

                _isStorageInitialized = true;
            }
        }

        // Queues Support
        public static CloudQueueClient GetCloudQueueClient()
        {
            Initialize();
            return _cloudQueueClient;
        }

        public static CloudQueue GetCloudQueue(string queueName)
        {
            Initialize();
            return _cloudQueueClient.GetQueueReference(queueName);
        }

        // Tables Support
        public static CloudTableClient GetCloudTableClient()
        {
            Initialize();
            return _cloudTableClient;
        }

        public static TableServiceContext GetCloudTableContext()
        {
            Initialize();
            return _cloudTableClient.GetDataServiceContext();
        }

    }
}
