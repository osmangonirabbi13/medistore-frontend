import React from "react";

const AboutPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            About <span className="text-blue-600">Medi Store</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your trusted online pharmacy platform delivering genuine medicines
            and healthcare products with safety, reliability, and convenience.
          </p>
        </div>

        {/* Vision Section */}
        <div className="bg-white shadow-md rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🌍 Our Vision
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We believe healthcare should be accessible to everyone. Our vision
            is to build a digital healthcare ecosystem where verified pharmacies
            and customers connect safely, ensuring authentic medicines and
            transparent services at all times.
          </p>
        </div>

        {/* What We Do Section */}
        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-white shadow-md rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              💊 What We Do
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li>✔️ Browse and purchase verified medicines</li>
              <li>✔️ Enable pharmacies to sell products securely</li>
              <li>✔️ Role-based dashboards (Admin, Seller, Customer)</li>
              <li>✔️ Secure authentication & order management</li>
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              👨‍⚕️ Our Team
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We are passionate developers and healthcare advocates committed
              to building a trustworthy digital pharmacy system. Our goal is to
              combine technology and care to make healthcare more accessible.
            </p>
          </div>

        </div>

        {/* Contact Section */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-10">
          <h2 className="text-2xl font-semibold mb-4">📞 Contact Us</h2>
          <p className="mb-2">
            Have questions or partnership ideas?
          </p>
          <p className="font-medium">
            📧 contact@medistore.com
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
