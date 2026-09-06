const isGithub = process.env.GITHUB_ACTIONS === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGithub ? "/levant-ict-briefing" : "",
  assetPrefix: isGithub ? "/levant-ict-briefing/" : ""
};

export default nextConfig;
