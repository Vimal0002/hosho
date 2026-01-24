import { NextResponse } from 'next/server';

export function middleware(request) {
    // Authentication disabled by user request.
    // Allow access to all routes without checking for tokens.
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
