import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { AlertCircle, Camera, X } from "lucide-react";
import Quagga from "quagga";

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onDetected,
  onClose,
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Clean up Quagga when component unmounts
      if (isScanning) {
        Quagga.stop();
      }
    };
  }, [isScanning]);

  const startScanning = () => {
    setError(null);
    setIsScanning(true);

    if (videoRef.current) {
      try {
        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              target: videoRef.current,
              constraints: {
                width: { min: 640 },
                height: { min: 480 },
                facingMode: "environment",
                aspectRatio: { min: 1, max: 2 },
              },
            },
            locator: {
              patchSize: "medium",
              halfSample: true,
            },
            numOfWorkers: 4,
            frequency: 10,
            decoder: {
              readers: [
                "ean_reader",
                "ean_8_reader",
                "upc_reader",
                "upc_e_reader",
                "code_128_reader",
              ],
              debug: {
                showCanvas: true,
                showPatches: true,
                showFoundPatches: true,
                showSkeleton: true,
                showLabels: true,
                showPatchLabels: true,
                showRemainingPatchLabels: true,
                boxFromPatches: {
                  showTransformed: true,
                  showTransformedBox: true,
                  showBB: true,
                },
              },
            },
            locate: true,
          },
          (err) => {
            if (err) {
              console.error("Quagga initialization error:", err);
              setError("Failed to initialize barcode scanner: " + err);
              setIsScanning(false);
              return;
            }

            console.log("Quagga initialized successfully");
            Quagga.start();

            // Add detection event listener
            Quagga.onDetected((result) => {
              if (result && result.codeResult) {
                const code = result.codeResult.code;
                console.log("Detected barcode:", code);
                if (code) {
                  // Stop scanning after successful detection
                  Quagga.stop();
                  setIsScanning(false);
                  onDetected(code);
                }
              }
            });

            // Add processing event listener for debugging
            Quagga.onProcessed((result) => {
              const drawingCtx = Quagga.canvas.ctx.overlay;
              const drawingCanvas = Quagga.canvas.dom.overlay;

              if (result && drawingCtx && drawingCanvas) {
                if (result.boxes) {
                  drawingCtx.clearRect(
                    0,
                    0,
                    parseInt(drawingCanvas.getAttribute("width") || "0"),
                    parseInt(drawingCanvas.getAttribute("height") || "0"),
                  );
                  result.boxes
                    .filter((box) => box !== result.box)
                    .forEach((box) => {
                      Quagga.ImageDebug.drawPath(
                        box,
                        { x: 0, y: 1 },
                        drawingCtx,
                        {
                          color: "green",
                          lineWidth: 2,
                        },
                      );
                    });
                }

                if (result.box) {
                  Quagga.ImageDebug.drawPath(
                    result.box,
                    { x: 0, y: 1 },
                    drawingCtx,
                    {
                      color: "#00F",
                      lineWidth: 2,
                    },
                  );
                }

                if (result.codeResult && result.codeResult.code) {
                  Quagga.ImageDebug.drawPath(
                    result.line,
                    { x: "x", y: "y" },
                    drawingCtx,
                    { color: "red", lineWidth: 3 },
                  );
                }
              }
            });
          },
        );
      } catch (error) {
        console.error("Error starting Quagga:", error);
        setError(`Failed to start scanner: ${error.message || error}`);
        setIsScanning(false);
      }
    } else {
      setError("Video container not found");
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-background rounded-lg overflow-hidden">
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-semibold">Scan Barcode</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (isScanning) {
                Quagga.stop();
              }
              onClose();
            }}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative aspect-[4/3] bg-black">
          <div ref={videoRef} className="w-full h-full"></div>
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-3/4 h-1/4 border-2 border-primary border-opacity-50 animate-pulse"></div>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="p-4">
          <Button
            onClick={startScanning}
            disabled={isScanning}
            className="w-full"
          >
            <Camera className="mr-2 h-5 w-5" />
            {isScanning ? "Scanning..." : "Start Scanning"}
          </Button>
          <p className="mt-2 text-xs text-center text-muted-foreground">
            Position barcode within the scanner area
          </p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
