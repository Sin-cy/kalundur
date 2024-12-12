import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https", // Specify the protocol (http/https)
                hostname: "lh3.googleusercontent.com", // Specify the hostname
                pathname: "/**", // Use `/**` to allow all paths under this domain
            },
            {
                protocol: "https",
                hostname: "utfs.io",
                pathname: "/**",
            },
            // Add any other domains if needed
        ], 
    },
    /* config options here */
};

export default nextConfig;
