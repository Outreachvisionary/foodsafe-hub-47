
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckCircle, ChevronLeft, Clipboard, Clock, Info, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { auditSchema, AuditFormValues } from "@/lib/schemas/audit-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { FormSection } from "@/components/ui/form-section";
import { Calendar } from "@/components/ui/calendar";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Options for form fields
const auditTypes = [
  "Internal Audit",
  "External Audit",
  "Supplier Audit",
  "Regulatory Inspection",
  "Gap Assessment",
  "Compliance Audit",
  "Follow-up Audit"
];

const standards = [
  "ISO 22000:2018",
  "FSSC 22000",
  "BRCGS Food Safety",
  "SQF Edition 9",
  "IFS Food",
  "HACCP",
  "GMP",
  "Regulatory Requirements",
  "Internal Standards"
];

const locations = [
  "Main Production Facility",
  "Warehouse Facility",
  "Distribution Center",
  "Corporate Office",
  "Supplier Facility"
];

const auditors = [
  "Internal - Quality Assurance Team",
  "Internal - Food Safety Team",
  "External - Certification Body",
  "External - Consultant",
  "Regulatory Authority"
];

const priorityLevels = ["Low", "Medium", "High", "Critical"];

const departments = [
  "All Departments",
  "Production",
  "Quality Assurance",
  "Warehouse & Logistics",
  "Maintenance",
  "Sanitation",
  "Procurement",
  "Human Resources",
  "R&D"
] as const;

const ScheduleAuditForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  
  // Initialize form with default values
  const form = useForm<AuditFormValues>({
    resolver: zodResolver(auditSchema),
    defaultValues: {
      name: "",
      auditType: "Internal Audit",
      standard: "ISO 22000:2018",
      auditDate: new Date(Date.now() + 86400000), // Tomorrow
      duration: 4,
      location: "Main Production Facility",
      auditor: "Internal - Food Safety Team",
      description: "",
      priorityLevel: "Medium",
      departments: [],
      notifyParticipants: true,
      schedulePreAuditMeeting: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: AuditFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Form values:", values);
      
      // Show success toast
      toast({
        title: "Audit Scheduled",
        description: `Successfully scheduled "${values.name}" for ${format(values.auditDate, 'PP')}`,
        variant: "default",
      });
      
      // Navigate back to audits page
      navigate("/audits");
    } catch (error) {
      console.error("Error scheduling audit:", error);
      
      toast({
        title: "Error",
        description: "Failed to schedule audit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={fadeIn} 
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Schedule New Audit</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSection title="Basic Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Audit Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g. Annual Food Safety Audit" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="auditType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audit Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select audit type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {auditTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="standard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Standard/Framework</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select standard" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {standards.map((standard) => (
                          <SelectItem key={standard} value={standard}>
                            {standard}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <FormSection title="Scheduling Details">
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="auditDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Audit Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (hours)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="4" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <FormSection title="Audit Team">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="auditor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auditor</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select auditor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {auditors.map((auditor) => (
                          <SelectItem key={auditor} value={auditor}>
                            {auditor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <FormSection title="Scope & Priority">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter audit scope and objectives..."
                          className="min-h-[100px]" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="priorityLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormField
                  control={form.control}
                  name="departments"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Departments to Audit</FormLabel>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {departments.map((department) => (
                          <FormField
                            key={department}
                            control={form.control}
                            name="departments"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={department}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(department)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, department])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== department
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer">
                                    {department}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </FormSection>
          
          <FormSection title="Additional Options">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="notifyParticipants"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Notify Participants
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications to all participants
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="schedulePreAuditMeeting"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="cursor-pointer">
                        Schedule Pre-Audit Meeting
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Automatically schedule a 30-minute pre-audit meeting
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </FormSection>
          
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  // Save as draft logic would go here
                  toast({
                    title: "Draft Saved",
                    description: "Your audit has been saved as a draft",
                  });
                }}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Scheduling...
                  </>
                ) : (
                  <>Schedule Audit</>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
};

export default ScheduleAuditForm;
