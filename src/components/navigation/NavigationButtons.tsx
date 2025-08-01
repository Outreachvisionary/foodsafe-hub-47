import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  showBack?: boolean;
  showNext?: boolean;
  className?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onNext,
  showBack = true,
  showNext = false,
  className = "fixed bottom-6 left-6 flex gap-2 z-50"
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else {
      navigate(1);
    }
  };

  if (!showBack && !showNext) {
    return null;
  }

  return (
    <div className={className}>
      {showBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="shadow-lg bg-background/95 backdrop-blur-sm border-border hover:bg-muted/50 transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
      )}
      {showNext && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          className="shadow-lg bg-background/95 backdrop-blur-sm border-border hover:bg-muted/50 transition-all duration-200"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      )}
    </div>
  );
};

export default NavigationButtons;