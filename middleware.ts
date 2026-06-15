import { updateSession } from './app/lib/supabase/middleware'

export async function middleware(request: Request) {
  return updateSession(request as import('next/server').NextRequest)
}

export const config = {
  matcher: ['/admin/:path*'],
}
