import os
import re
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler

# Load environment variables
load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
if API_KEY is None:
    raise ValueError("API key is missing! Set GROQ_API_KEY in the .env file.")

# Initialize Groq client
client = Groq(api_key=API_KEY)

# Initialize FastAPI app
app = FastAPI()

# Define request model
class BailRiskRequest(BaseModel):
    case_details: str  # Case description as input

# Load or train a Linear Regression model (weights will be used dynamically)
np.random.seed(42)
X = np.random.rand(100, 4)  # Simulated risk factors
y = np.random.rand(100)  # Outcome variable

# Train the model
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = LinearRegression()
model.fit(X_scaled, y)

# Get learned weights (coefficients)
LEARNED_WEIGHTS = {  
    "criminal_history": abs(model.coef_[0]),  
    "flight_risk": abs(model.coef_[1]),  
    "violent_offenses": abs(model.coef_[2]),  
    "prison_conduct": abs(model.coef_[3])  
}

# Normalize weights to sum to 1
total_weight = sum(LEARNED_WEIGHTS.values())
LEARNED_WEIGHTS = {key: value / total_weight for key, value in LEARNED_WEIGHTS.items()}

# Function to extract risk factors using Groq LLM
def extract_risk_factors(case_details: str):
    try:
        prompt = (
            f"{case_details} Based on the case details, assign risk scores (0-5) for the following factors: "
            "'Criminal History', 'Flight Risk', 'Violent Offenses', and 'Prison Conduct'. "
            "Format: {criminal_history: score, flight_risk: score, violent_offenses: score, prison_conduct: score}. "
            "Do not provide explanations."
        )

        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
        )

        response_text = chat_completion.choices[0].message.content.strip()

        # Extract values using regex
        risk_factors = {
            "criminal_history": int(re.search(r"criminal_history:\s*(\d+)", response_text).group(1)),
            "flight_risk": int(re.search(r"flight_risk:\s*(\d+)", response_text).group(1)),
            "violent_offenses": int(re.search(r"violent_offenses:\s*(\d+)", response_text).group(1)),
            "prison_conduct": int(re.search(r"prison_conduct:\s*(\d+)", response_text).group(1)),
        }

        return risk_factors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting risk factors: {str(e)}")

# Function to compute final risk score
def compute_risk_score(risk_factors: dict):
    weighted_scores = {factor: risk_factors[factor] * LEARNED_WEIGHTS[factor] for factor in LEARNED_WEIGHTS}
    total_score = sum(weighted_scores.values())

    # Define thresholds
    if total_score >= 2.5:
        risk_level = "High Risk"
    elif total_score >= 1.5:
        risk_level = "Moderate Risk"
    else:
        risk_level = "Low Risk"

    return {"weighted_scores": weighted_scores, "total_score": total_score, "risk_level": risk_level}

# API endpoint to predict bail risk
@app.post("/predict_bail_risk")
def predict_bail_risk(request: BailRiskRequest):
    try:
        # Extract risk factors from case details
        risk_factors = extract_risk_factors(request.case_details)

        # Compute risk score using learned weights
        result = compute_risk_score(risk_factors)

        return {
            "risk_factors": risk_factors,
            "weighted_scores": result["weighted_scores"],
            "total_score": result["total_score"],
            "risk_level": result["risk_level"]
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
