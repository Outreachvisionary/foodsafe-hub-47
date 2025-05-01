
import { Complaint, ComplaintFilter } from '@/types/complaint';
import { convertToComplaintStatus } from '@/utils/typeAdapters';
import { getMockComplaints } from '@/services/mockDataService';

// Get all complaints with optional filtering
export const getComplaints = async (filters?: ComplaintFilter): Promise<Complaint[]> => {
  // Simulate API call with mock data
  const mockComplaints = getMockComplaints();
  
  if (!filters) {
    return mockComplaints;
  }
  
  // Apply filters if provided
  return mockComplaints.filter(complaint => {
    let matches = true;
    
    if (filters.status) {
      if (Array.isArray(filters.status)) {
        matches = matches && filters.status.some(s => s === complaint.status);
      } else {
        matches = matches && (filters.status === complaint.status);
      }
    }
    
    if (filters.category) {
      if (Array.isArray(filters.category)) {
        matches = matches && filters.category.some(c => c === complaint.category);
      } else {
        matches = matches && (filters.category === complaint.category);
      }
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const titleMatch = complaint.title.toLowerCase().includes(term);
      const descMatch = complaint.description.toLowerCase().includes(term);
      const customerMatch = complaint.customer_name?.toLowerCase().includes(term) || false;
      
      matches = matches && (titleMatch || descMatch || customerMatch);
    }
    
    if (filters.dateRange) {
      const reportDate = new Date(complaint.reported_date).getTime();
      
      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start).getTime();
        matches = matches && reportDate >= startDate;
      }
      
      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end).getTime();
        matches = matches && reportDate <= endDate;
      }
    }
    
    return matches;
  });
};

// Get a single complaint by ID
export const getComplaintById = async (id: string): Promise<Complaint | null> => {
  // Simulate API call with mock data
  const mockComplaints = getMockComplaints();
  const complaint = mockComplaints.find(c => c.id === id);
  
  return complaint || null;
};

// Add more complaint service functions as needed
