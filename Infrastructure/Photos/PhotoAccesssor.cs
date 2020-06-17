using System;
using System.Net;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Photos;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccesssor : IPhotoAccessor
    {
        private string connectionString { get; set; }
        private readonly string containerName = "image-share";
        private readonly string blobName = Guid.NewGuid().ToString();
        public BlobServiceClient blobServiceClient { get; set; }
        public BlobContainerClient containerClient { get; set; }
        public PhotoAccesssor(IOptions<ImageStorageSettings> config)
        {
            connectionString = config.Value.ConnectionString;
            blobServiceClient = new BlobServiceClient(connectionString);
            containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        }

        public PhotoUploadResult AddPhoto(IFormFile file)
        {
            BlobContentInfo result;
            var blobClient = containerClient.GetBlobClient(blobName);
            //blobClient.SetHttpHeaders(new BlobHttpHeaders { ContentType = "image/jpeg" });

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    result = blobClient.Upload(stream, true);
                    blobClient.SetHttpHeaders(new BlobHttpHeaders { ContentType = "image/jpeg" });

                }
            }


            return new PhotoUploadResult
            {
                PublicId = blobName,
                Url = blobClient.Uri.AbsoluteUri
            };
        }

        public string DeletePhoto(string publicId)
        {
            var blobClient = containerClient.GetBlobClient(publicId);
            var result = blobClient.Delete();
            return result.Status.ToString();
        }
    }
}