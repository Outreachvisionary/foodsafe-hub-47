-- First, insert sample facilities
INSERT INTO facilities (id, name, address, city, state, country, contact_email, contact_phone, status, organization_id) VALUES
('11111111-1111-1111-1111-111111111111', 'Main Production Facility', '123 Industrial Way', 'Chicago', 'IL', 'USA', 'facility1@company.com', '+1-555-0123', 'active', NULL),
('22222222-2222-2222-2222-222222222222', 'Quality Control Lab', '456 Science Blvd', 'Austin', 'TX', 'USA', 'qclab@company.com', '+1-555-0124', 'active', NULL),
('33333333-3333-3333-3333-333333333333', 'Distribution Center', '789 Logistics Ave', 'Atlanta', 'GA', 'USA', 'distribution@company.com', '+1-555-0125', 'active', NULL);

-- Then, assign standards to facilities with various compliance statuses
INSERT INTO facility_standards (facility_id, standard_id, compliance_status, certification_date, expiry_date, notes) VALUES
-- Main Production Facility
('11111111-1111-1111-1111-111111111111', (SELECT id FROM regulatory_standards WHERE code = 'ISO-22000' LIMIT 1), 'Certified', '2024-01-15', '2027-01-15', 'Full certification completed with annual surveillance audits'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM regulatory_standards WHERE code = 'HACCP' LIMIT 1), 'Compliant', '2024-03-10', '2025-03-10', 'Implementation complete, awaiting third-party audit'),
('11111111-1111-1111-1111-111111111111', (SELECT id FROM regulatory_standards WHERE code = 'SQF-9' LIMIT 1), 'In Progress', NULL, NULL, 'Documentation phase ongoing, target completion Q2 2025'),

-- Quality Control Lab  
('22222222-2222-2222-2222-222222222222', (SELECT id FROM regulatory_standards WHERE code = 'ISO-22000' LIMIT 1), 'Certified', '2023-11-20', '2026-11-20', 'Lab-specific certification with specialized testing protocols'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM regulatory_standards WHERE code = 'BRC-8' LIMIT 1), 'Compliant', '2024-06-01', '2025-06-01', 'Grade A certification maintained'),
('22222222-2222-2222-2222-222222222222', (SELECT id FROM regulatory_standards WHERE code = 'FSSC-22000' LIMIT 1), 'Expired', '2022-09-15', '2024-09-15', 'Needs immediate renewal - recertification audit scheduled'),

-- Distribution Center
('33333333-3333-3333-3333-333333333333', (SELECT id FROM regulatory_standards WHERE code = 'BRC-8' LIMIT 1), 'Certified', '2024-02-28', '2027-02-28', 'Storage and distribution certification active'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM regulatory_standards WHERE code = 'HACCP' LIMIT 1), 'In Progress', NULL, NULL, 'Implementing storage-specific HACCP plan'),
('33333333-3333-3333-3333-333333333333', (SELECT id FROM regulatory_standards WHERE code = 'FSSC-22000' LIMIT 1), 'Non-Compliant', NULL, NULL, 'Gap analysis revealed significant deviations - CAPA required');