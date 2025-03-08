
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModernCarouselProps {
  items: {
    id: string | number;
    image: string;
    title: string;
    description: string;
  }[];
  autoPlay?: boolean;
  interval?: number;
}

export const ModernCarousel = ({ 
  items, 
  autoPlay = true, 
  interval = 5000 
}: ModernCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    
    if (autoPlay) {
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
      }, interval);
    }
    
    return () => {
      resetTimeout();
    };
  }, [currentIndex, autoPlay, interval, items.length]);

  const goToNext = () => {
    resetTimeout();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const goToPrev = () => {
    resetTimeout();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const goToSlide = (index: number) => {
    resetTimeout();
    setCurrentIndex(index);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  const direction = useRef(0);

  const getImageUrl = (imageUrl: string) => {
    if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    const images = [
      '/images/destination-1.jpg',
      '/images/destination-2.jpg',
      '/images/destination-3.jpg',
      '/images/destination-4.jpg',
      '/images/destination-5.jpg',
      '/images/destination-6.jpg'
    ];
    
    const index = Math.floor(Math.random() * images.length);
    return images[index];
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction.current}>
          <motion.div
            key={currentIndex}
            custom={direction.current}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <img 
                src={getImageUrl(items[currentIndex].image)} 
                alt={items[currentIndex].title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                <motion.h3 
                  className="text-white text-2xl md:text-3xl font-bold mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {items[currentIndex].title}
                </motion.h3>
                <motion.p 
                  className="text-white/80 text-sm md:text-base max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {items[currentIndex].description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 flex items-center justify-between p-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              direction.current = -1;
              goToPrev();
            }}
            className="rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {
              direction.current = 1;
              goToNext();
            }}
            className="rounded-full bg-black/20 hover:bg-black/40 text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              direction.current = i > currentIndex ? 1 : -1;
              goToSlide(i);
            }}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
