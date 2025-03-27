
import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "Compliance Core has revolutionized how we manage food safety documentation. The automation and real-time monitoring capabilities have cut our compliance management time in half.",
      name: "Sarah Johnson",
      title: "Quality Assurance Director",
      company: "Premium Foods Inc.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "The multi-facility management features allow us to maintain consistent standards across all our production sites while still accounting for site-specific requirements.",
      name: "Michael Chen",
      title: "VP of Operations",
      company: "Global Nutrition Group",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    },
    {
      quote: "Our audit preparation time has been reduced by over 80%. What used to take weeks now takes days, with far more thorough and accurate results.",
      name: "Elena Rodriguez",
      title: "Food Safety Manager",
      company: "Artisan Bakeries Co.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
            Industry leaders trust Compliance Core for their food safety management.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-cc-white p-6 rounded-lg shadow-md border-l-4 border-cc-purple"
            >
              <div className="mb-4 text-cc-purple">
                <Quote className="h-8 w-8 transform rotate-180" />
              </div>
              
              <p className="text-cc-charcoal/90 mb-6 font-sans">
                "{testimonial.quote}"
              </p>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-cc-charcoal">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-cc-purple font-sans">
                    {testimonial.title}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
