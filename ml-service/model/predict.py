import os
import json
from typing import Dict, Any, List, Optional
import numpy as np
import pandas as pd
import joblib

FEATURE_NAMES = [
    "weekly_hours",
    "overtime_hours",
    "meeting_hours",
    "weekend_hours",
    "focus_hours",
    "after_hours_messages",
    "pto_deficit_days",
    "exhaustion_score",
    "engagement_score",
    "support_score",
    "sentiment_polarity",
]

class BurnoutPredictor:
    def __init__(self, artifacts_dir: Optional[str] = None):
        if artifacts_dir is None:
            artifacts_dir = os.path.join(os.path.dirname(__file__), "..", "artifacts")
        self.artifacts_dir = artifacts_dir
        self.regressor = None
        self.classifier = None
        self.scaler = None
        self.meta = {}
        self._ensure_models_loaded()

    def _ensure_models_loaded(self):
        reg_path = os.path.join(self.artifacts_dir, "burnout_regressor.joblib")
        clf_path = os.path.join(self.artifacts_dir, "risk_classifier.joblib")
        scaler_path = os.path.join(self.artifacts_dir, "scaler.joblib")
        meta_path = os.path.join(self.artifacts_dir, "model_meta.json")

        if not (os.path.exists(reg_path) and os.path.exists(clf_path) and os.path.exists(scaler_path)):
            # If models don't exist yet, train them automatically
            from model.train import train_and_export_models
            self.meta = train_and_export_models(self.artifacts_dir)

        self.regressor = joblib.load(reg_path)
        self.classifier = joblib.load(clf_path)
        self.scaler = joblib.load(scaler_path)

        if os.path.exists(meta_path):
            with open(meta_path, "r") as f:
                self.meta = json.load(f)

    def predict_team_risk(self, metrics: Dict[str, float]) -> Dict[str, Any]:
        """
        Runs ML inference on team ergonomic and survey features.
        Returns continuous risk score (0-100), risk tier, wellness index, and factor attribution.
        """
        feature_df = pd.DataFrame([
            {k: float(metrics.get(k, 0.0)) for k in FEATURE_NAMES}
        ])

        # Scale features for regressor
        scaled_vector = self.scaler.transform(feature_df)
        raw_score = float(self.regressor.predict(scaled_vector)[0])
        burnout_score = round(max(0.0, min(100.0, raw_score)), 1)
        wellness_index = round(100.0 - burnout_score, 1)

        # Classifier category & class probabilities
        probs = self.classifier.predict_proba(feature_df)[0]
        # Class 0: LOW, 1: MODERATE, 2: HIGH
        predicted_class_idx = int(np.argmax(probs))
        category_map = {0: "LOW", 1: "MODERATE", 2: "HIGH"}
        risk_category = category_map.get(predicted_class_idx, "LOW")
        confidence = round(float(probs[predicted_class_idx]), 2)

        # Calculate factor breakdown based on feature weights and relative deviations
        factors_attribution = {}
        total_risk_points = 0.0

        overtime = float(metrics.get("overtime_hours", 0.0))
        weekend = float(metrics.get("weekend_hours", 0.0))
        meetings = float(metrics.get("meeting_hours", 0.0))
        exhaustion = float(metrics.get("exhaustion_score", 1.0))
        after_hours = float(metrics.get("after_hours_messages", 0.0))
        pto_deficit = float(metrics.get("pto_deficit_days", 0.0))

        # Weighting contributions to total burnout risk points
        ot_pts = max(0.0, overtime * 2.2)
        wknd_pts = max(0.0, weekend * 2.8)
        mtg_pts = max(0.0, (meetings - 8.0) * 1.5) if meetings > 8.0 else 0.0
        exh_pts = max(0.0, (exhaustion - 2.0) * 8.0) if exhaustion > 2.0 else 0.0
        msg_pts = max(0.0, after_hours * 0.3)
        pto_pts = max(0.0, pto_deficit * 1.2)

        total_pts = ot_pts + wknd_pts + mtg_pts + exh_pts + msg_pts + pto_pts + 0.001

        factors_attribution = {
            "overtime_workload": round((ot_pts / total_pts) * 100, 1),
            "weekend_interruption": round((wknd_pts / total_pts) * 100, 1),
            "meeting_saturation": round((mtg_pts / total_pts) * 100, 1),
            "pulse_exhaustion": round((exh_pts / total_pts) * 100, 1),
            "after_hours_messaging": round((msg_pts / total_pts) * 100, 1),
            "unutilized_pto_deficit": round((pto_pts / total_pts) * 100, 1)
        }

        # Determine primary risk driver
        primary_driver = max(factors_attribution.items(), key=lambda x: x[1])[0]
        driver_descriptions = {
            "overtime_workload": "Excessive overtime hours beyond healthy sustainable thresholds",
            "weekend_interruption": "Repeated weekend work and off-hours disruptions",
            "meeting_saturation": "Meeting overload and fragmented deep focus time",
            "pulse_exhaustion": "Elevated employee-reported emotional exhaustion in pulse surveys",
            "after_hours_messaging": "High volume of evening and late-night communication",
            "unutilized_pto_deficit": "Significant backlog of untaken leave and recovery time"
        }

        return {
            "burnout_risk_score": burnout_score,
            "wellness_index": wellness_index,
            "risk_category": risk_category,
            "confidence_score": confidence,
            "class_probabilities": {
                "LOW": round(float(probs[0]), 3),
                "MODERATE": round(float(probs[1]), 3),
                "HIGH": round(float(probs[2]), 3)
            },
            "primary_risk_driver": driver_descriptions.get(primary_driver, primary_driver),
            "contributing_factors": factors_attribution,
            "model_version": self.meta.get("model_version", "v1.0.0-rf-gb")
        }

_predictor_instance = None

def get_predictor() -> BurnoutPredictor:
    global _predictor_instance
    if _predictor_instance is None:
        _predictor_instance = BurnoutPredictor()
    return _predictor_instance
