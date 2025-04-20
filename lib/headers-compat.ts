import { isClient } from "./is-client"
import { headersStore } from "./store/headers-store"

// Client-side implementation for cookies
export function getCookieCompat(name: string): string | undefined {
  if (isClient) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift()
    return undefined
  } else {
    return headersStore.getCookie(name) || undefined
  }
}

// Client-side implementation for headers
export function getHeadersCompat(): Headers {
  if (isClient) {
    // Browser doesn't expose request headers to JavaScript
    // Return empty headers on client side
    return new Headers()
  } else {
    const headersObj = headersStore.getAllHeaders()
    return new Headers(headersObj)
  }
}

export function getHeaderCompat(name: string): string | null {
  if (isClient) {
    // Browser doesn't expose request headers to JavaScript
    return null
  } else {
    return headersStore.getHeader(name)
  }
}
