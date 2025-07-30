
import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-700">Privacy Policy</h1>
      </div>
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl max-w-3xl mx-auto prose prose-lg prose-slate">
        <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>

        <h2 className="!text-3xl !font-semibold !text-teal-600">1. Information We Collect</h2>
        <p>
          We are committed to protecting your privacy. OmniToolz does not collect any personally identifiable information (PII) from its users. 
          When you use our tools, all processing is typically done client-side within your browser, or if server interaction is required for a specific tool, 
          it's done so anonymously without storing personal data.
        </p>
        <p>
          We may collect anonymous usage data to help us improve our services. This data includes information such as which tools are most popular, 
          how they are used, error occurrences, and general website traffic statistics (e.g., page views, browser type, operating system). 
          This information is aggregated and cannot be used to identify individual users.
        </p>
        
        <h2 className="!text-3xl !font-semibold !text-teal-600">2. How We Use Information</h2>
        <p>
          Any anonymous information we collect is used solely for the purpose of improving the functionality, user experience, and performance 
          of our website and tools. We analyze these trends to understand user needs better, optimize our offerings, and ensure our services 
          remain relevant and effective. We do not sell, trade, or otherwise transfer your information to outside parties.
        </p>
        
        <h2 className="!text-3xl !font-semibold !text-teal-600">3. Cookies</h2>
        <p>
          We may use cookies to enhance your experience and for analytical purposes. Cookies are small files that a site or its service provider 
          transfers to your computer's hard drive through your Web browser (if you allow) that enables the site's or service provider's systems 
          to recognize your browser and capture and remember certain information. For instance, we may use cookies to help us understand your 
          preferences based on previous or current site activity, which enables us to provide you with improved services.
        </p>
        <p>
          You can choose to disable cookies through your browser settings. However, please note that if you disable cookies, some features of the 
          Site may not function properly.
        </p>

        <h2 className="!text-3xl !font-semibold !text-teal-600">4. Third-Party Services</h2>
        <p>
          Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have 
          separate and independent privacy policies. We, therefore, have no responsibility or liability for the content and activities of these 
          linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.
        </p>

        <h2 className="!text-3xl !font-semibold !text-teal-600">5. Changes to Our Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. 
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are 
          posted on this page.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;
