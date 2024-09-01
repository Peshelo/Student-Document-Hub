"use client";

import Link from 'next/link';

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
        <p className="text-lg text-gray-600">Effective Date: August 31, 2024</p>
      </header>

      <section className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
        <p className="text-gray-700 mb-4">
          Welcome to our Student Resource Sharing Application. These Terms and Conditions outline the rules and regulations for using our platform. By accessing or using our services, you agree to comply with and be bound by these terms. If you disagree with any part of these terms, you should discontinue use of our services immediately.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. User Responsibilities</h2>
        <p className="text-gray-700 mb-4">
          As a user of our platform, you are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to use our services only for lawful purposes and in accordance with these terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Content Submission</h2>
        <p className="text-gray-700 mb-4">
          Users may upload, share, and view resources on our platform. By submitting content, you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, display, and distribute such content. You are responsible for ensuring that the content you submit does not infringe upon any third-party rights.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          Your privacy is important to us. We collect and use personal information in accordance with our Privacy Policy. Please review our Privacy Policy to understand how we handle your information.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Termination</h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to terminate or suspend your account and access to our services at our discretion, without prior notice, for any violation of these terms or for any other reason deemed necessary.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Limitation of Liability</h2>
        <p className="text-gray-700 mb-4">
          Our liability to you is limited to the maximum extent permitted by law. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Changes to Terms</h2>
        <p className="text-gray-700 mb-4">
          We reserve the right to update these Terms and Conditions at any time. We will notify you of any changes by posting the updated terms on our website. Your continued use of our services after such changes constitutes acceptance of the revised terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Contact Us</h2>
        <p className="text-gray-700 mb-4">
          If you have any questions or concerns regarding these Terms and Conditions, please contact us at <Link href="mailto:support@example.com" className="text-blue-500">support@example.com</Link>.
        </p>
      </section>
    </main>
  );
}
