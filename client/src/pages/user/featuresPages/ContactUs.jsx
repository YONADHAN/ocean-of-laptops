import React from 'react';
import { PhoneIcon, ChatBubbleOvalLeftIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-blue-600">
      {/* Hero Section */}
      <div className="relative px-6 lg:px-8 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-3 text-lg text-slate-200">
            Want to get in touch? We'd love to hear from you. Here's how you can reach us...
          </p>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="relative -mt-8 px-6 lg:px-8 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sales Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-slate-100 rounded-full">
                  <PhoneIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-blue-900">
                  Talk to Sales
                </h2>
                <p className="mt-3 text-blue-500">
                  Interested in HubSpot's software? Just pick up the phone to chat with a member of our sales team.
                </p>
                <a
                  href="tel:+18578295060"
                  className="mt-4 text-xl font-medium text-teal-600 hover:text-teal-700"
                >
                  +1 857 829 5060
                </a>
                <button
                  className="mt-4 text-teal-600 hover:text-teal-700 flex items-center gap-1"
                  onClick={() => {/* Handle view numbers click */}}
                >
                  View all global numbers
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-slate-100 rounded-full">
                  <ChatBubbleOvalLeftIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-blue-900">
                  Contact Customer Support
                </h2>
                <p className="mt-3 text-blue-500">
                  Sometimes you need a little help from your friends. Or a HubSpot support rep. Don't worry... we're here for you.
                </p>
                <button
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
                  onClick={() => {/* Handle support click */}}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

