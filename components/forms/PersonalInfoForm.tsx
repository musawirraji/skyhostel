'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import type { Control } from 'react-hook-form';
import type * as z from 'zod';

import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import type { formSchema } from '@/lib/validation';

interface PersonalInfoFormProps {
  control: Control<z.infer<typeof formSchema>>;
}

type DatePickerView = 'year' | 'month' | 'day';

const PersonalInfoForm = ({ control }: PersonalInfoFormProps) => {
  const [view, setView] = useState<DatePickerView>('year');
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  const months = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  return (
    <>
      <div className='space-y-2'>
        <h3 className='text-lg font-medium'>Section A</h3>
        <p className='text-sm text-gray-500'>Personal Information</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your first name?</FormLabel>
              <FormControl>
                <Input placeholder='John' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your last name?</FormLabel>
              <FormControl>
                <Input placeholder='Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name='email'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your email address?</FormLabel>
            <FormControl>
              <Input type='email' placeholder='john.doe@gmail.com' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='matricNumber'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your matric number?</FormLabel>
              <FormControl>
                <Input placeholder='67/55EC081' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='level'
          render={({ field }) => (
            <FormItem>
              <FormLabel>What level are you?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select your level' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='100'>100</SelectItem>
                  <SelectItem value='200'>200</SelectItem>
                  <SelectItem value='300'>300</SelectItem>
                  <SelectItem value='400'>400</SelectItem>
                  <SelectItem value='500'>500</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name='phoneNumber'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your phone number?</FormLabel>
            <FormControl>
              <Input placeholder='00000000000' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='faculty'
          render={({ field }) => (
            <FormItem>
              <FormLabel>What faculty are you?</FormLabel>
              <FormControl>
                <Input placeholder='Education' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='department'
          render={({ field }) => (
            <FormItem>
              <FormLabel>What department are you?</FormLabel>
              <FormControl>
                <Input placeholder='Science Education' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name='programme'
        render={({ field }) => (
          <FormItem>
            <FormLabel>What programme are you studying?</FormLabel>
            <FormControl>
              <Input placeholder='Mathematics' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <FormField
          control={control}
          name='dateOfBirth'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>What is your date of birth?</FormLabel>
              <Popover
                open={isCalendarOpen}
                onOpenChange={(open) => {
                  setIsCalendarOpen(open);
                  if (open) {
                    setView('year');
                    setTempDate(field.value || null);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'dd/MM/yyyy')
                      ) : (
                        <span>dd/mm/yyyy</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  {view === 'year' && (
                    <div className='p-2 w-[280px]'>
                      <div className='flex items-center justify-between mb-4 px-2 pt-2'>
                        <h3 className='font-medium'>Select Year</h3>
                      </div>
                      <div className='grid grid-cols-4 gap-2 max-h-[280px] overflow-y-auto p-2'>
                        {years.map((year) => (
                          <Button
                            key={year}
                            variant='outline'
                            size='sm'
                            className={cn(
                              'h-8',
                              tempDate &&
                                tempDate.getFullYear() === year &&
                                'bg-primary text-primary-foreground'
                            )}
                            onClick={() => {
                              const newDate = tempDate || new Date();
                              newDate.setFullYear(year);
                              setTempDate(newDate);
                              setView('month');
                            }}
                          >
                            {year}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {view === 'month' && (
                    <div className='p-2 w-[280px]'>
                      <div className='flex items-center justify-between mb-4 px-2 pt-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={() => setView('year')}
                        >
                          <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <h3 className='font-medium'>
                          {tempDate
                            ? tempDate.getFullYear()
                            : new Date().getFullYear()}
                        </h3>
                      </div>
                      <div className='grid grid-cols-3 gap-2 p-2'>
                        {months.map((month) => (
                          <Button
                            key={month.value}
                            variant='outline'
                            size='sm'
                            className={cn(
                              'h-8',
                              tempDate &&
                                tempDate.getMonth() === month.value &&
                                'bg-primary text-primary-foreground'
                            )}
                            onClick={() => {
                              const newDate = tempDate || new Date();
                              newDate.setMonth(month.value);
                              setTempDate(newDate);
                              setView('day');
                            }}
                          >
                            {month.label.substring(0, 3)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {view === 'day' && tempDate && (
                    <div className='p-2 w-[280px]'>
                      <div className='flex items-center justify-between mb-4 px-2 pt-2'>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='h-8 w-8 p-0'
                          onClick={() => setView('month')}
                        >
                          <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <h3 className='font-medium'>
                          {months[tempDate.getMonth()].label}{' '}
                          {tempDate.getFullYear()}
                        </h3>
                      </div>
                      <Calendar
                        mode='single'
                        selected={tempDate}
                        month={tempDate}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                            // Close the popover after day selection
                            setIsCalendarOpen(false);
                          }
                        }}
                        disabled={(date) =>
                          date > new Date() ||
                          date < new Date('1900-01-01') ||
                          date.getMonth() !== tempDate.getMonth() ||
                          date.getFullYear() !== tempDate.getFullYear()
                        }
                        initialFocus
                      />
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='stateOfOrigin'
          render={({ field }) => (
            <FormItem>
              <FormLabel>What is your state of origin?</FormLabel>
              <FormControl>
                <Input placeholder='Osun' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name='maritalStatus'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Marital status?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Select...' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='single'>Single</SelectItem>
                <SelectItem value='married'>Married</SelectItem>
                <SelectItem value='divorced'>Divorced</SelectItem>
                <SelectItem value='widowed'>Widowed</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default PersonalInfoForm;
