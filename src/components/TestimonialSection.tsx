
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

const TestimonialSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[#F5F5F5]"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzBoLTZWNmg2djI0em0tNiAwSDBWNmgzMHpNNiAwSDBoNnY2SDB6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>
        {/* Gold accent */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-[#D4AF37]/10 blur-3xl rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <Card className="shadow-lg border-0 overflow-hidden bg-white">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 w-20 h-20 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="CEO Portrait" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <blockquote className="font-playfair text-2xl text-[#1A2B3C] italic mb-6">
                  "This platform transformed our compliance processes. We've reduced audit preparation time by 60% and improved our overall compliance score by 25 points."
                </blockquote>
                
                <cite className="not-italic">
                  <div className="font-bold text-[#1A2B3C]">Jonathan Reynolds</div>
                  <div className="text-gray-600">CEO, Premium Foods International</div>
                </cite>
                
                <div className="mt-8 flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
                    alt="Premium Foods International" 
                    className="h-6 object-contain grayscale opacity-70"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialSection;
