import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // If env vars are missing, let the request through — pages handle auth themselves
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    })

    const { data: { user } } = await supabase.auth.getUser()

    // Redirect unauthenticated users away from protected admin pages
    if (pathname.startsWith('/admin/leads') || pathname.startsWith('/admin/settings')) {
      if (!user) {
        const loginUrl = request.nextUrl.clone()
        loginUrl.pathname = '/admin'
        return NextResponse.redirect(loginUrl)
      }
    }
  } catch (err) {
    console.error('Middleware error:', err)
    // Never crash the middleware — let the page handle auth
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}