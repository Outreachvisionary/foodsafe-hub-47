
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, AlertTriangle, Check, HelpCircle, BarChart, Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

// Types for simulated data
type SPCDataPoint = {
  sampleId: number;
  value: number;
  subgroupMean?: number;
  subgroupRange?: number;
  upperControlLimit?: number;
  lowerControlLimit?: number;
  centerLine?: number;
};

const SPCSimulation: React.FC = () => {
  // State for control parameters
  const [mean, setMean] = useState<number>(100);
  const [variation, setVariation] = useState<number>(10);
  const [sampleSize, setSampleSize] = useState<number>(5);
  const [subgroupCount, setSubgroupCount] = useState<number>(25);
  const [specialCause, setSpecialCause] = useState<string>("none");
  const [activeTab, setActiveTab] = useState<string>("playground");
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [exerciseStatus, setExerciseStatus] = useState<"pending" | "correct" | "incorrect">("pending");

  // Generate simulated data based on user parameters
  const simulatedData = useMemo(() => {
    const data: SPCDataPoint[] = [];
    let currentMean = mean;
    
    for (let i = 0; i < subgroupCount; i++) {
      // Apply special cause variation based on selection
      if (specialCause === "trend" && i > subgroupCount / 2) {
        currentMean += 2; // Upward trend
      } else if (specialCause === "shift" && i > subgroupCount / 2) {
        currentMean += 15; // Step change
      } else if (specialCause === "cycle" && i > 0) {
        currentMean = mean + Math.sin(i / 3) * 10; // Cyclical pattern
      }

      // Generate subgroup data
      const subgroupValues: number[] = [];
      for (let j = 0; j < sampleSize; j++) {
        // Generate random value with normal-like distribution
        const randomValue = currentMean + (Math.random() + Math.random() + Math.random() - 1.5) * variation;
        subgroupValues.push(Math.round(randomValue * 10) / 10);
      }

      // Calculate subgroup statistics
      const subgroupMean = subgroupValues.reduce((sum, val) => sum + val, 0) / sampleSize;
      const subgroupRange = Math.max(...subgroupValues) - Math.min(...subgroupValues);
      
      // Add to dataset
      data.push({
        sampleId: i + 1,
        value: subgroupMean,
        subgroupMean,
        subgroupRange,
      });
    }

    // Calculate control limits
    const overallMean = data.reduce((sum, point) => sum + point.subgroupMean!, 0) / data.length;
    const avgRange = data.reduce((sum, point) => sum + point.subgroupRange!, 0) / data.length;
    
    // Constants for X-bar and R charts (based on sample size)
    const a2 = getSPCConstant('A2', sampleSize);
    const d3 = getSPCConstant('D3', sampleSize);
    const d4 = getSPCConstant('D4', sampleSize);
    
    // Calculate and set control limits
    return data.map(point => ({
      ...point,
      centerLine: overallMean,
      upperControlLimit: overallMean + a2 * avgRange,
      lowerControlLimit: overallMean - a2 * avgRange
    }));
  }, [mean, variation, sampleSize, subgroupCount, specialCause]);

  // Function to check rule violations in the chart
  const checkRuleViolations = () => {
    // Implementing Western Electric Rules
    
    // Rule 1: Points outside control limits
    const pointsOutsideControlLimits = simulatedData.some(
      point => point.value! > point.upperControlLimit! || point.value! < point.lowerControlLimit!
    );
    
    // Rule 2: Run of 8 consecutive points on one side of the center line
    let longestRun = 0;
    let currentRun = 0;
    let previousSide = null;
    
    for (const point of simulatedData) {
      const side = point.value! > point.centerLine! ? 'above' : 'below';
      
      if (previousSide === side) {
        currentRun++;
      } else {
        currentRun = 1;
        previousSide = side;
      }
      
      longestRun = Math.max(longestRun, currentRun);
    }
    
    const runRule = longestRun >= 8;
    
    // Rule 3: Trend of 6 consecutive points increasing or decreasing
    let longestTrend = 1;
    let currentTrend = 1;
    let previousDirection = null;
    
    for (let i = 1; i < simulatedData.length; i++) {
      const direction = simulatedData[i].value! > simulatedData[i-1].value! ? 'up' : 'down';
      
      if (previousDirection === direction) {
        currentTrend++;
      } else {
        currentTrend = 1;
        previousDirection = direction;
      }
      
      longestTrend = Math.max(longestTrend, currentTrend);
    }
    
    const trendRule = longestTrend >= 6;
    
    // Return which rules were violated
    return {
      pointsOutsideControlLimits,
      runRule,
      trendRule,
      anyViolation: pointsOutsideControlLimits || runRule || trendRule
    };
  };

  // Calculate correct answer for exercise
  const calculateCorrectAnswer = () => {
    const avgRange = simulatedData.reduce((sum, point) => sum + point.subgroupRange!, 0) / simulatedData.length;
    const overallMean = simulatedData.reduce((sum, point) => sum + point.subgroupMean!, 0) / simulatedData.length;
    const a2 = getSPCConstant('A2', sampleSize);
    
    // Round to 2 decimal places for comparison
    return Math.round((overallMean + a2 * avgRange) * 100) / 100;
  };

  // Check user's answer for exercise
  const checkAnswer = () => {
    const correctAnswer = calculateCorrectAnswer();
    const userNumericAnswer = parseFloat(userAnswer);
    
    if (isNaN(userNumericAnswer)) {
      toast({
        title: "Invalid Answer",
        description: "Please enter a valid number",
        variant: "destructive"
      });
      return;
    }
    
    // Allow for small rounding differences
    const isCorrect = Math.abs(userNumericAnswer - correctAnswer) < 0.1;
    
    if (isCorrect) {
      setExerciseStatus("correct");
      toast({
        title: "Correct!",
        description: `The UCL is ${correctAnswer}. Good job!`,
        variant: "default"
      });
    } else {
      setExerciseStatus("incorrect");
      toast({
        title: "Not quite right",
        description: "Try again. Remember UCL = X̄ + A₂R̄",
        variant: "destructive"
      });
    }
  };

  // Reset exercise
  const resetExercise = () => {
    setUserAnswer("");
    setExerciseStatus("pending");
  };

  // Check for rule violations and show alerts
  const violations = checkRuleViolations();
  
  // Identify the current scenario for teaching purposes
  const currentScenario = useMemo(() => {
    if (specialCause === "none") return "Stable Process";
    if (specialCause === "trend") return "Gradual Change (Drift)";
    if (specialCause === "shift") return "Sudden Shift (Step Change)";
    if (specialCause === "cycle") return "Cyclical Pattern";
    return "";
  }, [specialCause]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-xl font-bold">
              <BarChart2 className="mr-2 h-6 w-6 text-blue-600" />
              SPC Interactive Simulation
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 px-3">
              Hands-on Tutorial
            </Badge>
          </div>
          <CardDescription>
            Learn Statistical Process Control concepts through interactive charts and exercises
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="playground">
                <BarChart2 className="mr-2 h-4 w-4" />
                Chart Playground
              </TabsTrigger>
              <TabsTrigger value="scenarios">
                <Activity className="mr-2 h-4 w-4" />
                Process Scenarios
              </TabsTrigger>
              <TabsTrigger value="exercises">
                <HelpCircle className="mr-2 h-4 w-4" />
                Practice Exercises
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="playground" className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Mean (Target Value)</label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        min={50} 
                        max={150} 
                        step={1} 
                        value={[mean]} 
                        onValueChange={(value) => setMean(value[0])} 
                      />
                      <span className="w-12 text-center">{mean}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Variation</label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        min={1} 
                        max={30} 
                        step={1} 
                        value={[variation]} 
                        onValueChange={(value) => setVariation(value[0])} 
                      />
                      <span className="w-12 text-center">{variation}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sample Size (n)</label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        min={2} 
                        max={10} 
                        step={1} 
                        value={[sampleSize]} 
                        onValueChange={(value) => setSampleSize(value[0])} 
                      />
                      <span className="w-12 text-center">{sampleSize}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Subgroups</label>
                    <div className="flex items-center gap-4">
                      <Slider 
                        min={10} 
                        max={50} 
                        step={1} 
                        value={[subgroupCount]} 
                        onValueChange={(value) => setSubgroupCount(value[0])} 
                      />
                      <span className="w-12 text-center">{subgroupCount}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={() => {
                        // Reset to default values
                        setMean(100);
                        setVariation(10);
                        setSampleSize(5);
                        setSubgroupCount(25);
                        setSpecialCause("none");
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Reset Parameters
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">X-bar Chart</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={simulatedData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sampleId" label={{ value: 'Subgroup', position: 'insideBottom', offset: -5 }} />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip 
                          formatter={(value: any) => [`${value}`, 'Value']}
                          labelFormatter={(label) => `Subgroup ${label}`}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2563eb" 
                          activeDot={{ r: 8 }} 
                          name="Subgroup Mean"
                        />
                        <ReferenceLine 
                          y={simulatedData[0]?.centerLine} 
                          stroke="green" 
                          strokeDasharray="3 3" 
                          label={{ value: 'CL', position: 'right' }} 
                        />
                        <ReferenceLine 
                          y={simulatedData[0]?.upperControlLimit} 
                          stroke="red" 
                          strokeDasharray="3 3" 
                          label={{ value: 'UCL', position: 'right' }} 
                        />
                        <ReferenceLine 
                          y={simulatedData[0]?.lowerControlLimit} 
                          stroke="red" 
                          strokeDasharray="3 3" 
                          label={{ value: 'LCL', position: 'right' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {violations.anyViolation && (
                    <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Control Chart Rule Violations:</h4>
                          <ul className="mt-1 text-sm text-amber-700 list-disc list-inside">
                            {violations.pointsOutsideControlLimits && 
                              <li>Points outside control limits</li>
                            }
                            {violations.runRule && 
                              <li>8 or more consecutive points on one side of the center line</li>
                            }
                            {violations.trendRule && 
                              <li>6 or more consecutive points trending up or down</li>
                            }
                          </ul>
                          <p className="mt-1 text-sm text-amber-700">
                            These violations indicate <strong>special cause variation</strong>. 
                            The process is not stable and predictable.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="scenarios" className="mt-4 space-y-4">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Process Scenario Simulation</h3>
                <p className="text-muted-foreground">
                  Select a scenario to simulate common process behaviors and practice identifying special cause variation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Select value={specialCause} onValueChange={setSpecialCause}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Stable Process (Common Cause Only)</SelectItem>
                      <SelectItem value="trend">Gradual Change/Drift (e.g., Tool Wear)</SelectItem>
                      <SelectItem value="shift">Sudden Shift (e.g., Material Change)</SelectItem>
                      <SelectItem value="cycle">Cyclical Pattern (e.g., Temperature Cycle)</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h4 className="font-medium">Current Scenario: {currentScenario}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {specialCause === "none" && "A process with only random variation within control limits. All points should stay within control limits with no patterns."}
                      {specialCause === "trend" && "A process showing a gradual change over time, often caused by tool wear, equipment deterioration, or environmental drift."}
                      {specialCause === "shift" && "A process with a sudden change in the average, often caused by a new batch of material, shift change, or equipment adjustment."}
                      {specialCause === "cycle" && "A process showing a repeating pattern, often caused by rotation of operators, maintenance cycles, or environmental factors."}
                    </p>
                    
                    <div className="mt-4">
                      <h5 className="text-sm font-medium">Recommended Action:</h5>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {specialCause === "none" && "Continue operation. Process is stable and predictable."}
                        {specialCause === "trend" && "Investigate gradual changes. Check for tool wear, aging materials, or environmental drift."}
                        {specialCause === "shift" && "Investigate what changed at the halfway point. Check materials, methods, operators, or machine settings."}
                        {specialCause === "cycle" && "Look for cyclical factors. Check for rotating operators, environmental cycles, or maintenance schedules."}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={simulatedData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="sampleId" label={{ value: 'Subgroup', position: 'insideBottom', offset: -5 }} />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#2563eb" 
                          activeDot={{ r: 8 }} 
                          name="Subgroup Mean"
                        />
                        <ReferenceLine 
                          y={simulatedData[0]?.centerLine} 
                          stroke="green" 
                          strokeDasharray="3 3" 
                          label={{ value: 'CL', position: 'right' }} 
                        />
                        <ReferenceLine 
                          y={simulatedData[0]?.upperControlLimit} 
                          stroke="red" 
                          strokeDasharray="3 3" 
                          label={{ value: 'UCL', position: 'right' }} 
                        />
                        <ReferenceLine 
                          y={simulatedData[0]?.lowerControlLimit} 
                          stroke="red" 
                          strokeDasharray="3 3" 
                          label={{ value: 'LCL', position: 'right' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <Button
                    className="mt-4 w-full"
                    onClick={() => {
                      if (violations.anyViolation) {
                        toast({
                          title: "Special Cause Detected",
                          description: "Good job! This scenario contains special cause variation that requires investigation.",
                        });
                      } else {
                        toast({
                          title: "Process is in Control",
                          description: "This process shows only common cause variation. No special action required."
                        });
                      }
                    }}
                  >
                    Analyze This Chart
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="exercises" className="mt-4 space-y-4">
              <div className="mb-4">
                <h3 className="font-medium mb-2">Practice Exercises</h3>
                <p className="text-muted-foreground">
                  Test your understanding of SPC concepts with these practice exercises.
                </p>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Exercise: Calculate UCL</CardTitle>
                  <CardDescription>
                    For the X-bar chart below, calculate the Upper Control Limit (UCL) using the formula: UCL = X̄ + A₂R̄
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={simulatedData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="sampleId" />
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#2563eb" 
                              name="Subgroup Mean"
                            />
                            <ReferenceLine 
                              y={simulatedData[0]?.centerLine} 
                              stroke="green" 
                              strokeDasharray="3 3" 
                              label={{ value: 'CL', position: 'right' }} 
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium">Process Data:</h4>
                          <ul className="mt-1 text-sm list-disc list-inside">
                            <li>Sample size (n): {sampleSize}</li>
                            <li>Number of subgroups: {subgroupCount}</li>
                            <li>Overall mean (X̄): {simulatedData[0]?.centerLine?.toFixed(2)}</li>
                            <li>A₂ factor: {getSPCConstant('A2', sampleSize)}</li>
                            <li>Average range (R̄): {(simulatedData.reduce((sum, point) => sum + point.subgroupRange!, 0) / simulatedData.length).toFixed(2)}</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">Reminder:</h4>
                          <p className="mt-1 text-sm">The formula for UCL is:</p>
                          <p className="mt-1 font-medium">UCL = X̄ + A₂ × R̄</p>
                          <p className="mt-2 text-sm text-muted-foreground">Round your answer to 2 decimal places.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Your Answer (UCL):</label>
                        <div className="flex mt-2">
                          <Input 
                            type="number" 
                            step="0.01"
                            value={userAnswer} 
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Calculate UCL..."
                            disabled={exerciseStatus !== "pending"}
                          />
                        </div>
                      </div>
                      
                      {exerciseStatus === "pending" ? (
                        <Button onClick={checkAnswer} className="w-full">
                          Submit Answer
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className={`p-3 rounded-md ${
                            exerciseStatus === "correct" 
                              ? "bg-green-50 border border-green-200" 
                              : "bg-red-50 border border-red-200"
                          }`}>
                            <div className="flex">
                              {exerciseStatus === "correct" ? (
                                <Check className="h-5 w-5 text-green-600 mr-2" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                              )}
                              <div>
                                <h4 className={`font-medium ${
                                  exerciseStatus === "correct" ? "text-green-800" : "text-red-800"
                                }`}>
                                  {exerciseStatus === "correct" ? "Correct!" : "Not quite right"}
                                </h4>
                                <p className={`text-sm ${
                                  exerciseStatus === "correct" ? "text-green-700" : "text-red-700"
                                }`}>
                                  {exerciseStatus === "correct"
                                    ? `The UCL is ${calculateCorrectAnswer()}. Good job!`
                                    : "Try again. Remember UCL = X̄ + A₂R̄"
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <Button onClick={resetExercise} variant="outline" className="w-full">
                            Try Another Example
                          </Button>
                        </div>
                      )}
                      
                      <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                        <h4 className="font-medium text-blue-800">Learning Tip:</h4>
                        <p className="mt-1 text-sm text-blue-700">
                          Control limits are calculated from the data itself, not from specifications.
                          They tell us what the process is actually doing, not what we want it to do.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <div className="text-sm text-muted-foreground">
            These simulations help build practical understanding of Statistical Process Control concepts.
            Complete all exercises to earn points toward SPC certification.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// Utility function to get SPC constants based on sample size
function getSPCConstant(constant: 'A2' | 'D3' | 'D4', sampleSize: number): number {
  const constants: Record<string, Record<number, number>> = {
    'A2': {
      2: 1.880, 3: 1.023, 4: 0.729, 5: 0.577, 
      6: 0.483, 7: 0.419, 8: 0.373, 9: 0.337, 10: 0.308
    },
    'D3': {
      2: 0, 3: 0, 4: 0, 5: 0, 
      6: 0, 7: 0.076, 8: 0.136, 9: 0.184, 10: 0.223
    },
    'D4': {
      2: 3.267, 3: 2.575, 4: 2.282, 5: 2.115, 
      6: 2.004, 7: 1.924, 8: 1.864, 9: 1.816, 10: 1.777
    }
  };
  
  return constants[constant][Math.min(Math.max(sampleSize, 2), 10)] || 0;
}

export default SPCSimulation;
