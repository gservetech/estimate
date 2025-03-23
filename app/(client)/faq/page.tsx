"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function FaqsPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      

      {/* FAQ Content */}
      <section className="bg-white shadow-md rounded-lg max-w-3xl mx-auto my-8 p-6">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-700">
          Find Your Answers Here
        </h2>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className={`w-full text-left px-5 py-4 font-semibold text-lg transition-colors ${
                  activeIndex === index ? "bg-blue-100" : "bg-gray-50"
                }`}
                onClick={() => toggleAccordion(index)}
              >
                {faq.question}
              </button>
              {activeIndex === index && (
                <div className="px-5 py-3 bg-white text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      
    </div>
  );
}

// FAQ content
const faqData = [
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards including Visa, MasterCard, American Express, as well as PayPal and Apple Pay.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Shipping times vary depending on your location and the product. Typically, domestic shipping takes 3-7 business days. International orders may take 10-15 business days.",
  },
  {
    question: "Can I track my order?",
    answer:
      "Yes, once your order is shipped, we will provide a tracking number via email. You can use it to track your package in real-time.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You may return items within 15 days of delivery. Items must be in their original packaging and unused. Please contact our support team to initiate a return.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach our customer support via email at info@gservetech.com or call us at (416) 635-0502. Our support hours are Monday to Friday, 9 AM to 6 PM EST.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. Shipping fees and delivery times may vary based on destination.",
  },
  {
    question: "Is it safe to shop on your website?",
    answer:
      "Absolutely. We use SSL encryption and partner with trusted payment processors to ensure your data is safe and secure.",
  },
  {
    question: "Do I need an account to place an order?",
    answer:
      "No, you can checkout as a guest. However, creating an account allows you to track orders, save preferences, and manage returns easily.",
  },
  {
    question: "What should I do if I received a damaged item?",
    answer:
      "Please contact us within 48 hours of receiving your order. Provide your order number and photos of the damaged item so we can assist you promptly.",
  },
];
