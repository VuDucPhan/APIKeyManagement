/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://kecyufofrwkqftmgswee.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlY3l1Zm9mcndrcWZ0bWdzd2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2NDgzNDgsImV4cCI6MjA2MTIyNDM0OH0.OjXkpfvlvNKOWGUNleisgSAGtv1UfZypeFEN4MM3lSg',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
