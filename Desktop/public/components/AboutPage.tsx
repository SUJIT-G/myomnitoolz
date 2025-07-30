
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-700">About Us</h1>
      </div>
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl max-w-3xl mx-auto">
        <section className="mb-8">
          <h2 className="text-3xl font-semibold text-teal-600 mb-4">Our Mission</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            At OmniToolz, our mission is to empower individuals and businesses by providing a versatile and reliable set of online tools that are both powerful and easy to use. We believe that everyone should have access to the resources they need to succeed, which is why we offer our entire suite of tools for free.
          </p>
        </section>
        <section>
          <h2 className="text-3xl font-semibold text-teal-600 mb-4">Who We Are</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            We are a passionate team of developers, designers, and innovators dedicated to creating solutions that make a tangible difference in people's daily tasks and long-term goals. We are constantly working to improve our existing tools and develop new ones to meet the evolving needs of our users, ensuring OmniToolz remains your go-to resource.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
