
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
  result: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, company, result }) => (
  <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
    <div className="flex items-center mb-4">
      {Array(5).fill(0).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </svg>
      ))}
    </div>
    <p className="text-gray-700 mb-6 italic">&ldquo;{quote}&rdquo;</p>
    <div className="mb-4">
      <div className="font-semibold text-fsms-dark">{author}</div>
      <div className="text-sm text-gray-500">{company}</div>
    </div>
    <div className="bg-fsms-lightBlue text-fsms-blue text-sm font-medium px-4 py-2 rounded-lg inline-block">
      {result}
    </div>
  </div>
);

const IndustrySocialProof = () => {
  const testimonials: TestimonialProps[] = [
    {
      quote: "Cut audit prep time by 65% across our 12 meat processing plants.",
      author: "James Wilson",
      company: "Major Protein Co.",
      result: "65% faster audit prep"
    },
    {
      quote: "Achieved 100% FDA compliance for 3 consecutive years with this platform.",
      author: "Sarah Chen",
      company: "Frozen Meal Manufacturer",
      result: "100% FDA compliance for 3 years"
    },
    {
      quote: "SOPs that took weeks to create and approve now take just days. Game changer!",
      author: "Robert Garcia",
      company: "Premium Dairy Products",
      result: "75% faster SOP approvals"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-fsms-dark">
            Trusted by Food Safety Professionals
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            See the real results our customers are achieving
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                  <Testimonial
                    quote={testimonial.quote}
                    author={testimonial.author}
                    company={testimonial.company}
                    result={testimonial.result}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-6">
              <CarouselPrevious className="relative static transform-none mr-2" />
              <CarouselNext className="relative static transform-none ml-2" />
            </div>
          </Carousel>
        </motion.div>

        {/* Case Study */}
        <motion.div
          className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="bg-fsms-blue text-white p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">Case Study: Success Story</h3>
              <h4 className="text-xl font-medium mb-6">How Premium Dairy Co. Reduced Non-Conformances by 42%</h4>
              <p className="mb-6">Learn how one of North America's largest dairy processors streamlined their food safety program across 8 facilities.</p>
              <Button className="bg-white text-fsms-blue hover:bg-white/90 w-fit">
                Read Case Study
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="p-8 bg-gray-50">
              <div className="mb-6">
                <p className="text-lg font-medium text-fsms-dark">Key Results:</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-fsms-lightBlue p-1 rounded-full mr-3 mt-1">
                    <svg className="w-4 h-4 text-fsms-blue" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700">42% reduction in quality non-conformances</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-fsms-lightBlue p-1 rounded-full mr-3 mt-1">
                    <svg className="w-4 h-4 text-fsms-blue" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700">3.5x faster response time to audit findings</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-fsms-lightBlue p-1 rounded-full mr-3 mt-1">
                    <svg className="w-4 h-4 text-fsms-blue" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700">68% less time spent on document management</p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-fsms-lightBlue p-1 rounded-full mr-3 mt-1">
                    <svg className="w-4 h-4 text-fsms-blue" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <p className="text-gray-700">ROI achieved within the first 6 months</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default IndustrySocialProof;
