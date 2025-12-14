const deploymentBasePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() ?? "";
const normalizedBasePath =
  deploymentBasePath === "" ? "" : `/${deploymentBasePath.replace(/^\/|\/$/g, "")}`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  ...(normalizedBasePath
    ? { basePath: normalizedBasePath, assetPrefix: normalizedBasePath }
    : {}),
};

export default nextConfig;
