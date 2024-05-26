import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'
import type { Database } from './database.types'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res })
  // const supabase = createClient<Database>('https://ahxrbnmihoubuffzykgg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoeHJibm1paG91YnVmZnp5a2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcxNjk1NjQsImV4cCI6MjAyMjc0NTU2NH0.KUUPyTV_1GdyuyEJjPsP3pWq8E1d7IllEKBe8qHPz74')


  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()

  // if user is not signed in and the current path is not /login redirect the user to /login
  if (!user && req.nextUrl.pathname !== '/login' && req.nextUrl.pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // if user is signed in and the current path is /login redirect to homepage
  if (user && req.nextUrl.pathname == '/login') {
    return NextResponse.redirect(new URL('/', req.url))
  }

    // console.log(session)
    // console.log('omg')
    // console.log(user)

    // console.log('you are elle')
    // console.log(req.nextUrl.pathname)

  return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}