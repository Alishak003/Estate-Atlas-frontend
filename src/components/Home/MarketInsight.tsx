'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ✅ WordPress post type
interface WordPressPost {
  id: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    "wp:featuredmedia"?: [
      {
        source_url: string;
      }
    ];
  };
}

const MarketInsight = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://peru-stork-399467.hostingersite.com/wp-json/wp/v2/posts?_embed"
        );

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        setPosts(data.slice(0, 6)); 
      } catch (error: unknown) {
        setError("Failed to load posts");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-[#050d2e] relative overflow-hidden mt-10">
      {/* Glowing Background */}
      <div className="absolute inset-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_15%_40%,_rgba(22,61,123,0.4)_0%,_transparent_60%)]" />
        <div className="w-full h-full bg-[radial-gradient(circle_at_75%_80%,_rgba(13,46,98,0.3)_0%,_transparent_60%)]" />
        <div className="w-full h-full bg-[radial-gradient(circle_at_60%_20%,_rgba(11,41,90,0.25)_0%,_transparent_60%)]" />
        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_85%,_rgba(19,55,105,0.2)_0%,_transparent_60%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-10 container mx-auto">
        <h1 className="font-semibold text-5xl pt-10 text-center text-white">
          Latest Market Insights
        </h1>

        <section className="w-11/12 mx-auto md:grid grid-cols-3 gap-8 my-14 md:space-y-0 space-y-5">
          {loading ? (
            // 🔄 Skeleton loader
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse border border-gray-700 bg-[#0a1532]/50 rounded-2xl p-4 shadow-sm"
              >
                <div className="bg-gray-700 h-40 w-full rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-5/6"></div>
              </div>
            ))
          ) : error ? (
            <p className="col-span-3 text-center text-red-400">{error}</p>
          ) : posts.length > 0 ? (
            posts.map((post) => {
              const imageUrl =
                post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

              return (
                <div
                  key={post.id}
                  className="bg-[#0A1532] text-white rounded-xl shadow-lg  hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#3BA1DF] "
                >
                  {/* Featured image OR Placeholder */}
                  <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={post.title.rendered}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">No Image</span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                      <Link href={`/articles/${post.id}`}>
                        {post.title.rendered}
                      </Link>
                    </h2>

                    <div
                      className="text-gray-100 text-sm line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: post.excerpt.rendered,
                      }}
                    />

                    <Link
                      href={`/articles/${post.id}`}
                      className="text-[#308fd9] hover:underline mt-4 block font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="col-span-3 text-center text-white">
              No articles found.
            </p>
          )}
        </section>

        <div className="flex justify-center items-center">
          <Link
            href={"/articles"}
            className="py-3 px-4 bg-white rounded-lg text-[#0A1532]"
          >
            All Articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketInsight;
