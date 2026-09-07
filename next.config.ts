import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        // The sequence is ~200 requests per visit, so it has to come off the
        // disk cache on repeat views. Note the filenames are stable: if the
        // film is ever recut, the folder needs a version suffix to bust this.
        source: "/frames/:tier/:file",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
