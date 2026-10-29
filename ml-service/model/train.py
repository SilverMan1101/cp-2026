import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score, accuracy_score, classification_report
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

def generate_synthetic_workplace_data(num_samples=3000, random_seed=42):
    """
    Synthesizes empirical workplace metrics grounded in Maslach Burnout Inventory (MBI)
    and ergonomic organizational patterns.
    """
    np.random.seed(random_seed)

    # Baseline working hours
    weekly_hours = np.random.normal(loc=42.0, scale=6.0, size=num_samples)
    weekly_hours = np.clip(weekly_hours, 30.0, 75.0)

    # Overtime hours (correlated with weekly_hours > 40)
    overtime_hours = np.maximum(0.0, weekly_hours - 40.0) + np.random.exponential(scale=2.0, size=num_samples)
    overtime_hours = np.clip(overtime_hours, 0.0, 30.0)

    # Meeting hours (typically 5 to 30)
    meeting_hours = np.random.normal(loc=13.0, scale=5.5, size=num_samples)
    meeting_hours = np.clip(meeting_hours, 2.0, 35.0)

    # Weekend active hours
    weekend_hours = np.random.exponential(scale=1.8, size=num_samples)
    weekend_hours = np.clip(weekend_hours, 0.0, 18.0)

    # Focus hours (deep work) is bounded by total hours minus meetings
    focus_hours = np.maximum(2.0, weekly_hours * 0.45 - (meeting_hours * 0.6) + np.random.normal(0, 2.0, size=num_samples))
    focus_hours = np.clip(focus_hours, 1.0, 35.0)

    # After-hours messages count
    after_hours_messages = (overtime_hours * 3.5 + weekend_hours * 4.0 + np.random.poisson(lam=12, size=num_samples)).astype(int)
    after_hours_messages = np.clip(after_hours_messages, 0, 150)

    # Unutilized PTO deficit (high deficit implies skipped rest)
    pto_deficit_days = np.random.uniform(0.0, 18.0, size=num_samples)

    # Survey signals (Likert 1 to 5)
    # Exhaustion correlates strongly with overtime and after-hours
    base_exhaustion = 1.2 + (overtime_hours / 30.0) * 2.2 + (weekend_hours / 18.0) * 1.0 + (after_hours_messages / 150.0) * 0.8
    exhaustion_score = np.clip(base_exhaustion + np.random.normal(0, 0.35, size=num_samples), 1.0, 5.0)

    # Engagement correlates inversely with exhaustion, positively with focus and support
    support_score = np.clip(np.random.normal(3.5, 0.8, size=num_samples), 1.0, 5.0)
    base_engagement = 4.2 - (exhaustion_score * 0.45) + (support_score * 0.25)
    engagement_score = np.clip(base_engagement + np.random.normal(0, 0.3, size=num_samples), 1.0, 5.0)

    # Sentiment polarity (-1.0 to +1.0)
    sentiment_polarity = np.clip(
        (engagement_score - exhaustion_score) / 3.0 + np.random.normal(0, 0.25, size=num_samples),
        -1.0, 1.0
    )

    # Ground-truth continuous Burnout Risk Index (0 - 100)
    # Higher overtime, meetings, exhaustion, weekend work, after-hours, and pto deficit increase risk
    raw_risk = (
        (overtime_hours / 30.0) * 25.0 +
        (exhaustion_score / 5.0) * 25.0 +
        (weekend_hours / 18.0) * 15.0 +
        (meeting_hours / 35.0) * 12.0 +
        (after_hours_messages / 150.0) * 10.0 +
        (pto_deficit_days / 18.0) * 8.0 +
        ((5.0 - engagement_score) / 4.0) * 10.0 +
        ((5.0 - support_score) / 4.0) * 8.0 -
        (sentiment_polarity * 7.0)
    )

    burnout_score = np.clip(raw_risk * 0.95 + np.random.normal(0, 3.0, size=num_samples), 5.0, 98.0)

    # Discrete classification
    # 0 = LOW (< 40), 1 = MODERATE (40 - 68), 2 = HIGH (>= 68)
    risk_category = np.zeros(num_samples, dtype=int)
    risk_category[(burnout_score >= 40.0) & (burnout_score < 68.0)] = 1
    risk_category[burnout_score >= 68.0] = 2

    df = pd.DataFrame({
        "weekly_hours": np.round(weekly_hours, 1),
        "overtime_hours": np.round(overtime_hours, 1),
        "meeting_hours": np.round(meeting_hours, 1),
        "weekend_hours": np.round(weekend_hours, 1),
        "focus_hours": np.round(focus_hours, 1),
        "after_hours_messages": after_hours_messages,
        "pto_deficit_days": np.round(pto_deficit_days, 1),
        "exhaustion_score": np.round(exhaustion_score, 2),
        "engagement_score": np.round(engagement_score, 2),
        "support_score": np.round(support_score, 2),
        "sentiment_polarity": np.round(sentiment_polarity, 2),
        "burnout_score": np.round(burnout_score, 1),
        "risk_category": risk_category,
    })

    return df

def train_and_export_models(output_dir="artifacts"):
    os.makedirs(output_dir, exist_ok=True)
    print("Generating synthetic workplace training dataset...")
    df = generate_synthetic_workplace_data(num_samples=4000)

    X = df[FEATURE_NAMES]
    y_reg = df["burnout_score"]
    y_clf = df["risk_category"]

    X_train, X_test, y_reg_train, y_reg_test, y_clf_train, y_clf_test = train_test_split(
        X, y_reg, y_clf, test_size=0.2, random_state=42, stratify=y_clf
    )

    print("Fitting feature scaler...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # 1. Regressor for continuous risk score (0-100)
    print("Training Random Forest Regressor for Burnout Score...")
    regressor = RandomForestRegressor(
        n_estimators=120,
        max_depth=12,
        min_samples_leaf=3,
        random_state=42,
        n_jobs=-1
    )
    regressor.fit(X_train_scaled, y_reg_train)

    y_reg_pred = regressor.predict(X_test_scaled)
    mse = mean_squared_error(y_reg_test, y_reg_pred)
    r2 = r2_score(y_reg_test, y_reg_pred)
    print(f"Regressor Validation: MSE = {mse:.3f}, R2 = {r2:.3f}")

    # 2. Classifier for Risk Tiers (LOW, MODERATE, HIGH)
    print("Training Gradient Boosting Classifier for Risk Categories...")
    classifier = GradientBoostingClassifier(
        n_estimators=100,
        max_depth=5,
        learning_rate=0.08,
        random_state=42
    )
    classifier.fit(X_train, y_clf_train)  # Tree ensembles handle raw scales naturally

    y_clf_pred = classifier.predict(X_test)
    acc = accuracy_score(y_clf_test, y_clf_pred)
    print(f"Classifier Accuracy: {acc * 100:.2f}%")
    print(classification_report(y_clf_test, y_clf_pred, target_names=["LOW", "MODERATE", "HIGH"]))

    # Feature importances
    feature_importances = dict(zip(FEATURE_NAMES, [float(v) for v in regressor.feature_importances_]))
    sorted_importances = dict(sorted(feature_importances.items(), key=lambda item: item[1], reverse=True))

    meta = {
        "model_version": "v1.0.0-rf-gb",
        "feature_names": FEATURE_NAMES,
        "feature_importances": sorted_importances,
        "metrics": {
            "regressor_r2": float(r2),
            "regressor_rmse": float(np.sqrt(mse)),
            "classifier_accuracy": float(acc)
        }
    }

    # Save artifacts
    joblib.dump(regressor, os.path.join(output_dir, "burnout_regressor.joblib"))
    joblib.dump(classifier, os.path.join(output_dir, "risk_classifier.joblib"))
    joblib.dump(scaler, os.path.join(output_dir, "scaler.joblib"))

    with open(os.path.join(output_dir, "model_meta.json"), "w") as f:
        json.dump(meta, f, indent=2)

    # Save a sample benchmark test dataset
    df.head(100).to_csv(os.path.join(output_dir, "sample_workplace_records.csv"), index=False)
    print(f"Model artifacts successfully exported to {output_dir}/")
    return meta

if __name__ == "__main__":
    train_and_export_models(os.path.join(os.path.dirname(__file__), "..", "artifacts"))
