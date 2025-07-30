
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-700">About OmniToolz</h1>
      </div>
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl max-w-3xl mx-auto prose prose-lg prose-slate">
        <h2 className="!text-3xl !font-semibold !text-teal-600">Our Vision</h2>
        <p>
          At OmniToolz, we envision a world where powerful digital tools are accessible to everyone,
          helping to simplify complexities and unlock creativity. We aim to be your trusted partner
          by providing a comprehensive suite of reliable and easy-to-use online utilities.
        </p>
        
        <h2 className="!text-3xl !font-semibold !text-teal-600">What We Offer</h2>
        <p>
          OmniToolz is a curated collection of tools designed to cater to a wide range of needs –
          from fitness and health tracking to SEO optimization and image editing. Each tool is
          crafted with attention to detail, focusing on user experience and practical functionality.
          Whether you're a professional looking to enhance your workflow or an individual seeking
          to manage daily tasks more efficiently, OmniToolz has something for you.
        </p>
        
        <h2 className="!text-3xl !font-semibold !text-teal-600">Our Commitment</h2>
        <p>
          We are committed to continuous improvement and innovation. Our team is dedicated to
          expanding our toolset, enhancing existing features, and ensuring that OmniToolz remains
          a cutting-edge resource. We value user feedback and strive to create a platform
          that evolves with the needs of our community. All our tools are offered for free,
          embodying our belief in accessible technology.
        </p>

        <h2 className="!text-3xl !font-semibold !text-teal-600">Get in Touch</h2>
        <p>
          While we don't have a formal contact page yet, we're always open to hearing from our users.
          Your suggestions and feedback help us grow and improve.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
