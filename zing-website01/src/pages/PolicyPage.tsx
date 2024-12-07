import React from "react";
import { motion } from "framer-motion";

const policies = [
  {
    title: "Privacy Policy",
    content: `
    **Your privacy is important to us. This policy outlines how we collect, use, and protect your data.**

    **1. Data Collection**
    - We collect information to provide better services, including account details and usage data.

    **2. Data Usage**
    - Your data is used to improve our services and ensure a seamless user experience.

    **3. Data Protection**
    - We implement security measures to protect your personal data from unauthorized access.

    **4. Contact Information**
    - If you have any concerns, please contact us at shahil@zingmarketingmastery.com.
    `,
  },
  {
    title: "Refund Policy",
    content: `
    **At Zing, we strive to provide seamless service. Please read our refund policy carefully.**

    **1. Non-Refundable Payments**
    - All payments made through the PayHere gateway are non-refundable, except for cases of technical or billing errors.

    **2. Refund Process**
    - In the event of technical errors, refunds will be issued back to the original payment method within 7-10 business days upon approval.

    **3. Payment Disputes**
    - For any disputes, contact Zing Support within 7 days of the transaction.

    **4. Assistance**
    - For assistance, email us at shahil@zingmarketingmastery.com.
    `,
  },
  {
    title: "Terms and Conditions",
    content: `
    **Welcome to Zing! These Terms govern your use of our platform. By using our services, you agree to these Terms.**
    
    **1. Subscription and Payment**
    - Payments are processed via PayHere.
    - Access is granted for 30 days upon payment.
    - No refunds are provided except for technical errors.
    - Refunds will be processed within 7-10 business days to the original payment method.

    **2. Prohibited Activities**
    - Posting misleading or harmful content.
    - Attempting to hack or disrupt the platform.

    **3. Contact Information**
    - For any queries, email us at shahil@zingmarketingmastery.com.
    `,
  },
];

const PolicyPage: React.FC = () => {
  return (
    <motion.div
      className="max-w-5xl mx-auto p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center">Policies</h1>
      <p className="text-gray-600 text-center">
        Learn more about our policies, including privacy, refund, and terms and conditions.
      </p>

      {policies.map((policy, index) => (
        <motion.div
          key={index}
          className="border rounded-lg shadow-md p-4 bg-white hover:shadow-lg transition duration-300"
          whileHover={{ scale: 1.03 }}
        >
          <h2 className="text-2xl font-semibold text-blue-600">{policy.title}</h2>
          <p className="text-gray-700 mt-2 whitespace-pre-line">{policy.content}</p>
        </motion.div>
      ))}

      <motion.div
        className="text-center mt-6"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        <a
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Back to Home
        </a>
      </motion.div>
    </motion.div>
  );
};

export default PolicyPage;