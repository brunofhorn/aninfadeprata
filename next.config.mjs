/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ?? process.env.VITE_API_BASE_URL ?? '',
    NEXT_PUBLIC_EMAILJS_SERVICE_ID:
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? process.env.VITE_EMAILJS_SERVICE_ID ?? '',
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? process.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? process.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
    NEXT_PUBLIC_PIX_KEY:
      process.env.NEXT_PUBLIC_PIX_KEY ?? process.env.VITE_PIX_KEY ?? '',
    NEXT_PUBLIC_PIX_RECEIVER_NAME:
      process.env.NEXT_PUBLIC_PIX_RECEIVER_NAME ?? process.env.VITE_PIX_RECEIVER_NAME ?? '',
    NEXT_PUBLIC_PIX_RECEIVER_CITY:
      process.env.NEXT_PUBLIC_PIX_RECEIVER_CITY ?? process.env.VITE_PIX_RECEIVER_CITY ?? '',
  },
}

export default nextConfig
