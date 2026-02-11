"use client";

import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  dateLabel?: string;
  timeLabel?: string;
}

export const DateTimePicker = ({
  date,
  setDate,
  dateLabel = "Date",
  timeLabel = "Time",
}: DateTimePickerProps) => {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      return;
    }

    // Preserve time from existing date if available, otherwise default to 00:00:00 or current time?
    // The snippet didn't specify, but usually we want to keep the time if we just change the date.
    // However, if date was undefined, we need to set a time.

    const newDate = new Date(selectedDate);
    if (date) {
      newDate.setHours(date.getHours());
      newDate.setMinutes(date.getMinutes());
      newDate.setSeconds(date.getSeconds());
    } else {
      // Default to current time or 00:00?
      // Let's default to 00:00:00 to be safe, or maybe 12:00.
      // The snippet had defaultValue="10:30:00" on the input.
      newDate.setHours(10, 30, 0, 0);
    }
    setDate(newDate);
    setOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeStr = e.target.value;
    if (!date) return; // Should probably be disabled if no date selected, or selecting time sets date to today?

    // If no date is selected, we can't really set time.
    // But for better UX, maybe we should default to today?
    // For now, let's assume date must be selected first.

    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(seconds || 0);
    setDate(newDate);
  };

  // Format time for input value
  const timeValue = date ? format(date, "HH:mm:ss") : "";

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="date-picker" className="px-1">
          {dateLabel}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className={cn(
                "w-32 justify-between font-normal",
                !date && "text-muted-foreground",
              )}
            >
              {date ? format(date, "P") : "Select date"}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              captionLayout="dropdown"
              startMonth={new Date(2020, 0)}
              endMonth={new Date(new Date().getFullYear() + 10, 11)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="time-picker" className="px-1">
          {timeLabel}
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={timeValue}
          onChange={handleTimeChange}
          disabled={!date}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
};
