<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cloudinary Configuration
    |--------------------------------------------------------------------------
    | Persistent file storage for Railway deployments.
    | Files uploaded here survive redeployments unlike local disk storage.
    |
    | Set these in your Railway environment variables:
    |   CLOUDINARY_CLOUD_NAME
    |   CLOUDINARY_API_KEY
    |   CLOUDINARY_API_SECRET
    */

    'cloud_url' => env('CLOUDINARY_URL'),

    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
    'api_key'    => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),

    'secure' => true,
];
