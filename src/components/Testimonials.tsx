
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "FoodSafeSync has reduced our audit preparation time by 70% and helped us maintain perfect compliance scores across all 8 of our production facilities.",
      author: "Sarah Johnson",
      title: "VP of Quality Assurance",
      company: "Premium Foods International",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "The platform's ability to manage multiple compliance standards simultaneously has been a game-changer for our multi-state operations.",
      author: "Michael Rodriguez",
      title: "Director of Food Safety",
      company: "Global Protein Solutions",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    },
    {
      quote: "We've seen a 35% reduction in non-conformances since implementing FoodSafeSync across our dairy processing facilities.",
      author: "Jennifer Chen",
      title: "Chief Compliance Officer",
      company: "Pure Dairy Cooperative",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-lightGray relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-teal/5 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-brand-teal/5 blur-3xl rounded-full"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-brand-teal font-medium">CLIENT TESTIMONIALS</span>
          <h2 className="text-3xl md:text-4xl font-bold text-brand-darkGray mt-2">
            Trusted by industry leaders
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-brand-teal">★</span>
                      ))}
                    </div>
                    
                    <blockquote className="text-brand-darkGray/80 mb-6 flex-grow">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center mt-auto">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.author}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-brand-darkGray">{testimonial.author}</div>
                        <div className="text-sm text-brand-darkGray/70">{testimonial.title}</div>
                        <div className="text-sm font-medium text-brand-teal">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
