import type React from "react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-200 p-4">
        <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
        <ul className="space-y-2">
          <li>
            <a href="/admin" className="block hover:bg-gray-300 p-2 rounded">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/admin/users" className="block hover:bg-gray-300 p-2 rounded">
              Users
            </a>
          </li>
          <li>
            <a href="/admin/reports" className="block hover:bg-gray-300 p-2 rounded">
              Reports
            </a>
          </li>
          <li>
            <a href="/admin/settings" className="block hover:bg-gray-300 p-2 rounded">
              Settings
            </a>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  )
}
