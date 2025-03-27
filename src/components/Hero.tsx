
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, CheckCircle, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import ReactPlayer from 'react-player/lazy';

const Hero = () => {
  const navigate = useNavigate();

  const handleDemoLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: 'demo@example.com',
        password: 'demopassword123'
      });
      
      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -right-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-fsms-blue/10 to-fsms-indigo/10 blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-fsms-indigo/10 to-fsms-blue/10 blur-3xl" />
        <motion.div 
          className="absolute right-0 top-1/3 w-64 h-64 bg-gradient-to-br from-fsms-blue/5 to-fsms-indigo/5 rounded-full blur-xl"
          animate={{ 
            x: [0, 30, 0], 
            y: [0, -30, 0],
            scale: [1, 1.1, 1] 
          }} 
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "mirror" 
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <motion.div 
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue">
                Industry-Leading Food Safety Management
              </span>
            </motion.div>
            
            <motion.h1 
              className="mt-6 text-4xl md:text-5xl lg:text-6xl font-display font-bold text-fsms-dark leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              FDA/ISO-Compliant Food Safety Management in <span className="text-gradient">3 Clicks</span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Automate HACCP, FSMS, and Audit Tracking for Multi-Facility Food Operations
            </motion.p>
            
            <motion.div 
              className="mt-8 space-y-4 sm:space-y-0 sm:inline-grid sm:grid-flow-row sm:grid-cols-2 sm:gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/auth?mode=register" className="w-full">
                <Button 
                  className="w-full sm:w-auto bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white px-8 py-6 text-lg"
                  size="lg"
                >
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                variant="outline"
                className="w-full sm:w-auto px-8 py-6 text-lg border-[#2196F3] text-[#2196F3]"
                size="lg"
                onClick={() => document.getElementById('demo-video')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Platform Demo
              </Button>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="mr-2 h-4 w-4 text-[#4CAF50]" />
                <span>AI-powered compliance</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="mr-2 h-4 w-4 text-[#4CAF50]" />
                <span>Real-time audit dashboard</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle className="mr-2 h-4 w-4 text-[#4CAF50]" />
                <span>Multi-language certificates</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <div id="demo-video" className="aspect-video rounded-xl overflow-hidden glass-panel shadow-xl bg-gradient-to-br from-fsms-blue/5 to-fsms-indigo/10">
              <ReactPlayer
                url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" // Replace with your actual demo video URL
                width="100%"
                height="100%"
                controls={true}
                light={true}
                playIcon={
                  <div className="play-icon-wrapper absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                    <div className="play-button flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg">
                      <Play className="h-6 w-6 text-fsms-blue ml-1" />
                    </div>
                  </div>
                }
              />
            </div>
            
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg text-sm font-medium text-gray-700 whitespace-nowrap">
              30-second platform overview
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
