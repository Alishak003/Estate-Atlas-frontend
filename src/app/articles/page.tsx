'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SearchInput from '@/components/Article/search-input';
import Image from 'next/image';
import abanner from '../../../public/ArticleBanner.jpg';

interface WordPressPost {
  id: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  _embedded?: {
    'wp:featuredmedia'?: [
      {
        source_url: string;
      }
    ];
  };
}

const Articles = () => {
  const [posts, setPosts] = useState<WordPressPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<WordPressPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          'https://peru-stork-399467.hostingersite.com/wp-json/wp/v2/posts?_embed'
        );

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        setPosts(data);
        setFilteredPosts(data); // by default all posts
      } catch (error: unknown) {
        setError('Failed to load posts');
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 🔍 Filter when searchQuery changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = posts.filter(
        (post) =>
          post.title.rendered.toLowerCase().includes(q) ||
          post.excerpt.rendered.toLowerCase().includes(q)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  return (
    <section>
      <Navbar />

      <div className="min-h-screen mb-5  px-5">
        <div className="mx-auto container">
          <h1 className="md:text-6xl text-4xl mt-20 text-center font-semibold leading-relaxed md:leading-[5rem]">
            Insights & Trends for Global Real <br /> Estate Professionals
          </h1>
          <p className="mt-6 text-xl text-center text-[#80838A] leading-loose">
            Access global real estate insights tailored to your needs. No hidden
            fees, cancel anytime.
          </p>

          {/* 🔍 Search Bar */}
          <div className="flex justify-center mt-10 w-11/12 mx-auto">
            <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>

          {/* Banner */}
          <div className="relative mt-10 w-11/12 mx-auto px-4 md:px-10 py-10 md:py-20 rounded-2xl overflow-hidden">
            <Image src={abanner} alt="Article Banner" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative z-10 flex h-full items-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl">
                  <div className="mb-6">
                    <span className="inline-block rounded-md bg-slate-800/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                      Rental Yields
                    </span>
                  </div>
                  <h1 className="mb-6 text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                    Gross rental yields in Mauritius — Transparent Analytics and Market Trends
                  </h1>
                  <p className="text-lg text-white/90 sm:text-xl">March 10, 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Display Posts */}
          <div className="mt-10">
            {loading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse border rounded-2xl p-4 shadow-sm"
                  >
                    <div className="bg-gray-300 h-40 w-full rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600">{error}</p>
            ) : filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {filteredPosts.map((post) => {
                  const imageUrl =
                    post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

                  return (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl hover:shadow-xl transition-all duration-300 overflow-hidden border"
                    >
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
                      <div className="p-5">
                        <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                          <Link href={`/articles/${post.id}`}>
                            {post.title.rendered}
                          </Link>
                        </h2>
                        <div
                          className="text-gray-600 text-sm line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
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
                })}
              </div>
            ) : (
              <p className='text-2xl font-bold text-center'>No posts found.</p>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default Articles;
