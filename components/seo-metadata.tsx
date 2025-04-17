"use client"

import Head from "next/head"

interface SeoMetadataProps {
  title: string
  description: string
  url?: string
  imageUrl?: string
  type?: string
  publishedDate?: string
  modifiedDate?: string
  keywords?: string[]
  author?: string
  noIndex?: boolean
}

export function SeoMetadata({
  title,
  description,
  url,
  imageUrl,
  type = "website",
  publishedDate,
  modifiedDate,
  keywords,
  author,
  noIndex = false,
}: SeoMetadataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImageUrl = imageUrl && !imageUrl.startsWith("http") ? `${baseUrl}${imageUrl}` : imageUrl

  return (
    <Head>
      {/* Basic metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {fullImageUrl && <meta property="og:image" content={fullImageUrl} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      {fullImageUrl && <meta property="twitter:image" content={fullImageUrl} />}

      {/* Additional SEO metadata */}
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      {author && <meta name="author" content={author} />}
      {publishedDate && <meta property="article:published_time" content={publishedDate} />}
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}

      {/* Indexing control */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Head>
  )
}

// This component can be used in pages that need SEO metadata
// Example usage:
// <SeoMetadata
//   title="Event Title - Community Platform"
//   description="Join us for this exciting event..."
//   url="/events/123"
//   imageUrl="/event-image.jpg"
//   type="article"
//   publishedDate="2023-04-15T10:00:00Z"
//   keywords={["event", "community", "technology"]}
//   author="Event Organizer"
// />
