'use client';
import * as React from 'react';
import { ErrorMessage, useFormikContext } from 'formik';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Box from '@/components/ui/box';

export function formatDate(date: Date | undefined) {
  if (!date) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

interface FormDatePickerProps {
  name: string;
  label: string;
  fromYear?: number;
  toYear?: number;
}

export const DatePicker: React.FC<FormDatePickerProps> = ({
  name,
  label,
  fromYear = 1950,
  toYear = new Date().getFullYear() - 10,
}) => {
  const { values, setFieldValue } = useFormikContext<any>();

  const date = values[name] ? new Date(values[name]) : undefined;

  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [inputValue, setInputValue] = React.useState(formatDate(date));

  React.useEffect(() => {
    const formikDate = values[name] ? new Date(values[name]) : undefined;
    setInputValue(formatDate(formikDate));
  }, [values[name]]);

  return (
    <Box className="mb-4">
      <Label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </Label>
      <Box className="relative flex gap-2">
        <Input
          id={name}
          value={inputValue}
          placeholder="Select date"
          className='pr-10'
          onChange={e => {
            const newStringValue = e.target.value;
            setInputValue(newStringValue);

            const newDate = new Date(newStringValue);
            if (isValidDate(newDate)) {
              setFieldValue(name, newDate);
              setMonth(newDate);
            } else {
              setFieldValue(name, null);
            }
          }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <Box as='span' className="sr-only">Select date</Box>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={newDate => {
                setFieldValue(name, newDate);
                setInputValue(formatDate(newDate));
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Box>
      {/* Formik validation error */}
      <ErrorMessage name={name} component="div" className="text-red-600 text-sm mt-1" />
    </Box>
  );
};
