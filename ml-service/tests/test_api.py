import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert "model_version" in data
    assert len(data["features_tracked"]) > 0

def test_sentiment_analysis_negative():
    response = client.post("/analyze/sentiment", json={
        "feedback_text": "Exhausted from late night on-call incident alerts. We desperately need more team support."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["label"] == "NEGATIVE"
    assert data["polarity"] < 0
    assert "ON_CALL_AND_INCIDENTS" in data["detected_themes"]
    assert "EMOTIONAL_EXHAUSTION" in data["detected_themes"]

def test_sentiment_analysis_positive():
    response = client.post("/analyze/sentiment", json={
        "feedback_text": "Great sprint collaboration! Feeling highly energized and supported by our engineering manager."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["label"] == "POSITIVE"
    assert data["polarity"] > 0
    assert "MANAGEMENT_AND_SUPPORT" in data["detected_themes"]

def test_burnout_risk_prediction_high_stress():
    payload = {
        "organization_id": "org-test-01",
        "team_id": "team-sre",
        "team_name": "Cloud Operations",
        "metrics": {
            "weekly_hours": 56.0,
            "overtime_hours": 16.0,
            "meeting_hours": 18.0,
            "weekend_hours": 8.0,
            "focus_hours": 6.0,
            "after_hours_messages": 85,
            "pto_deficit_days": 12.0,
            "exhaustion_score": 4.6,
            "engagement_score": 2.1,
            "support_score": 2.8,
            "sentiment_polarity": -0.65
        },
        "feedback_comments": [
            "Late night pager duty is draining us completely."
        ]
    }
    response = client.post("/predict/burnout-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    pred = data["prediction"]
    assert pred["risk_category"] in ["MODERATE", "HIGH"]
    assert pred["burnout_risk_score"] >= 50.0
    assert pred["wellness_index"] <= 50.0
    assert "contributing_factors" in pred
    assert len(data["recommended_actions"]) > 0
    # Check that actionable recommendations are returned
    rec_categories = [r["category"] for r in data["recommended_actions"]]
    assert "WORKLOAD_BALANCING" in rec_categories or "TIME_OFF_LEAVE" in rec_categories

def test_burnout_risk_prediction_healthy_team():
    payload = {
        "organization_id": "org-test-01",
        "team_id": "team-design",
        "team_name": "UX Design",
        "metrics": {
            "weekly_hours": 39.5,
            "overtime_hours": 0.0,
            "meeting_hours": 8.0,
            "weekend_hours": 0.0,
            "focus_hours": 24.0,
            "after_hours_messages": 3,
            "pto_deficit_days": 2.0,
            "exhaustion_score": 1.8,
            "engagement_score": 4.4,
            "support_score": 4.5,
            "sentiment_polarity": 0.70
        }
    }
    response = client.post("/predict/burnout-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    pred = data["prediction"]
    assert pred["risk_category"] == "LOW"
    assert pred["burnout_risk_score"] < 40.0
    assert pred["wellness_index"] > 60.0

def test_batch_prediction():
    payload = {
        "teams": [
            {
                "organization_id": "org-01",
                "team_id": "team-1",
                "team_name": "Team A",
                "metrics": {"weekly_hours": 40.0, "overtime_hours": 1.0}
            },
            {
                "organization_id": "org-01",
                "team_id": "team-2",
                "team_name": "Team B",
                "metrics": {"weekly_hours": 55.0, "overtime_hours": 15.0, "weekend_hours": 6.0}
            }
        ]
    }
    response = client.post("/predict/batch", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["cohort_size"] == 2
    assert len(data["evaluations"]) == 2
