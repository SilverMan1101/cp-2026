import re
from typing import Dict, List, Any

# Domain-specific workplace sentiment lexicons & theme taxonomy
NEGATIVE_LEXICON = {
    "exhausted": -0.8, "drained": -0.8, "burnout": -0.9, "burned out": -0.9,
    "overwhelmed": -0.75, "furious": -0.8, "unbearable": -0.85, "toxic": -0.9,
    "firefighting": -0.6, "nightmare": -0.8, "stressful": -0.65, "stress": -0.5,
    "unsustainable": -0.7, "frustrated": -0.65, "blocked": -0.4, "chaos": -0.7,
    "fatigued": -0.7, "depleted": -0.75, "quitting": -0.8, "overworked": -0.75,
    "hopeless": -0.85, "insomnia": -0.7, "anxiety": -0.7, "suffering": -0.8,
    "pointless": -0.6, "micromanaged": -0.7, "ignored": -0.6
}

POSITIVE_LEXICON = {
    "energized": 0.8, "motivated": 0.8, "supported": 0.75, "balanced": 0.7,
    "sustainable": 0.65, "thriving": 0.85, "productive": 0.6, "encouraged": 0.7,
    "valued": 0.75, "collaborative": 0.65, "smooth": 0.6, "healthy": 0.7,
    "clear": 0.5, "manageable": 0.6, "appreciated": 0.75, "rewarding": 0.7,
    "inspired": 0.8, "calm": 0.6, "empowered": 0.8, "great": 0.6
}

INTENSIFIERS = {
    "very": 1.4, "extremely": 1.8, "completely": 1.6, "absolutely": 1.7,
    "desperately": 1.9, "really": 1.3, "deeply": 1.5, "severely": 1.8,
    "incredibly": 1.5, "terribly": 1.6
}

NEGATIONS = {"not", "never", "no", "hardly", "barely", "scarcely", "without", "lack"}

WORKPLACE_THEMES = {
    "OVERTIME_AND_HOURS": ["overtime", "weekend", "night", "late", "hours", "shift", "sleep", "rest", "schedule"],
    "MEETING_SATURATION": ["meeting", "meetings", "calls", "sync", "zoom", "huddle", "interruption", "focus time", "calendar"],
    "ON_CALL_AND_INCIDENTS": ["on-call", "oncall", "alert", "pager", "incident", "firefighting", "pipeline", "prod", "outage"],
    "MANAGEMENT_AND_SUPPORT": ["manager", "lead", "leadership", "support", "guidance", "recognition", "appreciation", "direction"],
    "STAFFING_AND_CAPACITY": ["staffing", "understaffed", "bandwidth", "capacity", "headcount", "workload", "tickets", "backlog"],
    "EMOTIONAL_EXHAUSTION": ["drained", "exhausted", "burnout", "depleted", "crying", "anxiety", "stress", "fatigue", "overwhelmed"]
}

def scrub_pii(text: str) -> str:
    """
    Scrubs email addresses and phone numbers to guarantee pseudonymous employee confidentiality.
    """
    # Scrub email addresses
    text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[REDACTED_EMAIL]', text)
    # Scrub phone numbers
    text = re.sub(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', '[REDACTED_PHONE]', text)
    return text

def analyze_sentiment_and_themes(feedback_text: str) -> Dict[str, Any]:
    """
    Performs domain-tuned rule & lexicon NLP sentiment analysis,
    extracts key workplace ergonomics themes, and flags high-urgency distress signals.
    """
    if not feedback_text or not feedback_text.strip():
        return {
            "scrubbed_text": "",
            "polarity": 0.0,
            "label": "NEUTRAL",
            "detected_themes": [],
            "urgency_flag": False,
            "word_count": 0
        }

    scrubbed = scrub_pii(feedback_text)
    words = re.findall(r'\b[a-zA-Z-]+\b', scrubbed.lower())

    if not words:
        return {
            "scrubbed_text": scrubbed,
            "polarity": 0.0,
            "label": "NEUTRAL",
            "detected_themes": [],
            "urgency_flag": False,
            "word_count": 0
        }

    score = 0.0
    scored_words_count = 0
    i = 0
    n = len(words)

    while i < n:
        word = words[i]
        negated = False
        multiplier = 1.0

        # Check for negation in 2-word lookbehind
        if i > 0 and words[i - 1] in NEGATIONS:
            negated = True
        elif i > 1 and words[i - 2] in NEGATIONS:
            negated = True

        # Check for intensifier
        if i > 0 and words[i - 1] in INTENSIFIERS:
            multiplier = INTENSIFIERS[words[i - 1]]

        word_score = 0.0
        if word in NEGATIVE_LEXICON:
            word_score = NEGATIVE_LEXICON[word]
        elif word in POSITIVE_LEXICON:
            word_score = POSITIVE_LEXICON[word]

        if word_score != 0.0:
            if negated:
                word_score = -0.7 * word_score
            word_score *= multiplier
            score += word_score
            scored_words_count += 1

        i += 1

    # Normalize polarity between -1.0 and 1.0
    if scored_words_count > 0:
        polarity = max(-1.0, min(1.0, score / max(1.0, np_len := float(scored_words_count) ** 0.65)))
    else:
        polarity = 0.0

    # Determine discrete category
    if polarity <= -0.20:
        label = "NEGATIVE"
    elif polarity >= 0.20:
        label = "POSITIVE"
    else:
        label = "NEUTRAL"

    # Identify workplace themes
    lower_full = scrubbed.lower()
    detected_themes = []
    for theme, keywords in WORKPLACE_THEMES.items():
        if any(kw in lower_full for kw in keywords):
            detected_themes.append(theme)

    # Urgency flag for severe signals
    urgency_terms = ["desperately", "unbearable", "quitting", "crying", "severe burnout", "cannot continue", "collapse"]
    urgency_flag = any(term in lower_full for term in urgency_terms) or (polarity <= -0.70)

    return {
        "scrubbed_text": scrubbed,
        "polarity": round(float(polarity), 2),
        "label": label,
        "detected_themes": detected_themes,
        "urgency_flag": urgency_flag,
        "word_count": len(words)
    }
