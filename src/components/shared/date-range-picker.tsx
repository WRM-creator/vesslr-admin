/* eslint-disable max-lines */
"use client";

import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { type FC, type JSX, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export interface DateRangePickerProps {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; preset: string }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Initial preset selection (thisMonth, lastMonth, last3Months, custom) */
  initialPreset?: string;
  /** Alignment of popover */
  align?: "start" | "center" | "end";
  /** Option for locale */
  locale?: string;
}

const formatDate = (date: Date, locale: string = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split("-").map((part) => parseInt(part, 10));
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed, so subtract 1 from the month part
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date;
  } else {
    // If dateInput is already a Date object, return it directly
    return dateInput;
  }
};

interface DateRange {
  from: Date;
  to: Date | undefined;
}

interface Preset {
  name: string;
  label: string;
}

// Define presets
const PRESETS: Preset[] = [
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
  { name: "last3Months", label: "Last 3 Months" },
  { name: "custom", label: "Custom" },
];

// Helper to calculate date range for a preset (extracted for initial state calculation)
const getPresetRange = (presetName: string): DateRange => {
  const from = new Date();
  const to = new Date();

  switch (presetName) {
    case "thisMonth":
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      break;
    case "lastMonth":
      from.setMonth(from.getMonth() - 1);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setDate(0);
      to.setHours(23, 59, 59, 999);
      break;
    case "last3Months":
      from.setMonth(from.getMonth() - 3);
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
      to.setDate(0);
      to.setHours(23, 59, 59, 999);
      break;
  }

  return { from, to };
};

// Helper to get initial range based on props
const getInitialRange = (
  initialDateFrom: Date | string | undefined,
  initialDateTo: Date | string | undefined,
  initialPreset: string | undefined,
): DateRange => {
  // If preset is provided and it's not "custom", calculate range from preset
  if (initialPreset && initialPreset !== "custom") {
    return getPresetRange(initialPreset);
  }

  // Otherwise use the explicit dates
  const defaultFrom = new Date(new Date().setHours(0, 0, 0, 0));
  const from = initialDateFrom
    ? getDateAdjustedForTimezone(initialDateFrom)
    : defaultFrom;
  const to = initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : from;

  return { from, to };
};

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangePicker: FC<DateRangePickerProps> = ({
  initialDateFrom,
  initialDateTo,
  initialPreset,
  onUpdate,
  align = "end",
  locale = "en-US",
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange>(() =>
    getInitialRange(initialDateFrom, initialDateTo, initialPreset),
  );

  // Refs to store the values of range when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>(undefined);

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    initialPreset,
  );

  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const setPreset = (preset: string): void => {
    if (preset === "custom") {
      setSelectedPreset("custom");
      setIsOpen(true); // Open calendar for custom selection
    } else {
      const range = getPresetRange(preset);
      setRange(range);
      setSelectedPreset(preset);
      onUpdate?.({ range, preset });
    }
  };

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      if (preset.name === "custom") continue;

      const presetRange = getPresetRange(preset.name);

      const normalizedRangeFrom = new Date(range.from);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(
        presetRange.from.setHours(0, 0, 0, 0),
      );

      const normalizedRangeTo = new Date(range.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0,
      );

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }

    setSelectedPreset("custom");
  };

  const resetValues = (): void => {
    setRange(getInitialRange(initialDateFrom, initialDateTo, initialPreset));
  };

  useEffect(() => {
    checkPreset();
  }, [range]);

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
    }
  }, [isOpen]);

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <Select value={selectedPreset} onValueChange={setPreset}>
        <SelectTrigger className="min-h-9 min-w-[110px]">
          <SelectValue placeholder="Select range" />
        </SelectTrigger>
        <SelectContent>
          {PRESETS.map((preset) => (
            <SelectItem key={preset.name} value={preset.name}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover
        modal={true}
        open={isOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            // Optional: reset on close or keep selection
            // resetValues()
          }
          setIsOpen(open);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            size={"lg"}
            variant="outline"
            className="h-9 min-w-[220px] px-3"
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <div className="py-1">
                  <div>{`${formatDate(range.from, locale)} - ${
                    range.to != null ? formatDate(range.to, locale) : ""
                  }`}</div>
                </div>
              </div>
              <div className="pl-1 opacity-50">
                {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              </div>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} className="w-auto p-0">
          <div className="flex">
            <div className="flex">
              <div className="flex flex-col">
                {/* <div className="flex flex-col items-center justify-end gap-2 px-3 pb-4 lg:flex-row lg:items-start lg:pb-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <DateInput
                        value={range.from}
                        onChange={(date) => {
                          const toDate =
                            range.to == null || date > range.to
                              ? date
                              : range.to;
                          setRange((prevRange) => ({
                            ...prevRange,
                            from: date,
                            to: toDate,
                          }));
                        }}
                      />
                      <div className="py-1">-</div>
                      <DateInput
                        value={range.to}
                        onChange={(date) => {
                          const fromDate =
                            date < range.from ? date : range.from;
                          setRange((prevRange) => ({
                            ...prevRange,
                            from: fromDate,
                            to: date,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div> */}
                <div>
                  <Calendar
                    mode="range"
                    onSelect={(
                      value: { from?: Date; to?: Date } | undefined,
                    ) => {
                      if (value?.from != null) {
                        setRange({ from: value.from, to: value?.to });
                      }
                    }}
                    selected={range}
                    numberOfMonths={isSmallScreen ? 1 : 2}
                    defaultMonth={new Date()}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t py-4 pr-4">
            <Button
              onClick={() => {
                setIsOpen(false);
                resetValues();
              }}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                onUpdate?.({ range, preset: selectedPreset || "custom" });
              }}
              size="sm"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

DateRangePicker.displayName = "DateRangePicker";
