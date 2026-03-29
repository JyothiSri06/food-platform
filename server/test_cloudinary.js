const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("Testing Cloudinary with:");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);

async function testCloudinary() {
    try {
        const ping = await cloudinary.api.ping();
        console.log("Cloudinary Ping Result:", ping);

        const usage = await cloudinary.api.usage();
        console.log("Cloudinary Usage Result:", JSON.stringify(usage, null, 2));

        console.log("Testing URL upload...");

    } catch (error) {
        console.error("Cloudinary Test Error:", error);
    }
}

testCloudinary();
