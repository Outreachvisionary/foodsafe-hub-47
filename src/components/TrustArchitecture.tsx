
import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ClientLogoProps {
  name: string;
  logoUrl: string;
  category: string;
}

const ClientLogo: React.FC<ClientLogoProps> = ({ name, logoUrl, category }) => (
  <div className="flex flex-col items-center">
    <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center p-2 mb-2">
      <img src={logoUrl} alt={`${name} logo`} className="max-w-full max-h-full object-contain" />
    </div>
    <p className="text-sm font-medium text-gray-800">{name}</p>
    <p className="text-xs text-gray-500">{category}</p>
  </div>
);

const ComplianceBadge: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition duration-300 cursor-help flex items-center gap-2">
          <div className="p-1.5 bg-fsms-lightBlue rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fsms-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <span className="text-sm font-medium">{title}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const TrustArchitecture = () => {
  const clientLogos: ClientLogoProps[] = [
    { name: "Prime Protein", logoUrl: "/placeholder.svg", category: "Meat/Poultry" },
    { name: "Vitaline Dairy", logoUrl: "/placeholder.svg", category: "Dairy" },
    { name: "Golden Harvest", logoUrl: "/placeholder.svg", category: "Bakery" },
    { name: "Fresh Selections", logoUrl: "/placeholder.svg", category: "Ready-to-Eat" },
    { name: "Nature's Best", logoUrl: "/placeholder.svg", category: "Organic" },
    { name: "Global Foods", logoUrl: "/placeholder.svg", category: "Import/Export" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-fsms-dark">Trusted by 250+ Food Facilities</h2>
        </motion.div>

        {/* Client Logo Carousel */}
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
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {clientLogos.map((client, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/6 flex justify-center py-4">
                  <ClientLogo name={client.name} logoUrl={client.logoUrl} category={client.category} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              <CarouselPrevious className="relative static transform-none mr-2" />
              <CarouselNext className="relative static transform-none ml-2" />
            </div>
          </Carousel>
        </motion.div>

        {/* Compliance Badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ComplianceBadge 
            title="ISO 22000:2025 Certified" 
            description="Our platform meets all requirements of the latest ISO 22000:2025 food safety management systems standard." 
          />
          <ComplianceBadge 
            title="FDA 21 CFR Part 117 Compliant" 
            description="Fully compliant with FDA's current Good Manufacturing Practice and Hazard Analysis requirements." 
          />
          <ComplianceBadge 
            title="HACCP Alliance Partner" 
            description="Official partner of the HACCP Alliance, ensuring best practices in hazard analysis and critical control points." 
          />
        </motion.div>

        {/* Media Mentions */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">Featured in</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-gray-400 font-semibold text-xl">Food Safety Magazine</div>
            <div className="text-gray-300 font-bold text-2xl">&times;</div>
            <div className="text-gray-400 font-semibold text-xl">IFT</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustArchitecture;
