import nextMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // Page extensions that can have mdx content
    pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

    // Enable static site generation
    // output: 'export',

    // // Out directory for static site generation
    distDir: 'out'
}

// Check if in production mode
if (process.env.NODE_ENV === 'production') {
    // Enable static site generation
    nextConfig.output = 'export'
}

const withMDX = nextMDX({
    // make it support both .md and .mdx
    extension: /\.mdx?$/
})
export default withMDX(nextConfig)

// export default nextConfig
