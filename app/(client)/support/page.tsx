'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
     

      {/* Page Header */}
      <section className="bg-blue-100 py-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-blue-800">Support Center</h1>
        </div>
      </section>

      {/* Support Content */}
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <p className="text-lg text-gray-700 mb-6">
          At GServeTech, we are committed to delivering excellent customer service.
          Whether you have a question about your order, need help with a product,
          or just want to reach out — we’re here to help. Our support team is available
          Monday to Friday, from 9:00 AM to 6:00 PM EST.
        </p>

        <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-lg text-gray-800">📍 Website</h2>
            <Link
              href="https://www.gservetech.com"
              className="text-blue-600 hover:underline"
            >
              https://www.gservetech.com
            </Link>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-800">📞 Phone</h2>
            <a href="tel:+14166350502" className="text-blue-600 hover:underline">
              (416) 635-0502
            </a>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-800">📧 Email</h2>
            <a
              href="mailto:info@gservetech.com"
              className="text-blue-600 hover:underline"
            >
              info@gservetech.com
            </a>
          </div>
        </div>
      </main>

      
    </div>
  );
}
