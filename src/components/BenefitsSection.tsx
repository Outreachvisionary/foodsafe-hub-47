
import React from 'react';
import { CheckCircle, Clock, FileText, AlertTriangle, BarChart3, Users } from 'lucide-react';

const benefits = [
  {
    title: 'Simplified Compliance',
    description: 'Streamline compliance with multiple food safety standards through a single unified platform.',
    icon: <CheckCircle className="h-8 w-8 text-fsms-blue" />
  },
  {
    title: 'Real-time Monitoring',
    description: 'Monitor critical control points and receive instant alerts when parameters deviate from set limits.',
    icon: <Clock className="h-8 w-8 text-fsms-blue" />
  },
  {
    title: 'Document Management',
    description: 'Centralized repository for all your policies, procedures, and records with version control.',
    icon: <FileText className="h-8 w-8 text-fsms-blue" />
  },
  {
    title: 'Risk Mitigation',
    description: 'Identify and address potential hazards before they become critical issues with proactive risk assessment.',
    icon: <AlertTriangle className="h-8 w-8 text-fsms-blue" />
  },
  {
    title: 'Data-Driven Insights',
    description: 'Turn compliance data into actionable insights with comprehensive analytics and reporting.',
    icon: <BarChart3 className="h-8 w-8 text-fsms-blue" />
  },
  {
    title: 'Team Collaboration',
    description: 'Enable seamless collaboration across departments with role-based access and task assignments.',
    icon: <Users className="h-8 w-8 text-fsms-blue" />
  }
];

const BenefitsSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="page-container">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue">
            Key Benefits
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-fsms-dark">
            Why Choose FoodSafeHub
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides powerful tools that simplify food safety compliance while enhancing operational efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {benefits.map((benefit, index) => (
            <div 
              key={benefit.title} 
              className="flex flex-col items-start animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-semibold text-fsms-dark mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
