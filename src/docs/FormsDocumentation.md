
# Form Components Documentation

This document provides an overview of the form components created for the food safety management system.

## General Components

### FormSection

A reusable component for creating sectioned forms with clear visual separation.

**Features:**
- Collapsible sections (optional)
- Section titles and descriptions
- Consistent styling with the design system

**Usage:**
```tsx
<FormSection title="Basic Information" collapsible={true}>
  {/* Form fields go here */}
</FormSection>
```

## Schedule Audit Form

A comprehensive form for scheduling facility audits, including validation and UX enhancements.

### Form Fields

#### Basic Information
- **Audit Name**: Text input, required, minimum 3 characters
- **Audit Type**: Select dropdown with options like Internal Audit, External Audit, etc.
- **Standard/Framework**: Select dropdown with options like ISO 22000:2018, FSSC 22000, etc.

#### Scheduling Details
- **Audit Date**: Date picker with validation to prevent past dates
- **Duration**: Number input for audit duration in hours
- **Location**: Select dropdown for facility location

#### Audit Team
- **Auditor**: Select dropdown with options for internal/external auditors

#### Scope & Priority
- **Description**: Textarea for audit scope and objectives
- **Priority Level**: Select dropdown with options from Low to Critical
- **Departments to Audit**: Multiple checkboxes for department selection

#### Additional Options
- **Notify Participants**: Checkbox to enable email notifications
- **Schedule Pre-Audit Meeting**: Checkbox to schedule a planning meeting

### Features
- Form validation using Zod schema
- Responsive layout for all screen sizes
- Clear visual hierarchy with form sections
- Loading states during submission
- Success/error toast notifications
- Field validation with immediate feedback

## New Supplier Form

A detailed form for adding new suppliers with comprehensive information collection.

### Form Fields

#### Supplier Information
- **Company Name**: Text input, required, minimum 2 characters
- **Supplier Type**: Select dropdown with options like Ingredient Supplier, Packaging Supplier, etc.
- **Category**: Select dropdown with options based on food safety risk
- **Status**: Select dropdown for supplier approval status
- **Description**: Textarea for supplier description

#### Contact Information
- **Contact Name**: Text input
- **Email Address**: Email input with validation
- **Phone Number**: Text input
- **Website**: URL input (optional)

#### Address Information
- **Street Address**: Text input
- **City**: Text input
- **State/Province**: Text input
- **Postal Code**: Text input
- **Country**: Text input

#### Qualifications & Certifications
- **Approval Level**: Select dropdown with qualification tiers
- **Next Audit Date**: Date picker
- **Certifications**: Multiple checkboxes for various food safety certifications
- **Food Safety Plan**: Checkbox to indicate presence of a plan
- **Allergen Program**: Checkbox to indicate presence of a program

### Features
- Live status badge preview that updates based on form values
- Form section organization for better UX
- Complete validation rules for all fields
- Draft saving capability
- Clean, modern UI aligned with design system

## Technical Implementation

Both forms are built using:
- React Hook Form for form state management and validation
- Zod for schema validation
- Shadcn/ui components for UI elements
- Framer Motion for subtle animations
- Tailwind CSS for styling

The forms follow a consistent pattern:
1. Define a Zod schema for validation
2. Create form fields with appropriate validation
3. Organize fields into logical sections
4. Implement submission handling with loading states
5. Provide success/error feedback

## Accessibility Features

- Required field indicators (asterisk)
- Error messages with clear instructions
- Focus management
- Keyboard navigation support
- Proper ARIA attributes
- Color contrast compliance
