import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Camera,
  User,
  Heart,
  AlertCircle,
  Weight,
  ChevronDown,
  Save,
  X,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface UserProfileProps {
  isPremium?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ isPremium = false }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([
    "Peanuts",
  ]);
  const [selectedDiets, setSelectedDiets] = useState<string[]>(["Low Carb"]);

  const allergies = [
    "Peanuts",
    "Tree Nuts",
    "Milk",
    "Eggs",
    "Fish",
    "Shellfish",
    "Soy",
    "Wheat",
    "Gluten",
  ];

  const dietaryPreferences = [
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Keto",
    "Paleo",
    "Low Carb",
    "Low Fat",
    "Mediterranean",
    "Gluten Free",
  ];

  const healthGoals = [
    "Weight Loss",
    "Weight Gain",
    "Maintain Weight",
    "Build Muscle",
    "Improve Energy",
    "Better Sleep",
    "Reduce Inflammation",
  ];

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const toggleDiet = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter((d) => d !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">User Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isPremium ? (
              <Badge
                variant="default"
                className="bg-amber-500 hover:bg-amber-600"
              >
                Premium
              </Badge>
            ) : (
              <Badge variant="outline" className="cursor-pointer">
                Upgrade to Premium
              </Badge>
            )}
            <Avatar className="h-12 w-12">
              <AvatarImage
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                alt="User"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Tabs
          defaultValue="personal"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <Heart size={16} />
              <span className="hidden sm:inline">Health Goals</span>
            </TabsTrigger>
            <TabsTrigger value="dietary" className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span className="hidden sm:inline">Dietary</span>
            </TabsTrigger>
            <TabsTrigger value="biometric" className="flex items-center gap-2">
              <Weight size={16} />
              <span className="hidden sm:inline">Biometrics</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        defaultValue="John Doe"
                      />
                    </div>
                    <div className="w-full md:w-1/2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        defaultValue="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-1/2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" defaultValue="1990-01-01" />
                    </div>
                    <div className="w-full md:w-1/2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select defaultValue="male">
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="profile-picture">Profile Picture</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
                          alt="User"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Camera size={16} />
                        Change Picture
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive updates about your nutrition
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">App Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Toggle dark mode theme
                      </p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="health" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Health Goals</CardTitle>
                  <CardDescription>
                    Set your health and nutrition goals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="mb-2 block">Primary Goal</Label>
                    <Select defaultValue="weight-loss">
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight-loss">Weight Loss</SelectItem>
                        <SelectItem value="weight-gain">Weight Gain</SelectItem>
                        <SelectItem value="maintain">
                          Maintain Weight
                        </SelectItem>
                        <SelectItem value="muscle">Build Muscle</SelectItem>
                        <SelectItem value="energy">Improve Energy</SelectItem>
                        <SelectItem value="sleep">Better Sleep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="mb-2 block">Additional Goals</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {healthGoals.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox id={`goal-${goal}`} />
                          <Label htmlFor={`goal-${goal}`}>{goal}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Activity Level</Label>
                    <Select defaultValue="moderate">
                      <SelectTrigger>
                        <SelectValue placeholder="Select your activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">
                          Sedentary (little or no exercise)
                        </SelectItem>
                        <SelectItem value="light">
                          Lightly active (light exercise 1-3 days/week)
                        </SelectItem>
                        <SelectItem value="moderate">
                          Moderately active (moderate exercise 3-5 days/week)
                        </SelectItem>
                        <SelectItem value="active">
                          Active (hard exercise 6-7 days/week)
                        </SelectItem>
                        <SelectItem value="very-active">
                          Very active (very hard exercise & physical job)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {isPremium && (
                    <div>
                      <Label className="mb-2 block">Daily Calorie Target</Label>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>1500 kcal</span>
                          <span>2500 kcal</span>
                        </div>
                        <Slider
                          defaultValue={[2000]}
                          max={3000}
                          min={1000}
                          step={50}
                        />
                        <div className="text-center font-medium">2000 kcal</div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset</Button>
                  <Button>Save Goals</Button>
                </CardFooter>
              </Card>

              {isPremium && (
                <Card>
                  <CardHeader>
                    <CardTitle>Goal Progress</CardTitle>
                    <CardDescription>
                      Track your progress towards your goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Weight Loss</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Protein Intake
                        </span>
                        <span className="text-sm font-medium">80%</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Activity Goals
                        </span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="dietary" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dietary Preferences</CardTitle>
                  <CardDescription>
                    Set your dietary preferences and restrictions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Diet Types</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {dietaryPreferences.map((diet) => (
                        <div
                          key={diet}
                          className={`flex items-center justify-between p-3 rounded-md border cursor-pointer ${selectedDiets.includes(diet) ? "bg-primary/10 border-primary" : "bg-background"}`}
                          onClick={() => toggleDiet(diet)}
                        >
                          <span>{diet}</span>
                          {selectedDiets.includes(diet) && (
                            <Check size={16} className="text-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Allergies & Intolerances
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {allergies.map((allergy) => (
                        <div
                          key={allergy}
                          className={`flex items-center justify-between p-3 rounded-md border cursor-pointer ${selectedAllergies.includes(allergy) ? "bg-destructive/10 border-destructive" : "bg-background"}`}
                          onClick={() => toggleAllergy(allergy)}
                        >
                          <span>{allergy}</span>
                          {selectedAllergies.includes(allergy) && (
                            <X size={16} className="text-destructive" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {isPremium && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        Ingredient Preferences
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">
                              Avoid Artificial Sweeteners
                            </span>
                            <p className="text-sm text-muted-foreground">
                              Aspartame, Sucralose, etc.
                            </p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">
                              Avoid Added Sugars
                            </span>
                            <p className="text-sm text-muted-foreground">
                              High-fructose corn syrup, etc.
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">
                              Avoid Preservatives
                            </span>
                            <p className="text-sm text-muted-foreground">
                              BHA, BHT, Nitrates, etc.
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset</Button>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>

              {isPremium && (
                <Card>
                  <CardHeader>
                    <CardTitle>Ethical & Sustainability Preferences</CardTitle>
                    <CardDescription>
                      Set your ethical and sustainability preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          Prefer Organic Products
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Prioritize organic certified foods
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">
                          Prefer Local Products
                        </span>
                        <p className="text-sm text-muted-foreground">
                          Prioritize locally sourced foods
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Avoid Palm Oil</span>
                        <p className="text-sm text-muted-foreground">
                          Due to environmental concerns
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="biometric" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Biometric Data</CardTitle>
                  <CardDescription>
                    Update your physical measurements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Height</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="height"
                          type="number"
                          placeholder="175"
                          defaultValue="175"
                        />
                        <Select defaultValue="cm">
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cm">cm</SelectItem>
                            <SelectItem value="ft">ft/in</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          defaultValue="70"
                        />
                        <Select defaultValue="kg">
                          <SelectTrigger className="w-24">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="lb">lb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      defaultValue="30"
                    />
                  </div>

                  {isPremium && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="body-fat">Body Fat %</Label>
                          <Input
                            id="body-fat"
                            type="number"
                            placeholder="20"
                            defaultValue="20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="waist">Waist Circumference</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="waist"
                              type="number"
                              placeholder="80"
                              defaultValue="80"
                            />
                            <Select defaultValue="cm">
                              <SelectTrigger className="w-24">
                                <SelectValue placeholder="Unit" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cm">cm</SelectItem>
                                <SelectItem value="in">in</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          Health Metrics
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="blood-pressure">
                              Blood Pressure
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="blood-pressure-sys"
                                type="number"
                                placeholder="120"
                                defaultValue="120"
                              />
                              <span>/</span>
                              <Input
                                id="blood-pressure-dia"
                                type="number"
                                placeholder="80"
                                defaultValue="80"
                              />
                              <span>mmHg</span>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="resting-heart-rate">
                              Resting Heart Rate
                            </Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id="resting-heart-rate"
                                type="number"
                                placeholder="65"
                                defaultValue="65"
                              />
                              <span>bpm</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset</Button>
                  <Button>Save Measurements</Button>
                </CardFooter>
              </Card>

              {isPremium && (
                <Card>
                  <CardHeader>
                    <CardTitle>Biometric History</CardTitle>
                    <CardDescription>
                      Track changes in your measurements over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border rounded-md">
                      <p className="text-muted-foreground">
                        Chart showing biometric history would appear here
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
};

// Missing Check component for the dietary preferences section
const Check = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
};

export default UserProfile;
