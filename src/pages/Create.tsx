
import React from 'react';
import { FileText, User, CheckSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Create = () => {
  const createOptions = [
    {
      title: 'Document',
      description: 'Create a new document, procedure, form or other documentation',
      icon: FileText,
      path: '/documents/new',
      color: 'bg-blue-100 text-blue-700'
    },
    {
      title: 'User',
      description: 'Add a new user to the system with specific role and permissions',
      icon: User,
      path: '/users/new',
      color: 'bg-purple-100 text-purple-700'
    },
    {
      title: 'Task',
      description: 'Create a new task or action item with assignment and due date',
      icon: CheckSquare,
      path: '/tasks/new',
      color: 'bg-amber-100 text-amber-700'
    }
  ];

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create New</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {createOptions.map((option, index) => (
          <Card key={index} className="border border-border/40 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${option.color} flex items-center justify-center mb-2`}>
                <option.icon className="h-6 w-6" />
              </div>
              <CardTitle>{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="default" className="w-full">
                <Link to={option.path} className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Create {option.title}</span>
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Create;
