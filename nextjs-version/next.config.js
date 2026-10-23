/** Static export so it can be hosted on GitHub Pages.
 *  For a project page build with:  NEXT_PUBLIC_BASE_PATH=/<repo-name> npm run build  → deploy the `out/` folder. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
module.exports = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  reactStrictMode: false, // the hero engine mutates the DOM once; avoid dev double-mount
  images: { unoptimized: true },
};
