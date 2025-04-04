
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, PlayCircle, FileText, FileQuestion, Clock, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Mock current user and course data
const currentUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Operator',
  department: 'Production',
};

const courseData = {
  id: '1',
  name: 'Food Safety Basics',
  description: 'Essential training on food safety principles and practices for all employees.',
  modules: [
    {
      id: 'mod1',
      title: 'Introduction to Food Safety',
      type: 'video',
      duration: '15 min',
      completed: true
    },
    {
      id: 'mod2',
      title: 'Personal Hygiene',
      type: 'reading',
      duration: '10 min',
      completed: true
    },
    {
      id: 'mod3',
      title: 'Cross-Contamination Prevention',
      type: 'video',
      duration: '20 min',
      completed: false
    },
    {
      id: 'mod4',
      title: 'Temperature Control',
      type: 'reading',
      duration: '15 min',
      completed: false
    },
    {
      id: 'mod5',
      title: 'Final Assessment',
      type: 'quiz',
      duration: '30 min',
      completed: false
    }
  ],
  progress: 40,
  questions: [
    {
      id: 'q1',
      question: 'What is the temperature danger zone for food?',
      options: [
        '0°F to 32°F',
        '32°F to 70°F',
        '41°F to 135°F',
        '150°F to 212°F'
      ],
      correctAnswer: 2
    },
    {
      id: 'q2',
      question: 'Which of the following is NOT a common source of cross-contamination?',
      options: [
        'Cutting boards',
        'Hands',
        'Refrigerated foods',
        'Utensils'
      ],
      correctAnswer: 2
    },
    {
      id: 'q3',
      question: 'How often should you wash your hands during food preparation?',
      options: [
        'Only before starting work',
        'Once every hour',
        'After touching raw meat, before touching ready-to-eat foods',
        'Only after using the restroom'
      ],
      correctAnswer: 2
    }
  ]
};

// Helper components
const ModuleIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'video':
      return <PlayCircle className="h-5 w-5 text-blue-500" />;
    case 'reading':
      return <FileText className="h-5 w-5 text-green-500" />;
    case 'quiz':
      return <FileQuestion className="h-5 w-5 text-amber-500" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const CourseDelivery = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuizDialog, setShowQuizDialog] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState<boolean | null>(null);
  const [additionalResourcesNeeded, setAdditionalResourcesNeeded] = useState(false);
  
  const { toast } = useToast();

  const completedModules = courseData.modules.filter(m => m.completed).length;
  const totalModules = courseData.modules.length;
  const progress = (completedModules / totalModules) * 100;

  const startModule = (index: number) => {
    setCurrentModuleIndex(index);
    
    // If it's a quiz module, open the quiz dialog
    if (courseData.modules[index].type === 'quiz') {
      setShowQuizDialog(true);
      setQuizAnswers(new Array(courseData.questions.length).fill(-1));
      setQuizSubmitted(false);
      setQuizPassed(null);
    }
    
    // Mark as in progress
    toast({
      title: "Module Started",
      description: `You've started: ${courseData.modules[index].title}`,
    });
  };

  const completeModule = (index: number) => {
    // Mark the module as completed
    const updatedModules = [...courseData.modules];
    updatedModules[index].completed = true;
    
    // Show toast notification
    toast({
      title: "Module Completed",
      description: `You've completed: ${courseData.modules[index].title}`,
    });
    
    // If all modules are complete, show completion message
    if (updatedModules.every(m => m.completed)) {
      toast({
        title: "Course Completed",
        description: "Congratulations! You've completed all modules in this course.",
        variant: "success",
      });
    }
  };

  const handleQuizAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    // Check if all questions are answered
    if (quizAnswers.some(answer => answer === -1)) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate score
    const correctAnswers = quizAnswers.reduce((count, answer, index) => {
      return answer === courseData.questions[index].correctAnswer ? count + 1 : count;
    }, 0);
    
    const score = (correctAnswers / courseData.questions.length) * 100;
    const passed = score >= 70; // Pass threshold is 70%
    
    setQuizSubmitted(true);
    setQuizPassed(passed);
    
    if (passed) {
      toast({
        title: "Quiz Passed",
        description: `Congratulations! You scored ${score.toFixed(0)}%`,
      });
      
      // Mark the quiz module as completed
      completeModule(courseData.modules.findIndex(m => m.type === 'quiz'));
    } else {
      toast({
        title: "Quiz Failed",
        description: `You scored ${score.toFixed(0)}%. 70% required to pass.`,
        variant: "destructive",
      });
      setAdditionalResourcesNeeded(true);
    }
  };

  const retakeQuiz = () => {
    setQuizAnswers(new Array(courseData.questions.length).fill(-1));
    setQuizSubmitted(false);
    setQuizPassed(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{courseData.name}</h2>
          <p className="text-muted-foreground">{courseData.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {completedModules} of {totalModules} modules completed
          </div>
          <Progress value={progress} className="w-24" />
        </div>
      </div>

      {additionalResourcesNeeded && (
        <Alert className="bg-blue-50 border-blue-200">
          <BookOpen className="h-4 w-4 text-blue-600" />
          <AlertTitle>Additional Resources Available</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p>We've provided additional study materials to help you pass the assessment.</p>
            <Button variant="outline" className="self-start" onClick={() => setAdditionalResourcesNeeded(false)}>
              View Resources
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Course Modules</CardTitle>
            <CardDescription>
              Work through each module in sequence
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {courseData.modules.map((module, index) => (
                <div 
                  key={module.id}
                  className={`
                    flex items-center justify-between p-2 rounded-md cursor-pointer
                    ${currentModuleIndex === index ? 'bg-muted' : 'hover:bg-muted/50'}
                    ${module.completed ? 'border-l-4 border-green-500 pl-2' : ''}
                  `}
                  onClick={() => startModule(index)}
                >
                  <div className="flex items-center gap-3">
                    <ModuleIcon type={module.type} />
                    <div>
                      <div className="font-medium text-sm">{module.title}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {module.duration}
                      </div>
                    </div>
                  </div>
                  <div>
                    {module.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Badge variant="outline" className="text-xs">
                        {index === 0 || courseData.modules[index - 1].completed ? 'Available' : 'Locked'}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {courseData.modules[currentModuleIndex].title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <ModuleIcon type={courseData.modules[currentModuleIndex].type} />
                  <span className="capitalize">{courseData.modules[currentModuleIndex].type}</span>
                  <span className="mx-1">•</span>
                  <Clock className="h-3 w-3 mr-1" />
                  {courseData.modules[currentModuleIndex].duration}
                </CardDescription>
              </div>
              {courseData.modules[currentModuleIndex].type === 'quiz' && (
                <Button onClick={() => setShowQuizDialog(true)}>
                  Start Assessment
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="min-h-[300px] p-4">
                {courseData.modules[currentModuleIndex].type === 'video' && (
                  <div className="aspect-video bg-muted rounded-md flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-primary/70" />
                    <span className="ml-2 text-muted-foreground">Video content would play here</span>
                  </div>
                )}
                {courseData.modules[currentModuleIndex].type === 'reading' && (
                  <div className="prose max-w-none">
                    <h3>Module Content</h3>
                    <p>
                      This is where the reading content for this module would appear. In a real implementation, 
                      this would contain all the relevant information for the learner to study.
                    </p>
                    <p>
                      The content could include text, images, formatted content, and links to additional resources.
                    </p>
                    <h4>Key Points</h4>
                    <ul>
                      <li>Important concept #1</li>
                      <li>Important concept #2</li>
                      <li>Important concept #3</li>
                    </ul>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="discussion" className="min-h-[300px] p-4">
                <div className="text-center p-6 text-muted-foreground">
                  <p>Discussion forum would appear here.</p>
                </div>
              </TabsContent>
              <TabsContent value="resources" className="min-h-[300px] p-4">
                <div className="text-center p-6 text-muted-foreground">
                  <p>Additional learning resources would appear here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline"
              disabled={currentModuleIndex === 0}
              onClick={() => startModule(currentModuleIndex - 1)}
            >
              Previous Module
            </Button>
            <Button 
              onClick={() => {
                if (courseData.modules[currentModuleIndex].type !== 'quiz') {
                  completeModule(currentModuleIndex);
                  
                  // Move to next module if available
                  if (currentModuleIndex < courseData.modules.length - 1) {
                    startModule(currentModuleIndex + 1);
                  }
                } else {
                  setShowQuizDialog(true);
                }
              }}
            >
              {courseData.modules[currentModuleIndex].type === 'quiz' 
                ? 'Take Assessment' 
                : courseData.modules[currentModuleIndex].completed 
                  ? 'Already Completed' 
                  : 'Mark as Complete'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Quiz Dialog */}
      <Dialog open={showQuizDialog} onOpenChange={setShowQuizDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Course Assessment</DialogTitle>
            <DialogDescription>
              Complete this assessment to finish the course. You need 70% to pass.
            </DialogDescription>
          </DialogHeader>
          
          {quizSubmitted ? (
            <div className="py-4 space-y-6">
              <Alert variant={quizPassed ? "default" : "destructive"} className={quizPassed ? "bg-green-50 border-green-200" : ""}>
                {quizPassed ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>{quizPassed ? "Assessment Passed" : "Assessment Failed"}</AlertTitle>
                <AlertDescription>
                  {quizPassed 
                    ? "Congratulations! You've successfully completed this assessment." 
                    : "You didn't achieve the minimum passing score. You can review the material and try again."}
                </AlertDescription>
              </Alert>
              
              <div className="space-y-4">
                {courseData.questions.map((question, questionIndex) => (
                  <div key={question.id} className="border rounded-md p-4">
                    <div className="font-medium mb-2">{question.question}</div>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = quizAnswers[questionIndex] === optionIndex;
                        const isCorrect = question.correctAnswer === optionIndex;
                        
                        return (
                          <div 
                            key={optionIndex}
                            className={`
                              p-2 rounded-md flex items-center
                              ${isSelected 
                                ? isCorrect 
                                  ? 'bg-green-50 border border-green-200' 
                                  : 'bg-red-50 border border-red-200'
                                : isCorrect
                                  ? 'bg-green-50 border border-green-200'
                                  : 'bg-gray-50 border border-gray-200'
                              }
                            `}
                          >
                            {isCorrect ? (
                              <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            ) : isSelected ? (
                              <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                            ) : (
                              <div className="w-4 h-4 mr-2"></div>
                            )}
                            <span>
                              {option}
                              {isCorrect && " (Correct Answer)"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-4 space-y-6">
              {courseData.questions.map((question, questionIndex) => (
                <div key={question.id} className="space-y-3">
                  <div className="font-medium">{questionIndex + 1}. {question.question}</div>
                  <div className="space-y-2 ml-6">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`
                          p-2 rounded-md cursor-pointer flex items-center
                          ${quizAnswers[questionIndex] === optionIndex 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'hover:bg-muted border border-transparent hover:border-muted-foreground/20'}
                        `}
                        onClick={() => handleQuizAnswer(questionIndex, optionIndex)}
                      >
                        <div className={`
                          w-4 h-4 rounded-full mr-2 border 
                          ${quizAnswers[questionIndex] === optionIndex 
                            ? 'border-primary bg-primary' 
                            : 'border-muted-foreground'}
                        `}>
                          {quizAnswers[questionIndex] === optionIndex && (
                            <div className="h-2 w-2 rounded-full bg-white m-auto mt-0.5"></div>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            {quizSubmitted ? (
              <div className="flex w-full justify-between">
                <Button variant="outline" onClick={() => setShowQuizDialog(false)}>
                  Close
                </Button>
                {!quizPassed && (
                  <Button onClick={retakeQuiz}>
                    Retake Assessment
                  </Button>
                )}
              </div>
            ) : (
              <Button onClick={submitQuiz}>
                Submit Answers
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDelivery;
