
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-700">Terms of Use</h1>
      </div>
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl max-w-3xl mx-auto prose prose-lg prose-slate">
        <h2 className="!text-3xl !font-semibold !text-teal-600">1. Acceptance of Terms</h2>
        <p>
          By accessing and using OmniToolz (the "Site"), you accept and agree to be bound by the terms and provision of this agreement. 
          If you do not agree to abide by these terms, please do not use this Site. We reserve the right to change these terms at any time, 
          and you agree (including by virtue of your continued use of our site) to be bound by any such changes.
        </p>
        
        <h2 className="!text-3xl !font-semibold !text-teal-600">2. Use of Tools</h2>
        <p>
          The tools provided on OmniToolz are for your personal and commercial use, subject to these terms. You agree not to use the tools 
          for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction 
          (including but not limited to copyright or trademark laws). You are responsible for all activity that occurs under your usage.
        </p>
        
        <h2 className="!text-3xl !font-semibold !text-teal-600">3. Disclaimer of Warranty</h2>
        <p>
          The tools and services on this website are provided "as is" without any guarantees or warranty. While we strive to provide accurate 
          and reliable tools, we make no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of any information 
          or tool provided. We are not liable for any damages or losses, direct or indirect, resulting from the use of our tools or information 
          found on the Site.
        </p>

        <h2 className="!text-3xl !font-semibold !text-teal-600">4. Limitation of Liability</h2>
        <p>
          In no event shall OmniToolz, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
          incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
          intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content 
          of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your 
          transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we 
          have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;
