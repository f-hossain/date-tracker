import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/database.types'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient<Database>({ req, res })

    const { error } = await supabase.auth.signOut()

    cookies().getAll().map( (cookie : any) => {
        cookies().delete(cookie.name)
    })


    return NextResponse.redirect(new URL('/login', req.url))
}