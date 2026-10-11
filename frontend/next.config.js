/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Preserve multipart request bodies by accepting API URLs with either slash form.
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
