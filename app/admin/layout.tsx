import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'platform_admin') redirect('/app/dashboard')

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="w-56 bg-green-900 text-white flex flex-col gap-6 p-5 sticky top-0 h-screen">
        <div>
          <div className="font-black tracking-widest text-xs text-green-100">CRESCER</div>
          <div className="text-green-100/60 text-[10px] font-semibold tracking-widest mt-1">
            ADMIN PLATAFORMA
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <a
            href="/admin/schools"
            className="px-3 py-2 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
          >
            Escolas
          </a>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
