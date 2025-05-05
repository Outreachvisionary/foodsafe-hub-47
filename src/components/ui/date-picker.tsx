
import * as React from "react"
import { format, isValid } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date | null
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  placeholder?: string
}

export function DatePicker({ date, onSelect, disabled, className, placeholder = "Pick a date" }: DatePickerProps) {
  // Handle potentially invalid dates
  const isValidDate = date ? isValid(new Date(date)) : false;
  const displayDate = isValidDate ? date : null;
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !displayDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {displayDate ? format(displayDate, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={displayDate || undefined}
          onSelect={onSelect}
          disabled={disabled}
          initialFocus
          className="p-3 pointer-events-auto" 
        />
      </PopoverContent>
    </Popover>
  )
}

export default DatePicker;
