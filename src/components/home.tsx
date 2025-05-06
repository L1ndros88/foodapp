import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Camera,
  BookOpen,
  User,
  Calendar,
  Menu,
  Bell,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import BarcodeScanner from "./BarcodeScanner";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import NutritionAnalysis from "./NutritionAnalysis";

const HomePage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  // Mock data for recent food entries
  const recentFoods = [
    { id: 1, name: "Greek Yogurt", time: "8:30 AM", score: 85 },
    { id: 2, name: "Chicken Salad", time: "12:15 PM", score: 92 },
    { id: 3, name: "Protein Bar", time: "3:45 PM", score: 68 },
  ];

  // Mock data for nutrition scores
  const nutritionScores = {
    overall: 82,
    nutrition: 78,
    ingredients: 85,
    processing: 70,
    caloric: 90,
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const handleBarcodeDetected = async (barcode: string) => {
    setIsLoading(true);
    try {
      console.log("Detected barcode:", barcode);
      // Call Open Food Facts API v2
      const response = await fetch(
        `https://world.openfoodfacts.net/api/v2/product/${barcode}`,
      );
      const data = await response.json();
      console.log("API response:", data);

      if (data.status === 1) {
        // Product found
        toast({
          title: "Product Found",
          description: `${data.product.product_name || "Product"} scanned successfully.`,
        });

        // Process the data for display
        const product = data.product;

        // Extract nutrition scores based on actual data
        const nutriscoreGrade = product.nutriscore_grade || null;
        const novaGroup = product.nova_group || null;
        const ecoScore = product.ecoscore_grade || null;

        // Calculate nutrition score
        let nutritionScore = 50; // Default score
        if (nutriscoreGrade) {
          switch (nutriscoreGrade) {
            case "a":
              nutritionScore = 90;
              break;
            case "b":
              nutritionScore = 75;
              break;
            case "c":
              nutritionScore = 60;
              break;
            case "d":
              nutritionScore = 40;
              break;
            case "e":
              nutritionScore = 20;
              break;
          }
        }

        // Calculate processing score
        let processingScore = 50; // Default score
        if (novaGroup) {
          switch (novaGroup) {
            case 1:
              processingScore = 90;
              break; // Unprocessed
            case 2:
              processingScore = 70;
              break; // Processed culinary ingredients
            case 3:
              processingScore = 40;
              break; // Processed foods
            case 4:
              processingScore = 20;
              break; // Ultra-processed foods
          }
        }

        // Calculate environmental impact score
        let environmentalScore = 50; // Default score
        if (ecoScore) {
          switch (ecoScore) {
            case "a":
              environmentalScore = 90;
              break;
            case "b":
              environmentalScore = 75;
              break;
            case "c":
              environmentalScore = 60;
              break;
            case "d":
              environmentalScore = 40;
              break;
            case "e":
              environmentalScore = 20;
              break;
          }
        }

        // Calculate overall score as average of available scores
        const availableScores = [];
        if (nutriscoreGrade) availableScores.push(nutritionScore);
        if (novaGroup) availableScores.push(processingScore);
        if (ecoScore) availableScores.push(environmentalScore);

        const overallScore =
          availableScores.length > 0
            ? Math.round(
                availableScores.reduce((sum, score) => sum + score, 0) /
                  availableScores.length,
              )
            : 50; // Default if no scores available

        // Extract nutrition facts
        const nutritionFacts = {
          calories:
            product.nutriments?.energy_kcal ||
            product.nutriments?.energy_value ||
            0,
          protein: product.nutriments?.proteins || 0,
          carbs: product.nutriments?.carbohydrates || 0,
          fat: product.nutriments?.fat || 0,
          fiber: product.nutriments?.fiber || 0,
          sugar: product.nutriments?.sugars || 0,
          sodium: product.nutriments?.sodium || 0,
        };

        // Extract ingredients
        const ingredients =
          product.ingredients_text_en || product.ingredients_text || "";

        // Extract allergens
        const allergens =
          product.allergens_tags?.map((tag) => {
            return tag.replace("en:", "").split("_").join(" ");
          }) || [];

        // Extract additional product information
        const additionalInfo = {
          storage:
            product.storage_conditions || product.conservation_conditions || "",
          manufacturer: product.brands || "",
          contactInfo: product.contact || "",
          countryOfOrigin: product.countries || "",
          quantity: product.quantity || product.product_quantity || "",
          certifications:
            product.labels_tags?.map((tag) =>
              tag.replace("en:", "").split("_").join(" "),
            ) || [],
          cookingInstructions: product.preparation || "",
        };

        // Create product object with all necessary data
        const processedProduct = {
          name: product.product_name || "Unknown Product",
          image:
            product.image_url ||
            product.image_front_url ||
            product.selected_images?.front?.display?.url ||
            "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80",
          overallScore: {
            score: overallScore,
            color:
              overallScore >= 80
                ? "bg-green-500"
                : overallScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500",
            label:
              overallScore >= 80
                ? "Excellent"
                : overallScore >= 60
                  ? "Good"
                  : "Poor",
          },
          nutritionScore: {
            score: nutritionScore,
            color:
              nutritionScore >= 80
                ? "bg-green-500"
                : nutritionScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500",
            label: nutriscoreGrade
              ? `Nutri-Score ${nutriscoreGrade.toUpperCase()}`
              : "Not Available",
            available: !!nutriscoreGrade,
          },
          processingScore: {
            score: processingScore,
            color:
              processingScore >= 80
                ? "bg-green-500"
                : processingScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500",
            label: novaGroup ? `NOVA Group ${novaGroup}` : "Not Available",
            available: !!novaGroup,
          },
          environmentalScore: {
            score: environmentalScore,
            color:
              environmentalScore >= 80
                ? "bg-green-500"
                : environmentalScore >= 60
                  ? "bg-yellow-500"
                  : "bg-red-500",
            label: ecoScore
              ? `Eco-Score ${ecoScore.toUpperCase()}`
              : "Not Available",
            available: !!ecoScore,
          },
          nutritionFacts,
          ingredients,
          allergens,
          additionalInfo,
          barcode,
        };

        // Update state with the processed product data
        setScannedProduct(processedProduct);
        setShowProductDetails(true);
      } else {
        // Product not found
        toast({
          variant: "destructive",
          title: "Product Not Found",
          description: "We couldn't find this product in our database.",
          action: <ToastAction altText="Try Again">Try Again</ToastAction>,
        });
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch product information.",
        action: <ToastAction altText="Try Again">Try Again</ToastAction>,
      });
    } finally {
      setIsLoading(false);
      setShowScanner(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              NutriScan
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                alt="User"
              />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        {/* Scanner Button - Hide when showing product details */}
        {!showProductDetails && (
          <>
            <div className="mb-8 flex justify-center">
              <Button
                className="h-24 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                onClick={() => setShowScanner(true)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-10 w-10 animate-spin" />
                ) : (
                  <Camera className="h-10 w-10" />
                )}
                <span className="sr-only">Scan Food</span>
              </Button>
            </div>
            <h2 className="mb-2 text-center text-lg font-medium">
              Scan Food Label
            </h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Point your camera at a barcode to analyze the product
            </p>
          </>
        )}

        {showScanner && (
          <BarcodeScanner
            onDetected={handleBarcodeDetected}
            onClose={() => setShowScanner(false)}
          />
        )}

        {/* Product Details */}
        {showProductDetails && scannedProduct && (
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 z-10"
              onClick={() => setShowProductDetails(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <NutritionAnalysis
              foodName={scannedProduct.name}
              foodImage={scannedProduct.image}
              overallScore={scannedProduct.overallScore}
              nutritionScore={scannedProduct.nutritionScore}
              processingScore={scannedProduct.processingScore}
              environmentalScore={scannedProduct.environmentalScore}
              nutritionFacts={scannedProduct.nutritionFacts}
              ingredients={scannedProduct.ingredients}
              allergens={scannedProduct.allergens}
              barcode={scannedProduct.barcode}
              additionalInfo={scannedProduct.additionalInfo}
              onAddToJournal={() => {}} // This is now handled in NutritionAnalysis component
              onViewAlternatives={() => {
                toast({
                  title: "Feature Coming Soon",
                  description:
                    "Alternative product suggestions will be available in a future update.",
                });
              }}
              onScanAnother={() => {
                setShowProductDetails(false);
                setShowScanner(true);
              }}
            />
          </div>
        )}

        {/* Recent Food Entries */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Recent Food Entries</h2>
          <div className="space-y-4">
            {recentFoods.map((food) => (
              <Card key={food.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">{food.name}</h3>
                    <p className="text-sm text-muted-foreground">{food.time}</p>
                  </div>
                  <div
                    className={`text-lg font-bold ${getScoreColor(food.score)}`}
                  >
                    {food.score}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Nutrition Scores */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">
            Today's Nutrition Summary
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nutrition Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Overall</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(nutritionScores.overall)}`}
                  >
                    {nutritionScores.overall}
                  </span>
                </div>
                <Progress value={nutritionScores.overall} className="h-2" />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Nutrition</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(nutritionScores.nutrition)}`}
                  >
                    {nutritionScores.nutrition}
                  </span>
                </div>
                <Progress value={nutritionScores.nutrition} className="h-2" />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Ingredients</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(nutritionScores.ingredients)}`}
                  >
                    {nutritionScores.ingredients}
                  </span>
                </div>
                <Progress value={nutritionScores.ingredients} className="h-2" />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Processing</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(nutritionScores.processing)}`}
                  >
                    {nutritionScores.processing}
                  </span>
                </div>
                <Progress value={nutritionScores.processing} className="h-2" />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium">Caloric</span>
                  <span
                    className={`text-sm font-bold ${getScoreColor(nutritionScores.caloric)}`}
                  >
                    {nutritionScores.caloric}
                  </span>
                </div>
                <Progress value={nutritionScores.caloric} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Version info */}
      <div className="text-center py-2 text-xs text-muted-foreground">
        <p>Version 1.0.5 - 2023-06-15 17:00:00</p>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-sm shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
        <div className="container flex h-16 items-center justify-around">
          <Link to="/" className="flex flex-col items-center">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Camera className="h-5 w-5" />
            </Button>
            <span className="text-xs">Scan</span>
          </Link>

          <Link to="/journal" className="flex flex-col items-center">
            <Button variant="ghost" size="icon" className="h-10 w-10 relative">
              <BookOpen className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </span>
            </Button>
            <span className="text-xs">Journal</span>
          </Link>

          <Link to="/planning" className="flex flex-col items-center">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Calendar className="h-5 w-5" />
            </Button>
            <span className="text-xs">Planning</span>
          </Link>

          <Link to="/profile" className="flex flex-col items-center">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <User className="h-5 w-5" />
            </Button>
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default HomePage;
