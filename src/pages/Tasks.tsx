
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Tasks = () => {
  const navigate = useNavigate();

  // Sample tasks data
  const tasks = [
    {
      id: '1',
      title: 'Review HACCP Plan for Production Line A',
      assignee: 'Quality Manager',
      dueDate: '2025-05-15',
      priority: 'High',
      status: 'Not Started',
      type: 'Document Review'
    },
    {
      id: '2',
      title: 'Complete monthly sanitation verification',
      assignee: 'Sanitation Lead',
      dueDate: '2025-05-10',
      priority: 'Medium',
      status: 'In Progress',
      type: 'Verification Activity'
    },
    {
      id: '3',
      title: 'Prepare for annual food safety audit',
      assignee: 'Food Safety Coordinator',
      dueDate: '2025-05-30',
      priority: 'Critical',
      status: 'In Progress',
      type: 'Audit Preparation'
    },
    {
      id: '4',
      title: 'Conduct training on new allergen control procedures',
      assignee: 'Training Coordinator',
      dueDate: '2025-05-22',
      priority: 'High',
      status: 'Not Started',
      type: 'Training Task'
    },
    {
      id: '5',
      title: 'Investigate temperature deviation in cooler #2',
      assignee: 'Maintenance Supervisor',
      dueDate: '2025-05-05',
      priority: 'Critical',
      status: 'Completed',
      type: 'Corrective Action'
    }
  ];

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      case 'Under Review': return 'bg-purple-100 text-purple-800';
      case 'Deferred': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground mt-1">Manage and track tasks across your organization</p>
        </div>
        <Button onClick={() => navigate('/tasks/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm mb-8">
        <div className="p-4 border-b flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-8" 
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="py-3 px-4 text-left font-medium">Task</th>
                <th className="py-3 px-4 text-left font-medium">Assignee</th>
                <th className="py-3 px-4 text-left font-medium">Due Date</th>
                <th className="py-3 px-4 text-left font-medium">Priority</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b hover:bg-muted/30">
                  <td className="py-3 px-4">
                    <Link 
                      to={`/tasks/${task.id}`} 
                      className="font-medium text-primary hover:underline"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4">{task.assignee}</td>
                  <td className="py-3 px-4">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPriorityBadgeColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{task.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing <strong>5</strong> of <strong>5</strong> tasks
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
