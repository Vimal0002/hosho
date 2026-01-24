import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        // Simple Mock Auth (You can expand this later)
        // For now, accept any valid looking email and a non-empty password
        // OR enforce a specific demo user
        // Check for Specific Credentials
        // Email: rp0366685@example.com
        // Password: Vimal@2004@
        if (email === 'rp0366685@example.com' && password === 'Vimal@2004@') {
            const response = NextResponse.json({ success: true });

            // Set a simple auth cookie
            // In production, use JWT or proper sessions
            response.cookies.set('auth-token', 'valid-session-id', {
                httpOnly: true,
                path: '/',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
        }

        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    } catch (e) {
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
