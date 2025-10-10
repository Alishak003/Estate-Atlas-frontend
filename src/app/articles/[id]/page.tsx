
'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'

interface WordPressPost {
  id: string
  title: { rendered: string }
  content: { rendered: string }
  _embedded?: {
    'wp:featuredmedia'?: [
      {
        source_url: string
      }
    ]
  }
}

export default function PostDetail() {
  const params = useParams()
  const id = params?.id
  const [post, setPost] = useState<WordPressPost | null>(null)

  useEffect(() => {
    if (!id) return
    fetch(`https://peru-stork-399467.hostingersite.com/wp-json/wp/v2/posts/${id}?_embed`)
      .then(res => res.json())
      .then(data => setPost(data))
  }, [id])

  return (
    <section>
      <Navbar />
      <div className="container mx-auto py-10 px-4 min-h-screen">
        {post ? (
          <article className="prose lg:prose-lg max-w-7xl mx-auto">
            {/* Featured Image */}
            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-10 shadow-lg">
                <Image
                  src={post._embedded['wp:featuredmedia'][0].source_url}
                  alt={post.title.rendered}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            )}

            {/* Title */}
            <h1
              className="text-4xl font-bold mb-6 text-gray-800"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />

            {/*  Content */}
            <div
              className="text-lg leading-relaxed prose-p:mb-4 prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
            />
          </article>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
            {/* Spinner */}
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600 text-lg animate-pulse">
              Loading post details...
            </p>
          </div>
        )}
      </div>
      <Footer />
    </section>
  )
}
