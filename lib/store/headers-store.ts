import { makeAutoObservable } from "mobx"
import { isClient } from "../is-client"

interface HeadersState {
  cookies: Record<string, string>
  headers: Record<string, string>
}

export class HeadersStore {
  state: HeadersState = {
    cookies: {},
    headers: {},
  }

  constructor() {
    makeAutoObservable(this)
  }

  // Initialize headers and cookies on the server side
  initializeFromServerRequest(req?: Request) {
    if (isClient) return

    try {
      if (req) {
        // Parse headers
        const headers: Record<string, string> = {}
        req.headers.forEach((value, key) => {
          headers[key] = value
        })
        this.state.headers = headers

        // Parse cookies
        const cookieHeader = req.headers.get("cookie")
        if (cookieHeader) {
          const cookies: Record<string, string> = {}
          cookieHeader.split(";").forEach((cookie) => {
            const [name, value] = cookie.trim().split("=")
            if (name && value) {
              cookies[name] = value
            }
          })
          this.state.cookies = cookies
        }
      }
    } catch (error) {
      console.error("Failed to initialize headers store:", error)
    }
  }

  // Get value from headers
  getHeader(name: string): string | null {
    return this.state.headers[name] || null
  }

  // Get all headers
  getAllHeaders(): Record<string, string> {
    return this.state.headers
  }

  // Get cookie value
  getCookie(name: string): string | null {
    return this.state.cookies[name] || null
  }

  // Get all cookies
  getAllCookies(): Record<string, string> {
    return this.state.cookies
  }
}

export const headersStore = new HeadersStore()
