import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, FileText, Activity, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
const PlatformPreview = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const modules = [{
    id: 'audit',
    name: 'Audit Management',
    icon: ClipboardCheck,
    description: 'Streamline audit preparation with intelligent checklists and automated evidence collection.',
    image: 'https://images.unsplash.com/photo-1564069114553-7215e1ff1890?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }, {
    id: 'document',
    name: 'Document Control',
    icon: FileText,
    description: 'Centralize all compliance documentation with version control and approval workflows.',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }, {
    id: 'risk',
    name: 'Risk Assessment',
    icon: Activity,
    description: 'Identify and mitigate food safety risks with AI-powered analysis and monitoring.',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }, {
    id: 'dashboard',
    name: 'Reporting Dashboard',
    icon: BarChart2,
    description: 'Access real-time compliance metrics and generate comprehensive reports.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
  }];
  return <section className="py-16 md:py-24 bg-cc-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-cc-charcoal mb-4">
            Platform Preview
          </h2>
          <p className="text-xl text-cc-charcoal/80 max-w-3xl mx-auto font-sans">
            Explore the key modules of Compliance Core that streamline food safety management.
          </p>
        </div>
        
        <Tabs defaultValue="audit" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-cc-white border border-cc-purple/20">
              {modules.map(module => <TabsTrigger key={module.id} value={module.id} className={`flex items-center gap-2 px-4 py-2 ${activeTab === module.id ? 'bg-cc-purple text-white' : 'text-cc-charcoal'}`}>
                  <module.icon className="h-4 w-4" />
                  <span className="hidden md:inline">{module.name}</span>
                </TabsTrigger>)}
            </TabsList>
          </div>
          
          {modules.map(module => <TabsContent key={module.id} value={module.id}>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <motion.div initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.5
            }} className="md:w-2/3">
                  <div className="rounded-lg overflow-hidden shadow-xl border-2 border-cc-purple/10">
                    <img src={module.image} alt={`${module.name} preview`} className="w-full h-auto" />
                  </div>
                </motion.div>
                
                <motion.div initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="md:w-1/3">
                  <div className="bg-cc-white p-6 rounded-lg shadow-md">
                    <div className="w-12 h-12 bg-cc-gold10 rounded-lg flex items-center justify-center mb-4 text-cc-gold">
                      <module.icon className="h-6 w-6" />
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-cc-charcoal mb-3">
                      {module.name}
                    </h3>
                    
                    <p className="text-cc-charcoal/80 mb-4 font-sans">
                      {module.description}
                    </p>
                    
                    <Button className="bg-cc-purple hover:bg-cc-purple/90 text-white font-sans bg-brand-teal">
                      Learn more
                    </Button>
                  </div>
                </motion.div>
              </div>
            </TabsContent>)}
        </Tabs>
      </div>
    </section>;
};
export default PlatformPreview;