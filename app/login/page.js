"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to home since login is disabled
        router.replace('/');
    }, [router]);

    return null;
}
