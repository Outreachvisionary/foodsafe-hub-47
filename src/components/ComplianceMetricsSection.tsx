
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ShieldAlert, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for compliance metrics
const industryData = [
  { name: 'Food & Beverage', compliance: 78 },
  { name: 'Dairy', compliance: 92 },
  { name: 'Meat & Poultry', compliance: 83 },
  { name: 'Bakery', compliance: 75 },
  { name: 'Produce', compliance: 81 },
];

const recallData = [
  { name: 'Pathogen', value: 35 },
  { name: 'Allergen', value: 28 },
  { name: 'Foreign Material', value: 21 },
  { name: 'Undeclared Ingredient', value: 16 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ComplianceMetricsSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="page-container">
        <div className="text-center mb-16">
          <motion.span 
            className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-fsms-lightBlue text-fsms-blue"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Industry Insights
          </motion.span>
          <motion.h2 
            className="mt-4 text-3xl md:text-4xl font-bold text-fsms-dark"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Food Safety Analytics
          </motion.h2>
          <motion.p 
            className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Make data-driven decisions with industry-specific compliance metrics and benchmarks.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-fsms-blue" />
                  Industry Compliance Benchmark
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={industryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Compliance Rate']}
                        labelStyle={{ color: '#4A6CF7' }}
                        contentStyle={{ border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                      <Bar dataKey="compliance" fill="#4A6CF7" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <ShieldAlert className="mr-2 h-5 w-5 text-fsms-blue" />
                  Recall Root Causes
                </h3>
                <div className="h-[300px] flex items-center justify-center">
                  <PieChart width={250} height={250}>
                    <Pie
                      data={recallData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {recallData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <MetricCard 
            title="Average Compliance Rate"
            value="87%"
            trend="+3%"
            icon={<CheckCircle className="h-8 w-8 text-green-500" />}
            delay={0.4}
          />
          <MetricCard 
            title="Avg. Recall Response Time"
            value="9.3 hrs"
            trend="-12%"
            icon={<Clock className="h-8 w-8 text-blue-500" />}
            delay={0.5}
          />
          <MetricCard 
            title="CCP Failure Rate"
            value="1.2%"
            trend="-0.5%"
            icon={<AlertCircle className="h-8 w-8 text-amber-500" />}
            delay={0.6}
          />
          <MetricCard 
            title="Audit Success Rate"
            value="93%"
            trend="+5%"
            icon={<ShieldAlert className="h-8 w-8 text-purple-500" />}
            delay={0.7}
          />
        </div>
      </div>
    </section>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  delay?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, delay = 0 }) => {
  const isPositive = trend.startsWith('+');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      <Card className="h-full shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <p className="text-2xl font-bold mt-1">{value}</p>
              <p className={`text-xs mt-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {trend} from last year
              </p>
            </div>
            <div className="p-3 rounded-full bg-gray-100">
              {icon}
            </div>
          </div>
          <Progress value={75} className="h-1 mt-4" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ComplianceMetricsSection;
