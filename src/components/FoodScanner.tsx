import React, { useState } from "react";
import { Camera, X, ZapIcon, Info, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FoodScannerProps {
  onScanComplete?: (data: any) => void;
}

const FoodScanner = ({ onScanComplete = () => {} }: FoodScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanError, setScanError] = useState<string | null>(null);

  const startScanning = () => {
    setIsScanning(true);
    setScanError(null);
    setScanProgress(0);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          handleScanComplete();
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleScanComplete = () => {
    // Simulate scan completion with mock data
    setTimeout(() => {
      setIsScanning(false);
      const mockScanData = {
        productName: "Organic Granola",
        nutritionFacts: {
          calories: 240,
          protein: 6,
          carbs: 36,
          fat: 9,
          fiber: 4,
          sugar: 12,
        },
        ingredients: [
          "Rolled Oats",
          "Honey",
          "Almonds",
          "Coconut Oil",
          "Dried Cranberries",
        ],
        allergens: ["Tree Nuts"],
      };
      onScanComplete(mockScanData);
    }, 500);
  };

  const cancelScanning = () => {
    setIsScanning(false);
    setScanProgress(0);
  };

  const retryScanning = () => {
    setScanError(null);
    startScanning();
  };

  return (
    <div className="bg-background min-h-screen p-6">
      {/* Version info */}
      <div className="text-right mb-2">
        <p className="text-xs text-muted-foreground">
          Version 1.0.5 - 2023-06-15 17:00:00
        </p>
      </div>

      <div className="w-full h-full flex flex-col items-center justify-center bg-background">
        {!isScanning ? (
          <div className="flex flex-col items-center space-y-6 p-4 w-full max-w-md">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Food Scanner</h2>
              <p className="text-muted-foreground mb-6">
                Scan food labels to get detailed nutrition information and
                personalized scores.
              </p>
            </div>

            <Card className="w-full bg-muted/30">
              <CardContent className="flex flex-col items-center justify-center p-10">
                <Camera className="h-24 w-24 text-primary mb-4" />
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Position the nutrition label within the frame for best results
                </p>
                <Button
                  size="lg"
                  onClick={startScanning}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <ZapIcon className="h-4 w-4" />
                  Start Scanning
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col w-full space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Info className="h-4 w-4 mr-2" />
                      <span>Scanning Tips</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="w-80">
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Ensure good lighting for best results</li>
                      <li>Hold your camera steady and parallel to the label</li>
                      <li>Make sure the entire nutrition label is visible</li>
                      <li>Avoid shadows and glare on the packaging</li>
                    </ul>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full max-w-md max-h-[600px]">
            {/* Camera Viewfinder */}
            <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
              {/* Mock camera feed */}
              <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
                {/* Scanning overlay */}
                <motion.div
                  className="absolute inset-0 border-2 border-primary z-10"
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />

                {/* Scanning guide lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 h-2/3 border-2 border-dashed border-white/50 rounded-md flex items-center justify-center">
                    <p className="text-white/70 text-sm">
                      Position nutrition label here
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress indicator */}
              <div className="absolute bottom-20 left-0 right-0 px-8">
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-primary h-2.5 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-white/80 text-center mt-2 text-sm">
                  {scanError
                    ? "Scanning failed"
                    : "Analyzing nutrition information..."}
                </p>
              </div>

              {/* Controls */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4">
                {scanError ? (
                  <Button
                    variant="outline"
                    onClick={retryScanning}
                    className="bg-background/20 border-white/20 text-white"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retry
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={cancelScanning}
                    className="bg-background/20 border-white/20 text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodScanner;
