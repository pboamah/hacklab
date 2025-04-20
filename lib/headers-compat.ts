"use client"

import { isClient } from "./is-client"

// Client-side implementation for cookies
export function getCookieCompat(name: string): string | undefined {
  if (isClient) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return undefined
  } else {
    // This should never be called on the server from a client component
    console.warn("getCookieCompat called on server from a client component")
    return undefined
  }
}

// Client-side implementation for headers
export function getHeadersCompat(): Headers {
  if (isClient) {
    // Browser doesn't expose request headers to JavaScript
    // Return empty headers on client side
    return new Headers()
  } else {
    // This should never be called on the server from a client component
    console.warn("getHeadersCompat called on server from a client component")
    return new Headers()
  }
}

export function getHeaderCompat(name: string): string | null {
  if (isClient) {
    // Browser doesn't expose request headers to JavaScript
    return null
  } else {
    // This should never be called on the server from a client component
    console.warn("getHeaderCompat called on server from a client component")
    return null
  }
}

// React hook for accessing cookies in client components
export function useCookie(name: string): string | undefined {
  if (isClient) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return undefined
  } else {
    // This should never happen in a client component
    console.warn("useCookie called on server from a client component")
    return undefined
  }
}

// React hook for accessing headers in client components
export function useHeaders(): Headers {
  if (isClient) {
    // Browser doesn't expose request headers to JavaScript
    return new Headers()
  } else {
    // This should never happen in a client component
    console.warn("useHeaders called on server from a client component")
    return new Headers()
  }
}
