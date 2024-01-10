const resolvePrefixPath = () => {
  const env = process.env.NODE_ENV;
  console.log("ENV", env);
  if (env === "test") return "/test";
  if (env === "beta") return "/beta";
  return "";
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: resolvePrefixPath(),
};

module.exports = nextConfig;
