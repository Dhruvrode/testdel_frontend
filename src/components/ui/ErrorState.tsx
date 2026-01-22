import { AlertCircle } from "lucide-react";
import { Button } from "./button";
import { toast } from "react-toastify";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ 
  error, 
  onRetry, 
  className = "h-[280px]" 
}: ErrorStateProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="text-center max-w-sm space-y-3">
        <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
        <p className="text-sm text-red-500">{error}</p>

        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm"
          >
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}