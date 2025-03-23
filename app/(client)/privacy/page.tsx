'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Page Title */}
      <section className="bg-blue-100 py-6 text-center">
        <h1 className="text-2xl font-bold text-blue-800">Privacy Policy</h1>
      </section>

      {/* Policy Content */}
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
          <p>
            At GServeTech, we take your privacy seriously. This policy explains how we collect,
            use, and protect your personal information when you visit our website or use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Personal details such as name, email, phone number, and address</li>
            <li>Payment information when you place orders</li>
            <li>Usage data including IP address, browser type, and pages visited</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
          <p>Your data may be used to:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Process and fulfill your orders</li>
            <li>Send updates or promotional emails (with your consent)</li>
            <li>Improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal data to third parties. We may share it with
            trusted partners who assist us in operating our website or servicing you, under
            confidentiality agreements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">5. Data Security</h2>
          <p>
            We implement industry-standard security measures including SSL encryption to protect
            your data. However, no transmission over the internet is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Request access to the data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw consent for data processing at any time</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
          <p>
            If you have any questions or concerns about our privacy policy, feel free to contact us:
          </p>
          <ul className="mt-2 space-y-1">
            <li>
              📧 Email:{' '}
              <a
                href="mailto:info@gservetech.com"
                className="text-blue-600 hover:underline"
              >
                info@gservetech.com
              </a>
            </li>
            <li>
              📞 Phone:{' '}
              <a
                href="tel:+14166350502"
                className="text-blue-600 hover:underline"
              >
                (416) 635-0502
              </a>
            </li>
            <li>
              🌐 Website:{' '}
              <Link
                href="https://www.gservetech.com"
                className="text-blue-600 hover:underline"
              >
                www.gservetech.com
              </Link>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
