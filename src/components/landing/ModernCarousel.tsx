
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideProps {
  content: React.ReactNode;
  color: string;
}

interface ModernCarouselProps {
  slides: SlideProps[];
  autoPlayInterval?: number;
}

export function ModernCarousel({ slides, autoPlayInterval = 5000 }: ModernCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const slideVariants = {
    hiddenRight: {
      x: "100%",
      opacity: 0,
    },
    hiddenLeft: {
      x: "-100%",
      opacity: 0,
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4,
      },
    },
  };
  
  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };
  
  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [autoPlayInterval]);
  
  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };
  
  return (
    <div className="relative overflow-hidden w-full h-full rounded-xl">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial={direction === 1 ? "hiddenRight" : "hiddenLeft"}
          animate="visible"
          exit="exit"
          className="absolute inset-0"
        >
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            style={{ backgroundColor: slides[currentIndex].color }}
          >
            {slides[currentIndex].content}
          </div>
        </motion.div>
      </AnimatePresence>
      
      <Button
        onClick={handlePrevious}
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft />
      </Button>
      
      <Button
        onClick={handleNext}
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background z-10"
        aria-label="Next slide"
      >
        <ChevronRight />
      </Button>
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentIndex === index
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
