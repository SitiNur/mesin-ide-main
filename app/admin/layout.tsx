'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '../lib/supabase/client'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [email, setEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false)
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email)
      }
      setLoading(false)
    })
  }, [isLoginPage])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="w-full max-w-full px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-black text-orange-600">PlayBox Admin</h1>
            <p className="text-xs text-slate-500">Kelola aktivitas bermain anak</p>
          </div>
          <div className="flex items-center gap-4">
            {!loading && email && (
              <span className="text-sm text-slate-600 hidden sm:inline">{email}</span>
            )}
            <button
              onClick={handleLogout}
              className="text-sm font-semibold text-slate-600 hover:text-orange-600 border border-slate-300 hover:border-orange-300 px-3 py-1.5 rounded-lg transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>
      <main className="w-full px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
