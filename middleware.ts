import { createServerClient } from '@supabase/ssr'
import type { CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/types'

type ProfileRole = Pick<Database['public']['Tables']['profiles']['Row'], 'role'>

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { pathname } = request.nextUrl

  // Refresh session — must happen before any redirect checks
  const { data: { user } } = await supabase.auth.getUser()

  // Public routes — always accessible
  const isPublic = pathname === '/login' || pathname.startsWith('/join')
  if (isPublic) {
    // Logged-in users hitting /login get sent to the app
    if (user && pathname === '/login') {
      return NextResponse.redirect(new URL('/app/dashboard', request.url))
    }
    return supabaseResponse
  }

  // Not authenticated → send to login
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Fetch profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single() as { data: ProfileRole | null; error: unknown }

  const role = profile?.role

  // /admin routes → platform_admin only
  if (pathname.startsWith('/admin') && role !== 'platform_admin') {
    return NextResponse.redirect(new URL('/app/dashboard', request.url))
  }

  // platform_admin hitting /app → redirect to /admin
  if (pathname.startsWith('/app') && role === 'platform_admin') {
    return NextResponse.redirect(new URL('/admin/schools', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
