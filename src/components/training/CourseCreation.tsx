
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Pencil, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CourseCreation = () => {
  const [activeTab, setActiveTab] = useState('content');
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [durationHours, setDurationHours] = useState('1');
  const [content, setContent] = useState('');
  const [questions, setQuestions] = useState<{ question: string; options: string[]; correctAnswer: number }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [meetsStandards, setMeetsStandards] = useState(false);
  
  const { toast } = useToast();

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentOptions];
    newOptions[index] = value;
    setCurrentOptions(newOptions);
  };

  const addQuestion = () => {
    if (!currentQuestion.trim()) {
      toast({
        title: "Validation Error",
        description: "Question text is required",
        variant: "destructive",
      });
      return;
    }

    if (currentOptions.some(option => !option.trim())) {
      toast({
        title: "Validation Error",
        description: "All options must be filled out",
        variant: "destructive",
      });
      return;
    }

    const newQuestion = {
      question: currentQuestion,
      options: currentOptions,
      correctAnswer: correctAnswer,
    };

    setQuestions([...questions, newQuestion]);
    setCurrentQuestion('');
    setCurrentOptions(['', '', '', '']);
    setCorrectAnswer(0);

    toast({
      title: "Question Added",
      description: "Question has been added to the quiz",
    });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const saveCourse = () => {
    if (!courseName.trim()) {
      toast({
        title: "Validation Error",
        description: "Course name is required",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "Validation Error",
        description: "Course content is required",
        variant: "destructive",
      });
      return;
    }

    // Check if course meets regulatory standards
    const hasEnoughQuestions = questions.length >= 3;
    const hasComprehensiveContent = content.length > 200;
    
    setMeetsStandards(hasEnoughQuestions && hasComprehensiveContent);

    toast({
      title: hasEnoughQuestions && hasComprehensiveContent ? "Course Saved" : "Warning",
      description: hasEnoughQuestions && hasComprehensiveContent
        ? "Course has been saved successfully"
        : "Course may not meet regulatory standards. Please review content and questions.",
      variant: hasEnoughQuestions && hasComprehensiveContent ? "default" : "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Course Creation</h2>
          <p className="text-muted-foreground">Create and edit training course content and assessments</p>
        </div>
        <Button onClick={saveCourse}>
          <Save className="mr-2 h-4 w-4" />
          Save Course
        </Button>
      </div>

      {meetsStandards === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Regulatory Standards Not Met</AlertTitle>
          <AlertDescription>
            This course doesn't meet regulatory standards. Please ensure:
            <ul className="list-disc pl-5 mt-2">
              <li>Course has at least 3 assessment questions</li>
              <li>Content is comprehensive (minimum 200 characters)</li>
              <li>All required topics are covered</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {meetsStandards === true && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle>Meets Regulatory Standards</AlertTitle>
          <AlertDescription>
            This course meets all regulatory standards and is ready for approval.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Basic information about the course</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input 
                id="courseName" 
                value={courseName} 
                onChange={(e) => setCourseName(e.target.value)} 
                placeholder="Enter course name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseDescription">Description</Label>
              <Textarea 
                id="courseDescription" 
                value={courseDescription} 
                onChange={(e) => setCourseDescription(e.target.value)} 
                placeholder="Enter course description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseCategory">Category</Label>
                <Select value={courseCategory} onValueChange={setCourseCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food-safety">Food Safety</SelectItem>
                    <SelectItem value="haccp">HACCP</SelectItem>
                    <SelectItem value="gmp">GMP</SelectItem>
                    <SelectItem value="regulatory">Regulatory</SelectItem>
                    <SelectItem value="quality">Quality Systems</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input 
                  id="duration" 
                  value={durationHours} 
                  onChange={(e) => setDurationHours(e.target.value)} 
                  type="number" 
                  min="0.5" 
                  step="0.5" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Course Content & Assessment</CardTitle>
            <CardDescription>Develop course materials and quiz questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseContent">Course Content</Label>
                    <Textarea 
                      id="courseContent" 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      placeholder="Enter course content, instructions, and learning materials"
                      className="min-h-[300px]"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="assessment" className="mt-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Add New Question</Label>
                    <div className="space-y-2">
                      <Input 
                        value={currentQuestion} 
                        onChange={(e) => setCurrentQuestion(e.target.value)} 
                        placeholder="Enter question text" 
                      />
                    </div>
                    <div className="space-y-3">
                      <Label>Answer Options</Label>
                      {currentOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input 
                            value={option} 
                            onChange={(e) => handleOptionChange(index, e.target.value)} 
                            placeholder={`Option ${index + 1}`} 
                          />
                          <Button 
                            type="button" 
                            variant={correctAnswer === index ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCorrectAnswer(index)}
                          >
                            Correct
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button 
                      type="button" 
                      onClick={addQuestion}
                      className="w-full"
                    >
                      Add Question
                    </Button>
                  </div>
                  
                  {questions.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Quiz Questions ({questions.length})</h3>
                      {questions.map((q, index) => (
                        <div key={index} className="border rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{q.question}</h4>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeQuestion(index)}
                              className="text-red-500 h-8 w-8 p-0"
                            >
                              ×
                            </Button>
                          </div>
                          <ol className="list-decimal list-inside space-y-1">
                            {q.options.map((opt, optIndex) => (
                              <li 
                                key={optIndex} 
                                className={optIndex === q.correctAnswer ? "text-green-600 font-medium" : ""}
                              >
                                {opt} {optIndex === q.correctAnswer && "(Correct)"}
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Preview</Button>
            <Button onClick={saveCourse}>Save Course</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CourseCreation;
