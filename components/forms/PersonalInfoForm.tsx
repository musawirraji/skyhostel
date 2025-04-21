import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Control } from 'react-hook-form';
import * as z from 'zod';

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
import { formSchema } from '@/lib/validation';

interface PersonalInfoFormProps {
  control: Control<z.infer<typeof formSchema>>;
}

const PersonalInfoForm = ({ control }: PersonalInfoFormProps) => {
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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
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
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                  />
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
