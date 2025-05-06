import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TestimonialCard from './TestimonialCard';
import { testimonials } from '@/constants';

const TestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState<number[]>([]);

  // Calculate visible testimonials based on screen size
  useEffect(() => {
    const handleResize = () => {
      let visibleCount = 1;

      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) {
          visibleCount = 3; // Show 3 on desktop
        } else if (window.innerWidth >= 768) {
          visibleCount = 2; // Show 2 on tablets
        }
      }

      calculateVisibleTestimonials(visibleCount);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activeIndex]);

  const calculateVisibleTestimonials = (visibleCount: number) => {
    const totalTestimonials = testimonials.length;
    const visibleItems: number[] = [];

    // Calculate indices of visible testimonials
    for (let i = 0; i < visibleCount; i++) {
      const index = (activeIndex + i) % totalTestimonials;
      visibleItems.push(index);
    }

    setVisibleTestimonials(visibleItems);
  };

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className='relative py-8'>
      <div className='absolute inset-0 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg -z-10' />

      <h2 className='text-2xl font-bold mb-8 text-center text-[--sky-dark-blue]'>
        Testimonials
      </h2>

      <div className='relative px-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden'>
          {visibleTestimonials.map((index) => (
            <div
              key={testimonials[index].id}
              className='transition-all duration-300 ease-in-out'
            >
              <TestimonialCard
                name={testimonials[index].name}
                text={testimonials[index].text}
                image={testimonials[index].image}
              />
            </div>
          ))}
        </div>

        <Button
          onClick={prevTestimonial}
          className='absolute left-0 top-1/2 transform -translate-y-1/2 rounded-full bg-white text-[--sky-blue] hover:text-white hover:bg-[--sky-blue] shadow border-none'
          size='icon'
        >
          <ChevronLeft className='h-6 w-6' />
        </Button>

        <Button
          onClick={nextTestimonial}
          className='absolute right-0 top-1/2 transform -translate-y-1/2 rounded-full bg-white text-[--sky-blue] hover:text-white hover:bg-[--sky-blue] shadow border-none'
          size='icon'
        >
          <ChevronRight className='h-6 w-6' />
        </Button>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
