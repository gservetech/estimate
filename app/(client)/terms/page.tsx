'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function TermsPage() {
  return (
    <div className="main-content bg-light min-h-screen">
    
    

      <main className="container mx-auto px-4 py-8 space-y-10">
        {/* Section Component Reused */}
        <Section
          title="Affiliate Disclaimer"
          content={[
            'Our website participates in affiliate marketing programs, which means we may earn commissions on purchases made through our links to retailer sites. We only promote products and services that we believe will add value to our visitors. However, we are not responsible for the content or accuracy of any third-party websites linked from our site.',
          ]}
          disclaimer="Affiliates are responsible for ensuring their promotional activities comply with all applicable laws and regulations. By participating in our affiliate program, you agree to adhere to these guidelines and understand that any breach may result in termination of your affiliate status."
        />

        <Section
          title="Online Store Terms and Conditions"
          subsections={[
            {
              heading: '1. Introduction',
              text: 'These terms and conditions govern your use of our website and the purchase of products from our online store.',
            },
            {
              heading: '2. Order Process',
              text: 'All orders are subject to acceptance and availability. Once you place an order, you will receive an email confirmation.',
            },
            {
              heading: '3. Pricing and Payment',
              text: 'We accept various payment methods, including credit cards and PayPal.',
            },
            {
              heading: '4. Shipping and Delivery',
              text: 'Delivery times may vary depending on your location.',
            },
            {
              heading: '5. Returns and Refunds',
              text: 'You may return within 15 days for a refund or exchange.',
            },
            {
              heading: '6. Intellectual Property',
              text: 'All content is the property of GServeTech.',
            },
            {
              heading: '7. Limitation of Liability',
              text: 'We are not liable for indirect, incidental, or consequential damages.',
            },
            {
              heading: '9. Changes to Terms',
              text: 'We reserve the right to modify these terms and conditions at any time.',
            },
          ]}
          disclaimer="By using our website and purchasing our products, you agree to these terms and conditions. If you do not agree, please do not use our website."
        />

        <Section
          title="General Conditions"
          subsections={[
            {
              heading: '1. Acceptance of Terms',
              text: 'By accessing and using our website, you agree to comply with these conditions.',
            },
            {
              heading: '2. Use of Website',
              text: 'Use our website for lawful purposes only.',
            },
            {
              heading: '3. Account Registration',
              text: 'You may be required to register an account.',
            },
            {
              heading: '4. Privacy Policy',
              text: 'Please review our Privacy Policy.',
            },
            {
              heading: '5. Intellectual Property',
              text: 'All content is owned by [Your Company Name].',
            },
            {
              heading: '6. Limitation of Liability',
              text: 'We are not liable for indirect damages.',
            },
            {
              heading: '7. Governing Law',
              text: 'These conditions are governed by the laws of [Your Country/State].',
            },
            {
              heading: '8. Changes to Terms',
              text: 'We reserve the right to update terms.',
            },
          ]}
          disclaimer="By using our website, you agree to these general conditions."
        />

        {/* Additional sections can be added similarly */}
      </main>

      <footer className="bg-dark text-white py-10 mt-12">
        <div className="container mx-auto text-center">
          <p className="mb-2">© 2025 GServeTech. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <Link href="/PrivacyPolicy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Use
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Section Component
interface SectionProps {
  title: string;
  content?: string[];
  subsections?: { heading: string; text: string }[];
  disclaimer?: string;
}

function Section({ title, content, subsections, disclaimer }: SectionProps) {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg border border-blue-200 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        {title}
      </h1>
      {content &&
        content.map((p, i) => (
          <p key={i} className="text-gray-600 mb-3">
            {p}
          </p>
        ))}
      {subsections &&
        subsections.map((sub, i) => (
          <div key={i} className="mb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-1">
              {sub.heading}
            </h2>
            <p className="text-gray-600">{sub.text}</p>
          </div>
        ))}
      {disclaimer && (
        <p className="italic text-sm text-gray-500 border-t pt-4 mt-4">
          Disclaimer: {disclaimer}
        </p>
      )}
    </div>
  );
}
