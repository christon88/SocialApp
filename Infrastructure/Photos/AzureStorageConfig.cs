using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class AzureStorageConfig
    {
        public string AccountName { get; set; }
        public string AccountKey { get; set; }
        public string ImageContainer { get; set; }
        public AzureStorageConfig(IOptions<ImageStorageSettings> config)
        {
            AccountName = config.Value.StorageAccount;
            AccountKey = config.Value.ApiKey;
            ImageContainer = "image-share";
        }
    }
}