
import React from 'react';
import { ChevronUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  showScrollTop: boolean;
}

const ScrollToTopButton = ({ showScrollTop }: ScrollToTopButtonProps) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!showScrollTop) {
    return null;
  }

  return (
    <button 
      onClick={scrollToTop}
      className="fixed bottom-12 right-8 bg-accent text-white p-3 rounded-full shadow-lg hover:bg-accent/90 transition-all z-40"
      aria-label="Scroll to top"
    >
      <ChevronUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTopButton;
