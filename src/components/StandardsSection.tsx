
import React from 'react';
import StandardCard from './StandardCard';
import { Shield, FileCheck, ClipboardCheck, LineChart, Award, ShieldAlert } from 'lucide-react';

const standardsData = [
  {
    title: 'SQF Compliance',
    description: 'Safe Quality Food certification with comprehensive tools for food safety and quality management.',
    icon: <Shield className="h-6 w-6" />,
    href: '/standards/sqf'
  },
  {
    title: 'ISO 22000 Compliance',
    description: 'International standard for food safety management systems applicable to all organizations in the food chain.',
    icon: <FileCheck className="h-6 w-6" />,
    href: '/standards/iso22000'
  },
  {
    title: 'FSSC 22000 Compliance',
    description: 'Food Safety System Certification based on ISO 22000 with additional requirements for prerequisite programs.',
    icon: <ClipboardCheck className="h-6 w-6" />,
    href: '/standards/fssc22000'
  },
  {
    title: 'HACCP Compliance',
    description: 'Hazard Analysis Critical Control Point system for preventive approach to food safety.',
    icon: <LineChart className="h-6 w-6" />,
    href: '/standards/haccp'
  },
  {
    title: 'BRC GS2 Compliance',
    description: 'Global Standard for Food Safety with a comprehensive approach to supply chain management and quality.',
    icon: <Award className="h-6 w-6" />,
    href: '/standards/brcgs2'
  }
];

const StandardsSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-gray-50">
      <div className="page-container">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue">
            Global Standards
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-fsms-dark">
            Comprehensive Compliance Solutions
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from multiple global food safety standards, all managed through a single unified platform.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/audits" className="text-fsms-blue hover:text-fsms-indigo font-medium inline-flex items-center gap-1 transition-colors">
              <ClipboardCheck className="h-4 w-4" />
              <span>View our Internal Audits & Inspections Module</span>
            </a>
            <a href="/haccp" className="text-fsms-blue hover:text-fsms-indigo font-medium inline-flex items-center gap-1 transition-colors">
              <ShieldAlert className="h-4 w-4" />
              <span>Explore our new HACCP & Risk Assessment Module</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {standardsData.map((standard, index) => (
            <StandardCard 
              key={standard.title}
              title={standard.title}
              description={standard.description}
              icon={standard.icon}
              href={standard.href}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StandardsSection;
