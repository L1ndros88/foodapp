import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Info,
  Leaf,
  ShoppingBag,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { NutritionScore, NutritionFacts, AdditionalInfo } from "@/lib/types";

interface NutritionAnalysisProps {
  foodName?: string;
  foodImage?: string;
  overallScore?: NutritionScore;
  nutritionScore?: NutritionScore;
  processingScore?: NutritionScore;
  environmentalScore?: NutritionScore;
  nutritionFacts?: NutritionFacts;
  ingredients?: string | string[];
  allergens?: string[];
  isPremium?: boolean;
  barcode?: string;
  additionalInfo?: AdditionalInfo;
  onAddToJournal?: () => void;
  onViewAlternatives?: () => void;
  onScanAnother?: () => void;
}

const NutritionAnalysis: React.FC<NutritionAnalysisProps> = ({
  foodName = "Organic Greek Yogurt",
  foodImage = "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80",
  overallScore = { score: 85, color: "bg-green-500", label: "Excellent" },
  nutritionScore = {
    score: 90,
    color: "bg-green-500",
    label: "Excellent",
    available: true,
  },
  processingScore = {
    score: 75,
    color: "bg-yellow-500",
    label: "Moderate",
    available: true,
  },
  environmentalScore = {
    score: 85,
    color: "bg-green-500",
    label: "Good",
    available: true,
  },
  nutritionFacts = {
    calories: 120,
    protein: 15,
    carbs: 8,
    fat: 5,
    fiber: 0,
    sugar: 6,
    sodium: 65,
  },
  ingredients = [
    "Organic Milk",
    "Live Active Cultures",
    "Vitamin D",
    "Natural Flavors",
  ],
  allergens = ["Milk"],
  isPremium = false,
  barcode,
  additionalInfo,
  onAddToJournal = () => {},
  onViewAlternatives = () => {},
  onScanAnother = () => {},
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showAddToJournalDialog, setShowAddToJournalDialog] = useState(false);
  const [mealType, setMealType] = useState("breakfast");
  const [servingSize, setServingSize] = useState("1");
  const [servingUnit, setServingUnit] = useState("serving");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Moderate";
    return "Poor";
  };

  const handleAddToJournal = async () => {
    setIsSubmitting(true);
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to add items to your journal",
          variant: "destructive",
        });
        return;
      }

      // First, save the food item
      const { data: foodItem, error: foodItemError } = await supabase
        .from("food_items")
        .insert({
          user_id: user.id,
          name: foodName,
          barcode: barcode,
          image_url: foodImage,
          calories: nutritionFacts?.calories,
          protein: nutritionFacts?.protein,
          carbs: nutritionFacts?.carbs,
          fat: nutritionFacts?.fat,
          fiber: nutritionFacts?.fiber,
          sugar: nutritionFacts?.sugar,
          sodium: nutritionFacts?.sodium,
          ingredients:
            typeof ingredients === "string"
              ? ingredients
              : ingredients?.join(", "),
          allergens: allergens,
          overall_score: overallScore?.score,
          nutrition_score: nutritionScore?.score,
          processing_score: processingScore?.score,
          environmental_score: environmentalScore?.score,
        })
        .select("id")
        .single();

      if (foodItemError) {
        throw new Error(foodItemError.message);
      }

      // Then, create the journal entry
      const { error: journalError } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          food_item_id: foodItem.id,
          meal_type: mealType,
          serving_size: parseFloat(servingSize),
          serving_unit: servingUnit,
          consumed_at: new Date().toISOString(),
          notes: notes,
        });

      if (journalError) {
        throw new Error(journalError.message);
      }

      toast({
        title: "Added to Journal",
        description: `${foodName} has been added to your food journal.`,
      });

      setShowAddToJournalDialog(false);

      // Navigate to journal page after a short delay
      setTimeout(() => {
        navigate("/journal");
      }, 1000);
    } catch (error) {
      console.error("Error adding to journal:", error);
      toast({
        title: "Error",
        description: `Failed to add item to journal: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background w-full min-h-screen p-4 md:p-6">
      {/* Version info */}
      <div className="text-right mb-2">
        <p className="text-xs text-muted-foreground">
          Version 1.0.5 - 2023-06-15 17:00:00
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl font-bold">{foodName}</CardTitle>
                <CardDescription>Nutrition Analysis Results</CardDescription>
                {barcode && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
                      Barcode: {barcode}
                    </span>
                    <a
                      href={`https://world.openfoodfacts.org/product/${barcode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      View on Open Food Facts
                    </a>
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden">
                <img
                  src={foodImage}
                  alt={foodName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Overall Score */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Overall Score</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    {overallScore.score}
                  </span>
                  <Badge className={overallScore.color + " text-white"}>
                    {overallScore.label}
                  </Badge>
                </div>
              </div>
              <Progress
                value={overallScore.score}
                className={`h-2 ${overallScore.color}`}
              />
            </div>

            <Separator className="my-4" />

            {/* Score Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {nutritionScore.available && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Nutrition</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">
                        {nutritionScore.score}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${nutritionScore.color}`}
                      ></div>
                    </div>
                  </div>
                  <Progress
                    value={nutritionScore.score}
                    className={`h-1.5 ${nutritionScore.color}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {nutritionScore.label}
                  </p>
                </div>
              )}

              {processingScore.available && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Processing</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">
                        {processingScore.score}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${processingScore.color}`}
                      ></div>
                    </div>
                  </div>
                  <Progress
                    value={processingScore.score}
                    className={`h-1.5 ${processingScore.color}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {processingScore.label}
                  </p>
                </div>
              )}

              {environmentalScore.available && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      Environmental Impact
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">
                        {environmentalScore.score}
                      </span>
                      <div
                        className={`w-3 h-3 rounded-full ${environmentalScore.color}`}
                      ></div>
                    </div>
                  </div>
                  <Progress
                    value={environmentalScore.score}
                    className={`h-1.5 ${environmentalScore.color}`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {environmentalScore.label}
                  </p>
                </div>
              )}

              {!nutritionScore.available &&
                !processingScore.available &&
                !environmentalScore.available && (
                  <div className="col-span-2 p-3 bg-muted rounded-md text-center">
                    <p className="text-muted-foreground">
                      No scoring information available for this product
                    </p>
                  </div>
                )}
            </div>

            {/* Basic Nutrition Facts */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Nutrition Facts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Calories</div>
                  <div className="text-xl font-bold">
                    {nutritionFacts.calories}
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Protein</div>
                  <div className="text-xl font-bold">
                    {nutritionFacts.protein}g
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Carbs</div>
                  <div className="text-xl font-bold">
                    {nutritionFacts.carbs}g
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-sm text-muted-foreground">Fat</div>
                  <div className="text-xl font-bold">{nutritionFacts.fat}g</div>
                </div>
              </div>
            </div>

            {/* Allergens */}
            {allergens.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-semibold">Allergens</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {allergens.map((allergen, index) => (
                    <Badge key={index} variant="destructive">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients List */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
              <p className="text-sm text-muted-foreground">
                {typeof ingredients === "string"
                  ? ingredients
                  : ingredients.join(", ")}
              </p>
            </div>

            {/* Additional Product Information */}
            {additionalInfo && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Product Information
                </h3>
                <div className="space-y-3">
                  {additionalInfo.quantity && (
                    <div>
                      <h4 className="text-sm font-medium">Quantity</h4>
                      <p className="text-sm text-muted-foreground">
                        {additionalInfo.quantity}
                      </p>
                    </div>
                  )}

                  {additionalInfo.storage && (
                    <div>
                      <h4 className="text-sm font-medium">
                        Storage Instructions
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {additionalInfo.storage}
                      </p>
                    </div>
                  )}

                  {additionalInfo.cookingInstructions && (
                    <div>
                      <h4 className="text-sm font-medium">
                        Cooking Instructions
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {additionalInfo.cookingInstructions}
                      </p>
                    </div>
                  )}

                  {additionalInfo.manufacturer && (
                    <div>
                      <h4 className="text-sm font-medium">Manufacturer</h4>
                      <p className="text-sm text-muted-foreground">
                        {additionalInfo.manufacturer}
                      </p>
                    </div>
                  )}

                  {additionalInfo.contactInfo && (
                    <div>
                      <h4 className="text-sm font-medium">
                        Contact Information
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {additionalInfo.contactInfo}
                      </p>
                    </div>
                  )}

                  {additionalInfo.countryOfOrigin && (
                    <div>
                      <h4 className="text-sm font-medium">Country of Origin</h4>
                      <p className="text-sm text-muted-foreground">
                        {additionalInfo.countryOfOrigin}
                      </p>
                    </div>
                  )}

                  {additionalInfo.certifications &&
                    additionalInfo.certifications.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium">Certifications</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {additionalInfo.certifications.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Premium Features Teaser */}
            {!isPremium && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">Unlock Premium Features</h3>
                </div>
                <p className="text-sm mb-3">
                  Get detailed nutrition breakdowns, personalized
                  recommendations, and more with our premium plan.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-gray-800"
                >
                  Learn More
                </Button>
              </div>
            )}

            {/* Advanced Details (Premium) */}
            {isPremium && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(!showDetails)}
                  className="w-full flex items-center justify-between"
                >
                  <span>Advanced Nutrition Details</span>
                  {showDetails ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showDetails && (
                  <div className="mt-4 border rounded-md p-4">
                    <Tabs defaultValue="macros">
                      <TabsList className="w-full grid grid-cols-3">
                        <TabsTrigger value="macros">Macronutrients</TabsTrigger>
                        <TabsTrigger value="vitamins">Vitamins</TabsTrigger>
                        <TabsTrigger value="minerals">Minerals</TabsTrigger>
                      </TabsList>
                      <TabsContent value="macros" className="mt-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="protein">
                            <AccordionTrigger>Protein Details</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Complete Protein</span>
                                  <span>Yes</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Essential Amino Acids</span>
                                  <span>All 9 present</span>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="carbs">
                            <AccordionTrigger>
                              Carbohydrate Details
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Fiber</span>
                                  <span>{nutritionFacts.fiber}g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Sugar</span>
                                  <span>{nutritionFacts.sugar}g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Added Sugar</span>
                                  <span>0g</span>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                          <AccordionItem value="fats">
                            <AccordionTrigger>Fat Details</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Saturated Fat</span>
                                  <span>3.5g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Unsaturated Fat</span>
                                  <span>1.5g</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Trans Fat</span>
                                  <span>0g</span>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TabsContent>
                      <TabsContent value="vitamins" className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between items-center">
                            <span>Vitamin D</span>
                            <Badge className="bg-green-500">20% DV</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Vitamin B12</span>
                            <Badge className="bg-green-500">15% DV</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Vitamin A</span>
                            <Badge className="bg-yellow-500">5% DV</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Vitamin C</span>
                            <Badge className="bg-red-500">0% DV</Badge>
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="minerals" className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex justify-between items-center">
                            <span>Calcium</span>
                            <Badge className="bg-green-500">25% DV</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Potassium</span>
                            <Badge className="bg-yellow-500">8% DV</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Sodium</span>
                            <Badge className="bg-green-500">
                              {nutritionFacts.sodium}mg (3% DV)
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Iron</span>
                            <Badge className="bg-red-500">0% DV</Badge>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Dialog
              open={showAddToJournalDialog}
              onOpenChange={setShowAddToJournalDialog}
            >
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Journal
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add to Food Journal</DialogTitle>
                  <DialogDescription>
                    Add {foodName} to your food journal. Select meal type and
                    serving information.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="meal-type" className="text-right">
                      Meal
                    </Label>
                    <Select value={mealType} onValueChange={setMealType}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="serving-size" className="text-right">
                      Serving
                    </Label>
                    <Input
                      id="serving-size"
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={servingSize}
                      onChange={(e) => setServingSize(e.target.value)}
                      className="col-span-1"
                    />
                    <Select
                      value={servingUnit}
                      onValueChange={setServingUnit}
                      className="col-span-2"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="serving">serving</SelectItem>
                        <SelectItem value="g">grams</SelectItem>
                        <SelectItem value="oz">ounces</SelectItem>
                        <SelectItem value="cup">cups</SelectItem>
                        <SelectItem value="tbsp">tablespoons</SelectItem>
                        <SelectItem value="tsp">teaspoons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Time
                    </Label>
                    <div className="col-span-3 flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Now</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Input
                      id="notes"
                      placeholder="Optional notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddToJournalDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddToJournal}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    {isSubmitting ? "Adding..." : "Add to Journal"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={onViewAlternatives}
              className="w-full sm:w-auto border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 dark:border-indigo-800 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
            >
              <Leaf className="mr-2 h-4 w-4" /> View Alternatives
            </Button>
            <Button
              variant="secondary"
              onClick={onScanAnother}
              className="w-full sm:w-auto bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 dark:from-gray-800 dark:to-gray-700 dark:hover:from-gray-700 dark:hover:to-gray-600"
            >
              <ArrowRight className="mr-2 h-4 w-4" /> Scan Another
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default NutritionAnalysis;
