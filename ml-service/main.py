import os
from typing import Dict, List, Any, Optional
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from model.predict import get_predictor, FEATURE_NAMES
from model.nlp_sentiment import analyze_sentiment_and_themes
from model.recommendation_engine import generate_recommendations_for_team

app = FastAPI(
    title="EmotionSense - Workplace Wellness & Burnout Analytics API",
    description="Privacy-preserving ML microservice for organizational burnout risk prediction, NLP feedback sentiment, and ergonomic recommendations.",
    version="1.0.0"
)

# Enable CORS for Spring Boot backend and Frontend SPA
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Request & Response Schemas
# ---------------------------------------------------------
class WorkloadMetricsInput(BaseModel):
    weekly_hours: float = Field(default=40.0, description="Average weekly working hours")
    overtime_hours: float = Field(default=0.0, description="Hours worked beyond 40h standard")
    meeting_hours: float = Field(default=10.0, description="Hours spent in synchronous video/audio calls")
    weekend_hours: float = Field(default=0.0, description="Active working hours during weekends")
    focus_hours: float = Field(default=20.0, description="Uninterrupted focus block hours")
    after_hours_messages: int = Field(default=5, description="Slack/Teams messages sent outside 8am-7pm")
    pto_deficit_days: float = Field(default=0.0, description="Accrued untaken PTO deficit")
    exhaustion_score: float = Field(default=2.5, description="Survey exhaustion dimension (1.0 to 5.0)")
    engagement_score: float = Field(default=3.5, description="Survey engagement dimension (1.0 to 5.0)")
    support_score: float = Field(default=3.5, description="Survey manager/peer support dimension (1.0 to 5.0)")
    sentiment_polarity: float = Field(default=0.0, description="Sentiment polarity (-1.0 to +1.0)")

class TeamPredictionRequest(BaseModel):
    organization_id: str
    team_id: str
    team_name: Optional[str] = "Engineering / Product Team"
    metrics: WorkloadMetricsInput
    feedback_comments: Optional[List[str]] = Field(default_factory=list)

class BatchPredictionRequest(BaseModel):
    teams: List[TeamPredictionRequest]

class SentimentAnalysisRequest(BaseModel):
    feedback_text: str

class RecommendationRequest(BaseModel):
    team_name: str
    burnout_risk_score: float
    risk_category: str
    factors: Dict[str, float]
    detected_themes: Optional[List[str]] = Field(default_factory=list)

# ---------------------------------------------------------
# Endpoints
# ---------------------------------------------------------
@app.get("/health", tags=["System"])
def health_check():
    predictor = get_predictor()
    return {
        "status": "HEALTHY",
        "service": "EmotionSense-ML-Engine",
        "version": "1.0.0",
        "model_version": predictor.meta.get("model_version", "v1.0.0-rf-gb"),
        "features_tracked": FEATURE_NAMES
    }

@app.post("/predict/burnout-risk", tags=["Prediction"])
def predict_burnout_risk(request: TeamPredictionRequest):
    try:
        predictor = get_predictor()
        metrics_dict = request.metrics.model_dump()
        prediction = predictor.predict_team_risk(metrics_dict)

        # Analyze feedback comments if provided
        sentiment_summary = []
        all_themes = []
        for comment in request.feedback_comments:
            analysis = analyze_sentiment_and_themes(comment)
            sentiment_summary.append(analysis)
            all_themes.extend(analysis.get("detected_themes", []))

        all_themes = list(set(all_themes))

        # Generate automated ergonomic recommendations
        recommendations = generate_recommendations_for_team(
            team_name=request.team_name,
            burnout_risk_score=prediction["burnout_risk_score"],
            risk_category=prediction["risk_category"],
            factors=metrics_dict,
            detected_themes=all_themes
        )

        return {
            "organization_id": request.organization_id,
            "team_id": request.team_id,
            "team_name": request.team_name,
            "prediction": prediction,
            "sentiment_summary": sentiment_summary,
            "detected_themes": all_themes,
            "recommended_actions": recommendations
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}"
        )

@app.post("/predict/batch", tags=["Prediction"])
def batch_predict(request: BatchPredictionRequest):
    predictor = get_predictor()
    results = []
    for team_req in request.teams:
        metrics_dict = team_req.metrics.model_dump()
        pred = predictor.predict_team_risk(metrics_dict)
        results.append({
            "organization_id": team_req.organization_id,
            "team_id": team_req.team_id,
            "team_name": team_req.team_name,
            "burnout_risk_score": pred["burnout_risk_score"],
            "wellness_index": pred["wellness_index"],
            "risk_category": pred["risk_category"],
            "confidence_score": pred["confidence_score"],
            "primary_risk_driver": pred["primary_risk_driver"],
            "contributing_factors": pred["contributing_factors"]
        })
    return {"cohort_size": len(results), "evaluations": results}

@app.post("/analyze/sentiment", tags=["NLP"])
def analyze_sentiment(request: SentimentAnalysisRequest):
    return analyze_sentiment_and_themes(request.feedback_text)

@app.post("/recommendations/generate", tags=["Recommendations"])
def generate_recommendations(request: RecommendationRequest):
    recs = generate_recommendations_for_team(
        team_name=request.team_name,
        burnout_risk_score=request.burnout_risk_score,
        risk_category=request.risk_category,
        factors=request.factors,
        detected_themes=request.detected_themes
    )
    return {"team_name": request.team_name, "recommendations": recs}

@app.post("/train", tags=["Model Lifecycle"])
def trigger_retraining():
    from model.train import train_and_export_models
    meta = train_and_export_models(os.path.join(os.path.dirname(__file__), "artifacts"))
    global get_predictor
    # Reset singleton
    import model.predict
    model.predict._predictor_instance = None
    return {"message": "Retraining completed successfully", "metadata": meta}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
