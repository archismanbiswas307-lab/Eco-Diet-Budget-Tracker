import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { 
  Wallet, Utensils, TrendingDown, RefreshCw, 
  ChevronRight, Plus, Settings, AlertCircle,
  CheckCircle2, DollarSign, Leaf, ExternalLink, ShoppingCart,
  Tag, Activity, User, Heart
} from "lucide-react";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MOCK_VEGETABLES, BUDGET_RESOURCES } from "./lib/constants";
import { generateDietPlan } from "./lib/gemini";
import { Transaction, DietPlan, UserProfile, HealthProfile } from "./types";
import { motion, AnimatePresence } from "motion/react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Archisman",
    monthlyBudget: 15000,
    dietaryPreferences: ["Vegetarian", "High Protein", "Indian Cuisine"],
    nutritionalGoals: {
      calories: 2200
    },
    useHealthMetrics: false,
    healthProfile: {
      age: 25,
      gender: "male",
      weight: 70,
      height: 175,
      activityLevel: "moderate"
    }
  });

  const calculateHealthMetrics = (profile: HealthProfile) => {
    const { age, gender, weight, height, activityLevel } = profile;
    const bmi = weight / ((height / 100) ** 2);
    let bmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === "male") bmr += 5;
    else bmr -= 161;
    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const tdee = bmr * activityFactors[activityLevel];
    return { bmi, bmr, tdee };
  };

  useEffect(() => {
    if (userProfile.healthProfile) {
      const metrics = calculateHealthMetrics(userProfile.healthProfile);
      setUserProfile(prev => ({
        ...prev,
        healthProfile: { ...prev.healthProfile!, ...metrics }
      }));
    }
  }, [
    userProfile.healthProfile?.age,
    userProfile.healthProfile?.gender,
    userProfile.healthProfile?.weight,
    userProfile.healthProfile?.height,
    userProfile.healthProfile?.activityLevel
  ]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data.transactions);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    try {
      const plan = await generateDietPlan(
        userProfile.monthlyBudget,
        userProfile.dietaryPreferences,
        userProfile.nutritionalGoals,
        MOCK_VEGETABLES,
        userProfile.useHealthMetrics ? userProfile.healthProfile : undefined
      );
      setDietPlan(plan);
    } catch (error) {
      console.error("Failed to generate diet plan:", error);
    } finally {
      setLoading(false);
    }
  };

  const grocerySpending = transactions
    .filter(t => t.category?.includes("Groceries"))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpending = transactions.reduce((acc, t) => acc + t.amount, 0);

  const spendingData = [
    { name: "Groceries", value: grocerySpending },
    { name: "Other", value: totalSpending - grocerySpending },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">EcoDiet</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Budget: ₹{userProfile.monthlyBudget?.toLocaleString('en-IN')}
            </Badge>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5 text-slate-500" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex items-center justify-between">
            <TabsList className="bg-slate-100 p-1">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-white">
                <Wallet className="w-4 h-4 mr-2" /> Dashboard
              </TabsTrigger>
              <TabsTrigger value="planner" className="data-[state=active]:bg-white">
                <Utensils className="w-4 h-4 mr-2" /> Diet Planner
              </TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-white">
                <Heart className="w-4 h-4 mr-2" /> Health Profile
              </TabsTrigger>
              <TabsTrigger value="bank" className="data-[state=active]:bg-white">
                <RefreshCw className="w-4 h-4 mr-2" /> Bank Sync
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "bank" && (
              <Button onClick={fetchTransactions} disabled={loading} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Sync Now
              </Button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="dashboard" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardDescription>Total Spent (MTD)</CardDescription>
                      <CardTitle className="text-3xl font-bold">₹{totalSpending?.toLocaleString('en-IN')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-slate-500">
                        <TrendingDown className="w-4 h-4 mr-1 text-emerald-500" />
                        8% less than last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardDescription>Grocery Budget</CardDescription>
                      <CardTitle className="text-3xl font-bold">₹{grocerySpending?.toLocaleString('en-IN')} / ₹8,000</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min((grocerySpending / 8000) * 100, 100)}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm">
                    <CardHeader className="pb-2">
                      <CardDescription>Diet Adherence</CardDescription>
                      <CardTitle className="text-3xl font-bold">85%</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm text-slate-500">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-500" />
                        On track for goals
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Spending Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={spendingData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {spendingData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Vendor</TableHead>
                              <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transactions?.slice(0, 5).map((t) => (
                              <TableRow key={t.id}>
                                <TableCell className="text-slate-500">{t.date}</TableCell>
                                <TableCell className="font-medium">{t.name}</TableCell>
                                <TableCell className="text-right font-mono">₹{t.amount?.toLocaleString('en-IN')}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-emerald-600" />
                      Budgeting & Shopping Toolkit
                    </CardTitle>
                    <CardDescription>Explore other platforms to optimize your spending and savings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {BUDGET_RESOURCES.map((resource) => (
                        <div 
                          key={resource.name} 
                          className="p-4 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer group"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 text-[10px] font-normal">
                              {resource.category}
                            </Badge>
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                          </div>
                          <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{resource.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{resource.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="planner" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1 border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Optimization Goals</CardTitle>
                      <CardDescription>Adjust your monthly targets</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Monthly Budget (₹)</label>
                        <Input 
                          type="number" 
                          value={userProfile.monthlyBudget}
                          onChange={(e) => setUserProfile({...userProfile, monthlyBudget: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Daily Calories</label>
                        <Input 
                          type="number" 
                          value={userProfile.nutritionalGoals?.calories || ""}
                          onChange={(e) => setUserProfile({...userProfile, nutritionalGoals: {...userProfile.nutritionalGoals, calories: Number(e.target.value)}})}
                        />
                      </div>
                      <div className="flex items-center space-x-2 py-2">
                        <input 
                          type="checkbox" 
                          id="useHealth"
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                          checked={userProfile.useHealthMetrics}
                          onChange={(e) => setUserProfile({...userProfile, useHealthMetrics: e.target.checked})}
                        />
                        <Label htmlFor="useHealth" className="text-sm font-medium cursor-pointer">
                          Optimize using Health Profile
                        </Label>
                      </div>
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={handleGeneratePlan}
                        disabled={loading}
                      >
                        {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Generate Optimized Plan
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {dietPlan ? "Your Optimized Monthly Plan" : "Vegetable Price Index"}
                        {dietPlan && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">AI Generated</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dietPlan ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-xl">
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Est. Monthly Cost</p>
                              <p className="text-2xl font-bold text-emerald-600">₹{dietPlan.estimatedMonthlyCost?.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-xl">
                              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Daily Calories</p>
                              <p className="text-2xl font-bold text-slate-900">{dietPlan.dailyCalories} kcal</p>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-semibold text-slate-700">Daily Meal Structure</h4>
                            {dietPlan.meals?.map((meal, idx) => (
                              <div key={idx} className="p-4 border border-slate-100 rounded-xl hover:border-emerald-200 transition-colors">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-bold text-slate-900">{meal.name}</h5>
                                    <p className="text-sm text-slate-600 mt-1">{meal.description}</p>
                                  </div>
                                </div>
                                <div className="mt-4 space-y-2">
                                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ingredients & Best Prices</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {meal.ingredients?.map((ing, i) => (
                                      <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-medium text-slate-700">{ing.name}</span>
                                          <span className="text-[10px] text-slate-500">{ing.amount}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          {ing.estimatedCost && (
                                            <span className="text-xs font-mono font-bold text-emerald-600">₹{ing.estimatedCost}</span>
                                          )}
                                          {ing.purchaseUrl && (
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-6 w-6 text-emerald-600 hover:bg-emerald-100"
                                              onClick={() => window.open(ing.purchaseUrl, '_blank')}
                                            >
                                              <ShoppingCart className="w-3 h-3" />
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                              <ShoppingCart className="w-5 h-5 text-emerald-600" />
                              Lowest Price Shopping List
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Array.from(new Set(dietPlan.meals?.flatMap(m => m.ingredients?.map(i => i.name) || []) || [])).map(name => {
                                const ingredient = dietPlan.meals?.flatMap(m => m.ingredients || [])?.find(i => i.name === name);
                                return (
                                  <div key={name} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-emerald-100">
                                    <div>
                                      <p className="font-bold text-slate-900 text-sm">{name}</p>
                                      <p className="text-xs text-slate-500">Cheapest source found</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      {ingredient?.purchaseUrl && (
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="h-8 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                          onClick={() => window.open(ingredient.purchaseUrl, '_blank')}
                                        >
                                          <ExternalLink className="w-3 h-3 mr-1" />
                                          View Deal
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Vegetable</TableHead>
                              <TableHead>Price/kg</TableHead>
                              <TableHead>Nutrition/100g</TableHead>
                              <TableHead>Season</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {MOCK_VEGETABLES?.map((veg) => (
                              <TableRow key={veg.name}>
                                <TableCell className="font-medium">
                                  <div className="flex flex-col">
                                    <span>{veg.name}</span>
                                    {veg.discountPercentage && (
                                      <Badge className="w-fit mt-1 bg-red-100 text-red-600 hover:bg-red-100 border-none text-[10px] h-4 px-1">
                                        <Tag className="w-2 h-2 mr-1" /> {veg.discountPercentage}% OFF
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="font-mono text-emerald-600">
                                  <div className="flex flex-col">
                                    <span className={veg.discountPercentage ? "line-through text-slate-400 text-xs" : ""}>
                                      ₹{veg.pricePerKg}
                                    </span>
                                    {veg.discountPercentage && (
                                      <span>₹{Math.round(veg.pricePerKg * (1 - veg.discountPercentage / 100))}</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-xs text-slate-500">
                                  {veg.caloriesPer100g}kcal | {veg.proteinPer100g}g P
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-1">
                                    {veg.season?.map(s => (
                                      <Badge key={s} variant="outline" className="text-[10px] px-1 py-0">{s}</Badge>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {veg.purchaseUrl && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-8 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                      onClick={() => window.open(veg.purchaseUrl, '_blank')}
                                    >
                                      <ShoppingCart className="w-4 h-4 mr-1" />
                                      Buy
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="health" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-1 border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Body Metrics</CardTitle>
                      <CardDescription>Enter your details for health calculations</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Age</Label>
                          <Input 
                            type="number" 
                            value={userProfile.healthProfile?.age}
                            onChange={(e) => setUserProfile({
                              ...userProfile, 
                              healthProfile: { ...userProfile.healthProfile!, age: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select 
                            value={userProfile.healthProfile?.gender}
                            onValueChange={(val: any) => setUserProfile({
                              ...userProfile, 
                              healthProfile: { ...userProfile.healthProfile!, gender: val }
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Weight (kg)</Label>
                          <Input 
                            type="number" 
                            value={userProfile.healthProfile?.weight}
                            onChange={(e) => setUserProfile({
                              ...userProfile, 
                              healthProfile: { ...userProfile.healthProfile!, weight: Number(e.target.value) }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Height (cm)</Label>
                          <Input 
                            type="number" 
                            value={userProfile.healthProfile?.height}
                            onChange={(e) => setUserProfile({
                              ...userProfile, 
                              healthProfile: { ...userProfile.healthProfile!, height: Number(e.target.value) }
                            })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Activity Level</Label>
                        <Select 
                          value={userProfile.healthProfile?.activityLevel}
                          onValueChange={(val: any) => setUserProfile({
                            ...userProfile, 
                            healthProfile: { ...userProfile.healthProfile!, activityLevel: val }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (Office job)</SelectItem>
                            <SelectItem value="light">Lightly Active</SelectItem>
                            <SelectItem value="moderate">Moderately Active</SelectItem>
                            <SelectItem value="active">Very Active</SelectItem>
                            <SelectItem value="very_active">Extra Active</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-lg">Health Insights</CardTitle>
                      <CardDescription>Calculated based on your metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <div className="flex items-center gap-2 text-emerald-700 mb-2">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">BMI</span>
                          </div>
                          <p className="text-3xl font-bold text-slate-900">{userProfile.healthProfile?.bmi?.toFixed(1)}</p>
                          <p className="text-xs text-emerald-600 mt-1 font-medium">
                            {userProfile.healthProfile?.bmi! < 18.5 ? "Underweight" : 
                             userProfile.healthProfile?.bmi! < 25 ? "Normal weight" : 
                             userProfile.healthProfile?.bmi! < 30 ? "Overweight" : "Obese"}
                          </p>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                          <div className="flex items-center gap-2 text-blue-700 mb-2">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">BMR</span>
                          </div>
                          <p className="text-3xl font-bold text-slate-900">{userProfile.healthProfile?.bmr?.toFixed(0)}</p>
                          <p className="text-xs text-blue-600 mt-1 font-medium">Calories burned at rest</p>
                        </div>

                        <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
                          <div className="flex items-center gap-2 text-purple-700 mb-2">
                            <RefreshCw className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">TDEE</span>
                          </div>
                          <p className="text-3xl font-bold text-slate-900">{userProfile.healthProfile?.tdee?.toFixed(0)}</p>
                          <p className="text-xs text-purple-600 mt-1 font-medium">Daily maintenance calories</p>
                        </div>
                      </div>

                      <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-emerald-600" />
                          Personalized Recommendation
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed">
                          Based on your TDEE of <strong>{userProfile.healthProfile?.tdee?.toFixed(0)} kcal</strong>, 
                          to maintain your current weight of {userProfile.healthProfile?.weight}kg, 
                          your daily intake should match this value. 
                          {userProfile.healthProfile?.bmi! > 25 ? 
                            " Since your BMI is in the overweight range, we recommend a slight calorie deficit (e.g., 1800-2000 kcal) for healthy weight management." : 
                            " Your BMI is in the healthy range. Keep up the good work!"}
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-4 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          onClick={() => {
                            const recommended = Math.round(userProfile.healthProfile?.tdee! * (userProfile.healthProfile?.bmi! > 25 ? 0.85 : 1));
                            setUserProfile({
                              ...userProfile,
                              nutritionalGoals: { calories: recommended }
                            });
                            setActiveTab("planner");
                          }}
                        >
                          Apply Recommended Calories
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="mt-0 space-y-6">
                <Card className="border-none shadow-sm overflow-hidden">
                  <div className="bg-emerald-600 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Bank Connection</h2>
                        <p className="opacity-80 mt-1">Securely track your food spending in real-time</p>
                      </div>
                      <div className="bg-white/20 p-3 rounded-full">
                        <RefreshCw className={`w-8 h-8 ${loading ? 'animate-spin' : ''}`} />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                          <DollarSign className="text-emerald-600 w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">HDFC Bank Regalia</p>
                          <p className="text-sm text-slate-500">Connected • Last synced 2 mins ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage Connection</Button>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-bold text-slate-900 mb-4">Recent Transactions</h3>
                      <div className="space-y-4">
                        {transactions?.map((t) => (
                          <div key={t.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                t.category?.includes("Groceries") ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {t.category?.includes("Groceries") ? <Utensils className="w-5 h-5" /> : <DollarSign className="w-5 h-5" />}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{t.name}</p>
                                <p className="text-xs text-slate-500">{t.date} • {t.category?.join(", ")}</p>
                              </div>
                            </div>
                            <p className={`font-bold font-mono ${t.amount > 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                              ₹{t.amount?.toLocaleString('en-IN')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-sm bg-amber-50 border-l-4 border-amber-400">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-amber-800">
                        <AlertCircle className="w-4 h-4" />
                        Budget Alert
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-amber-700">
                        You've spent 85% of your grocery budget for April. Consider switching to more seasonal vegetables like <strong>Cabbage</strong> or <strong>Potatoes</strong> to save ₹850 this week.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-sm bg-emerald-50 border-l-4 border-emerald-400">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4" />
                        Savings Opportunity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-emerald-700">
                        By following the AI-optimized plan, you can reduce your monthly food cost by <strong>₹3,200</strong> while maintaining your protein goals.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  );
}

