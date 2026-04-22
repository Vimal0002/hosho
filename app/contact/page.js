'use client';

import dynamic from 'next/dynamic';

const ContactPageContent = dynamic(() => import('./content'), {
  ssr: false,
});

export default function ContactPage() {
  return <ContactPageContent />;
}
