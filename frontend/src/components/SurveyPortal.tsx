import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { ShieldCheck, MessageSquare, Sparkles, CheckCircle2, Lock, Send, AlertCircle } from 'lucide-react';

export const SurveyPortal: React.FC = () => {
  const { user } = useAuth();

  const [exhaustionScore, setExhaustionScore] = useState<number>(3);
  const [workloadScore, setWorkloadScore] = useState<number>(3);
  const [supportScore, setSupportScore] = useState<number>(4);
  const [autonomyScore, setAutonomyScore] = useState<number>(4);
  const [engagementScore, setEngagementScore] = useState<number>(4);
  const [feedbackText, setFeedbackText] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [nlpPreview, setNlpPreview] = useState<{ polarity: number; label: string; detected_themes: string[] } | null>(null);

  const handleFeedbackChange = async (text: string) => {
    setFeedbackText(text);
    if (text.trim().length > 10) {
      const result = await apiService.analyzeSentimentNLP(text);
      setNlpPreview(result);
    } else {
      setNlpPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiService.submitPulseSurvey({
        surveyId: "srv-cycle-current",
        exhaustionScore,
        engagementScore,
        workloadScore,
        supportScore,
        feedbackText
      });
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto my-12 rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-lg dark:border-emerald-900 dark:bg-slate-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Pulse Check-In Received</h2>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Your feedback was securely encrypted and separated from your user profile via pseudonymous one-way tokenization.
          It will only be displayed as an aggregated cohort index when a minimum of 5 responses are collected for your team.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFeedbackText('');
            setNlpPreview(null);
          }}
          className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition dark:bg-white dark:text-slate-900"
        >
          Submit Another Pulse Response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Privacy Guarantee Header Banner */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/30 flex items-start gap-3.5">
        <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
          <Lock className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
            100% Confidential & Pseudonymous Pulse
          </h2>
          <p className="mt-1 text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
            Your name and employee ID are never attached to your ratings or comments. Responses are grouped under K-Anonymity rules (minimum cohort k ≥ 5) to protect your psychological safety.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Weekly Team Health & Work-Life Pulse</h1>
          <p className="text-xs text-slate-500 mt-1">Takes ~90 seconds. Cycle: Week 38 • Active Window</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Question 1: Exhaustion */}
          <div className="space-y-2 border-b border-slate-100 pb-5 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
              1. How mentally drained or depleted did you feel at the end of this work week?
            </label>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>1 - Fully Energized</span>
              <span>5 - Severely Exhausted</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setExhaustionScore(val)}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    exhaustionScore === val
                      ? 'bg-rose-600 text-white shadow'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Workload Manageability */}
          <div className="space-y-2 border-b border-slate-100 pb-5 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
              2. How manageable was the volume and urgency of your assigned tasks?
            </label>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>1 - Unmanageable / Overwhelmed</span>
              <span>5 - Perfectly Balanced</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setWorkloadScore(val)}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    workloadScore === val
                      ? 'bg-emerald-600 text-white shadow'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Support */}
          <div className="space-y-2 border-b border-slate-100 pb-5 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
              3. Did you feel supported by your manager and teammates during roadblocks?
            </label>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>1 - Isolated / Unsupported</span>
              <span>5 - Strongly Supported</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setSupportScore(val)}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    supportScore === val
                      ? 'bg-blue-600 text-white shadow'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Focus Time Autonomy */}
          <div className="space-y-2 border-b border-slate-100 pb-5 dark:border-slate-800">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
              4. Did you have sufficient uninterrupted focus blocks without meeting clutter?
            </label>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>1 - Constant Interruption</span>
              <span>5 - Excellent Focus Time</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setAutonomyScore(val)}
                  className={`rounded-xl py-2.5 text-xs font-bold transition-all ${
                    autonomyScore === val
                      ? 'bg-teal-600 text-white shadow'
                      : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Question 5: Optional Qualitative Feedback with Live NLP Analyzer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-900 dark:text-slate-200">
                5. What operational or workload factor most affected your well-being this sprint? (Optional)
              </label>
              <span className="text-[11px] text-slate-400">Live NLP Sentiment</span>
            </div>

            <textarea
              rows={3}
              value={feedbackText}
              onChange={(e) => handleFeedbackChange(e.target.value)}
              placeholder="e.g., Late night on-call alerts were tough this week, or sprint delivery was well paced..."
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />

            {/* Real-time NLP sentiment preview card */}
            {nlpPreview && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    Detected Polarity: <span className="font-bold text-slate-900 dark:text-white">{nlpPreview.polarity}</span>
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    nlpPreview.label === 'NEGATIVE' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' :
                    nlpPreview.label === 'POSITIVE' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                    'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {nlpPreview.label}
                  </span>
                </div>
                {nlpPreview.detected_themes.length > 0 && (
                  <div className="flex gap-1">
                    {nlpPreview.detected_themes.map(t => (
                      <span key={t} className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Securing & Encrypting...' : 'Submit Anonymous Pulse'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
