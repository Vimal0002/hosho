'use client';

import dynamic from 'next/dynamic';

const AboutPageContent = dynamic(() => import('./content'), {
  ssr: false,
});

export default function AboutPage() {
  return <AboutPageContent />;
}
