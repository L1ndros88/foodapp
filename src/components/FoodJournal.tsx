import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";

interface FoodEntry {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  scores: {
    overall: number;
    nutrition: number;
    ingredients: number;
    processing: number;
    caloric: number;
  };
  image?: string;
}

interface MealGroup {
  title: string;
  entries: FoodEntry[];
}

const FoodJournal = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("all");

  // Mock data for food journal entries
  const mockMeals: MealGroup[] = [
    {
      title: "Breakfast",
      entries: [
        {
          id: "1",
          name: "Greek Yogurt with Berries",
          time: "8:30 AM",
          calories: 220,
          protein: 15,
          carbs: 25,
          fat: 8,
          scores: {
            overall: 85,
            nutrition: 90,
            ingredients: 95,
            processing: 80,
            caloric: 75,
          },
          image:
            "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=300&q=80",
        },
        {
          id: "2",
          name: "Whole Grain Toast",
          time: "8:30 AM",
          calories: 120,
          protein: 4,
          carbs: 22,
          fat: 2,
          scores: {
            overall: 75,
            nutrition: 70,
            ingredients: 85,
            processing: 65,
            caloric: 80,
          },
          image:
            "https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=300&q=80",
        },
      ],
    },
    {
      title: "Lunch",
      entries: [
        {
          id: "3",
          name: "Grilled Chicken Salad",
          time: "12:45 PM",
          calories: 350,
          protein: 30,
          carbs: 15,
          fat: 18,
          scores: {
            overall: 90,
            nutrition: 95,
            ingredients: 90,
            processing: 85,
            caloric: 85,
          },
          image:
            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80",
        },
      ],
    },
    {
      title: "Dinner",
      entries: [
        {
          id: "4",
          name: "Salmon with Roasted Vegetables",
          time: "7:00 PM",
          calories: 420,
          protein: 35,
          carbs: 25,
          fat: 22,
          scores: {
            overall: 95,
            nutrition: 95,
            ingredients: 100,
            processing: 90,
            caloric: 80,
          },
          image:
            "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&q=80",
        },
      ],
    },
    {
      title: "Snacks",
      entries: [
        {
          id: "5",
          name: "Apple",
          time: "3:30 PM",
          calories: 80,
          protein: 0,
          carbs: 21,
          fat: 0,
          scores: {
            overall: 85,
            nutrition: 80,
            ingredients: 100,
            processing: 100,
            caloric: 75,
          },
          image:
            "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&q=80",
        },
        {
          id: "6",
          name: "Mixed Nuts",
          time: "5:15 PM",
          calories: 170,
          protein: 6,
          carbs: 5,
          fat: 15,
          scores: {
            overall: 80,
            nutrition: 85,
            ingredients: 90,
            processing: 75,
            caloric: 65,
          },
          image:
            "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&q=80",
        },
      ],
    },
  ];

  // Calculate daily totals
  const dailyTotals = mockMeals.reduce(
    (acc, meal) => {
      meal.entries.forEach((entry) => {
        acc.calories += entry.calories;
        acc.protein += entry.protein;
        acc.carbs += entry.carbs;
        acc.fat += entry.fat;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  // Calculate average scores
  const allEntries = mockMeals.flatMap((meal) => meal.entries);
  const averageScores = allEntries.reduce(
    (acc, entry) => {
      acc.overall += entry.scores.overall;
      acc.nutrition += entry.scores.nutrition;
      acc.ingredients += entry.scores.ingredients;
      acc.processing += entry.scores.processing;
      acc.caloric += entry.scores.caloric;
      return acc;
    },
    { overall: 0, nutrition: 0, ingredients: 0, processing: 0, caloric: 0 },
  );

  Object.keys(averageScores).forEach((key) => {
    averageScores[key as keyof typeof averageScores] = Math.round(
      averageScores[key as keyof typeof averageScores] / allEntries.length,
    );
  });

  // Filter meals based on active tab
  const filteredMeals =
    activeTab === "all"
      ? mockMeals
      : mockMeals.filter((meal) => meal.title.toLowerCase() === activeTab);

  // Function to get score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-background p-6 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Version info */}
        <div className="text-right mb-2">
          <p className="text-xs text-muted-foreground">
            Version 1.0.2 - 2023-06-15 14:30:00
          </p>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Food Journal</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(selectedDate, "MMMM d, yyyy")}
            </Button>
            <Button>Add Entry</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Calories</span>
                  <span className="font-medium">
                    {dailyTotals.calories} kcal
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Protein</span>
                  <span className="font-medium">{dailyTotals.protein}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Carbs</span>
                  <span className="font-medium">{dailyTotals.carbs}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fat</span>
                  <span className="font-medium">{dailyTotals.fat}g</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Nutrition Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Overall</span>
                    <span>{averageScores.overall}/100</span>
                  </div>
                  <Progress
                    value={averageScores.overall}
                    className={getScoreColor(averageScores.overall)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Nutrition</span>
                      <span>{averageScores.nutrition}/100</span>
                    </div>
                    <Progress
                      value={averageScores.nutrition}
                      className={getScoreColor(averageScores.nutrition)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Ingredients</span>
                      <span>{averageScores.ingredients}/100</span>
                    </div>
                    <Progress
                      value={averageScores.ingredients}
                      className={getScoreColor(averageScores.ingredients)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Processing</span>
                      <span>{averageScores.processing}/100</span>
                    </div>
                    <Progress
                      value={averageScores.processing}
                      className={getScoreColor(averageScores.processing)}
                    />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Caloric</span>
                      <span>{averageScores.caloric}/100</span>
                    </div>
                    <Progress
                      value={averageScores.caloric}
                      className={getScoreColor(averageScores.caloric)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
            <TabsTrigger value="lunch">Lunch</TabsTrigger>
            <TabsTrigger value="dinner">Dinner</TabsTrigger>
            <TabsTrigger value="snacks">Snacks</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6">
            {filteredMeals.map((mealGroup, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{mealGroup.title}</h2>
                  <Button variant="ghost" size="sm">
                    Add to {mealGroup.title}
                  </Button>
                </div>
                <div className="space-y-4">
                  {mealGroup.entries.map((entry) => (
                    <Card key={entry.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {entry.image ? (
                            <Avatar className="h-16 w-16 rounded-md">
                              <AvatarImage
                                src={entry.image}
                                alt={entry.name}
                                className="object-cover"
                              />
                              <AvatarFallback className="rounded-md">
                                {entry.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <Avatar className="h-16 w-16 rounded-md">
                              <AvatarFallback className="rounded-md">
                                {entry.name.substring(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium">{entry.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {entry.time}
                                </p>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                {entry.calories} kcal
                              </Badge>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2">
                              <div className="text-xs">
                                <span className="text-muted-foreground">
                                  Protein:
                                </span>{" "}
                                {entry.protein}g
                              </div>
                              <div className="text-xs">
                                <span className="text-muted-foreground">
                                  Carbs:
                                </span>{" "}
                                {entry.carbs}g
                              </div>
                              <div className="text-xs">
                                <span className="text-muted-foreground">
                                  Fat:
                                </span>{" "}
                                {entry.fat}g
                              </div>
                            </div>
                            <div className="mt-3 flex items-center gap-2">
                              <div className="flex items-center">
                                <span className="text-xs mr-1">Score:</span>
                                <Badge
                                  className={`${getScoreColor(entry.scores.overall)} text-white`}
                                >
                                  {entry.scores.overall}
                                </Badge>
                              </div>
                              <Separator
                                orientation="vertical"
                                className="h-4"
                              />
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                >
                                  Details
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FoodJournal;
