
import React from 'react';
import { cn } from '@/lib/utils';

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  company: string;
  className?: string;
};

const Testimonial = ({ quote, author, role, company, className }: TestimonialProps) => {
  return (
    <div className={cn("bg-white rounded-xl p-8 shadow-sm border border-gray-100", className)}>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
        ))}
      </div>
      <p className="text-gray-700 mb-6 italic">&ldquo;{quote}&rdquo;</p>
      <div>
        <div className="font-semibold text-fsms-dark">{author}</div>
        <div className="text-sm text-gray-500">{role}, {company}</div>
      </div>
    </div>
  );
};

const testimonials = [
  {
    quote: "FoodSafeHub has revolutionized how we manage our food safety protocols. What used to take days now takes minutes, and our audit readiness has never been better.",
    author: "Sarah Johnson",
    role: "Quality Assurance Manager",
    company: "Fresh Eats Co."
  },
  {
    quote: "The multi-standard compliance feature is a game-changer. We used to juggle three different systems, but now everything is in one place with clear visibility across all requirements.",
    author: "Michael Chen",
    role: "Food Safety Director",
    company: "Global Foods Inc."
  },
  {
    quote: "After implementing FoodSafeHub, we passed our SQF audit with zero non-conformances for the first time ever. The automated monitoring and documentation tools are exceptional.",
    author: "Jessica Rodriguez",
    role: "Operations Manager",
    company: "Artisan Bakeries Ltd."
  }
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="page-container">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue">
            Success Stories
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-fsms-dark">
            Trusted by Food Safety Professionals
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            See how FoodSafeHub has helped businesses like yours simplify compliance and improve food safety.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              company={testimonial.company}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
