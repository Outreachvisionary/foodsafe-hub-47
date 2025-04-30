
import { Complaint, ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types/complaint';

/**
 * Maps a complaint object to database format
 * Handles any necessary transformations for database compatibility
 */
export const mapComplaintToDb = (complaint: Partial<Complaint>): any => {
  return {
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    status: complaint.status,
    priority: complaint.priority,
    reported_date: complaint.reported_date,
    resolution_date: complaint.resolution_date,
    created_by: complaint.created_by,
    customer_name: complaint.customer_name,
    customer_contact: complaint.customer_contact,
    product_involved: complaint.product_involved,
    lot_number: complaint.lot_number,
    capa_required: complaint.capa_required,
    assigned_to: complaint.assigned_to,
    capa_id: complaint.capa_id
  };
};
