import json

def calculate_health_metrics(age, gender, weight, height, activity_level):
    """
    Calculates BMI, BMR, and TDEE.
    """
    # BMI
    bmi = weight / ((height / 100) ** 2)
    
    # BMR (Mifflin-St Jeor)
    bmr = 10 * weight + 6.25 * height - 5 * age
    if gender.lower() == "male":
        bmr += 5
    else:
        bmr -= 161
        
    # TDEE Activity Factors
    activity_factors = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    tdee = bmr * activity_factors.get(activity_level.lower(), 1.2)
    
    return {
        "bmi": round(bmi, 1),
        "bmr": round(bmr, 0),
        "tdee": round(tdee, 0)
    }

def optimize_diet_plan(budget, calories, vegetables):
    """
    Simulates the optimization logic for a diet plan.
    In the real app, this is handled by Gemini AI.
    """
    # Sort vegetables by price per calorie (efficiency)
    # Note: This is a simplified version of what the AI does
    optimized_list = sorted(vegetables, key=lambda x: x['pricePerKg'] / (x['caloriesPer100g'] * 10))
    
    return {
        "dailyCalories": calories,
        "estimatedMonthlyCost": budget * 0.8, # Simulated cost
        "topRecommendations": [v['name'] for v in optimized_list[:3]]
    }

if __name__ == "__main__":
    # Example Usage
    user_data = {
        "age": 25,
        "gender": "male",
        "weight": 70,
        "height": 175,
        "activity_level": "moderate"
    }
    
    metrics = calculate_health_metrics(**user_data)
    print("--- Health Metrics ---")
    print(json.dumps(metrics, indent=2))
    
    # Mock vegetables data
    mock_veggies = [
        {"name": "Spinach", "pricePerKg": 40, "caloriesPer100g": 23},
        {"name": "Potatoes", "pricePerKg": 25, "caloriesPer100g": 77},
        {"name": "Broccoli", "pricePerKg": 120, "caloriesPer100g": 34}
    ]
    
    plan = optimize_diet_plan(15000, metrics['tdee'], mock_veggies)
    print("\n--- Optimized Plan Summary ---")
    print(json.dumps(plan, indent=2))
