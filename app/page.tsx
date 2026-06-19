"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  BrainCircuit,
  BriefcaseBusiness,
  ClipboardCheck,
  MessageSquareText,
  Play,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const sampleRole = "Senior Product Manager AI";

const sampleProfile =
  "Fictional candidate profile: 8 years experience in product management, led AI chatbot initiatives for B2B support teams, strong stakeholder management, comfortable with analytics, limited people leadership experience.";

const scorecardCriteria = [
  {
    id: "role-fit",
    label: "Role expertise",
    detail: "Depth of experience against the core responsibilities.",
  },
  {
    id: "ai-judgment",
    label: "AI product judgment",
    detail: "Understands quality, adoption, risk, and measurable value.",
  },
  {
    id: "stakeholders",
    label: "Stakeholder collaboration",
    detail: "Can align teams, leaders, and domain partners.",
  },
  {
    id: "leadership",
    label: "Leadership maturity",
    detail: "Shows ownership, coaching, and calm decision-making.",
  },
  {
    id: "communication",
    label: "Communication clarity",
    detail: "Explains tradeoffs and decisions in crisp, usable language.",
  },
] as const;

type InterviewGuide = {
  generatedAt: string;
  roleQuestions: string[];
  behavioralQuestions: string[];
  followUpQuestions: string[];
  summary: string;
  profileSnapshot: string;
};

type Ratings = Record<string, number>;

function hasAny(text: string, words: string[]) {
  const normalized = text.toLowerCase();
  return words.some((word) => normalized.includes(word));
}

function getSignals(role: string, profile: string) {
  const combined = `${role} ${profile}`.toLowerCase();
  return {
    ai: hasAny(combined, ["ai", "machine learning", "model", "chatbot"]),
    product: hasAny(combined, ["product", "roadmap", "pm", "manager"]),
    stakeholder: hasAny(combined, [
      "stakeholder",
      "cross-functional",
      "partner",
    ]),
    analytics: hasAny(combined, ["analytics", "data", "metrics", "kpi"]),
    leadershipGap: hasAny(combined, [
      "limited people leadership",
      "limited leadership",
      "no people leadership",
    ]),
    senior: hasAny(combined, ["senior", "lead", "principal", "head"]),
  };
}

function makeGuide(role: string, profile: string): InterviewGuide {
  const cleanRole = role.trim() || "the target role";
  const cleanProfile = profile.trim() || "the fictional candidate profile";
  const signals = getSignals(cleanRole, cleanProfile);

  const roleQuestions = [
    signals.ai
      ? `For ${cleanRole}, how would you define success metrics for an AI product where model quality, adoption, and compliance all matter?`
      : `For ${cleanRole}, what outcomes would you prioritize in your first 90 days, and how would you measure progress?`,
    signals.product
      ? "Tell us about a time you translated customer or employee feedback into a product roadmap. What tradeoffs did you make?"
      : "Describe a complex initiative you owned from discovery through delivery. What made your approach effective?",
    signals.stakeholder
      ? "How would you align senior stakeholders who disagree on priorities, timelines, or risk tolerance?"
      : "How do you build trust with new partners when you need quick decisions and limited context?",
    signals.analytics
      ? "What dashboard or decision rhythm would you create to separate genuine product impact from surface-level engagement?"
      : "What evidence would convince you that a new workflow is solving the right problem?",
    signals.leadershipGap
      ? "The profile suggests limited people leadership experience. How would you lead discovery, execution, and influence without relying on formal authority?"
      : signals.senior
        ? "How do you raise the quality of a team without slowing delivery or adding unnecessary process?"
        : "What support would you need from HR and the hiring manager to become productive quickly?",
  ];

  const behavioralQuestions = [
    "Describe a time you had to influence a difficult stakeholder without direct authority. What did you say, and what changed?",
    "Tell us about a project that did not go as planned. How did you communicate the issue and recover momentum?",
    "Give an example of feedback you received that changed how you work with colleagues or direct reports.",
  ];

  const followUpQuestions = [
    "What specific evidence would you look for before scaling that approach?",
    "Who would you involve earliest, and what would you need from them?",
    "If you had to repeat the situation, what would you do differently in the first two weeks?",
  ];

  const summary = signals.leadershipGap
    ? `AI-style recommendation: The fictional candidate appears to be a strong functional fit for ${cleanRole}, with credible product, AI, stakeholder, and analytics signals. The interview should probe leadership maturity, coaching range, and how they influence delivery without deep people-management experience.`
    : `AI-style recommendation: The fictional candidate appears well aligned to ${cleanRole}. Prioritize evidence of measurable outcomes, cross-functional leadership, and crisp decision-making under ambiguity before moving to final assessment.`;

  return {
    generatedAt: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    roleQuestions,
    behavioralQuestions,
    followUpQuestions,
    summary,
    profileSnapshot: cleanProfile,
  };
}

function makeAnswer(role: string, question: string, profile: string) {
  const signals = getSignals(role, profile);
  const aiDetail = signals.ai
    ? "I would pair adoption metrics with quality and safety checks, because a high-usage AI workflow can still fail if users do not trust the output."
    : "I would start by clarifying the business outcome, then work backward into measurable behaviors and delivery milestones.";
  const leadershipDetail = signals.leadershipGap
    ? "Since my people leadership exposure is still developing, I would be explicit about decision rights, create strong rituals, and ask for coaching from an experienced manager."
    : "I would set expectations early, give the team room to own decisions, and use reviews to improve quality without creating theater.";

  return `Example fictional answer: In this situation, I would begin by restating the goal for the ${role || "role"} and checking that HR, the hiring manager, and delivery partners agree on the success bar. ${aiDetail} ${leadershipDetail} For the question "${question}", I would bring one concrete project example, explain the tradeoffs, and close with what I learned.`;
}

function QuestionGroup({
  title,
  icon: Icon,
  questions,
  selectedQuestion,
  onSelect,
}: {
  title: string;
  icon: LucideIcon;
  questions: string[];
  selectedQuestion: string;
  onSelect: (question: string) => void;
}) {
  return (
    <section className="question-group" aria-labelledby={`${title}-heading`}>
      <div className="section-title">
        <Icon size={22} aria-hidden="true" />
        <h2 id={`${title}-heading`}>{title}</h2>
      </div>
      <div className="question-list">
        {questions.map((question, index) => {
          const active = selectedQuestion === question;
          return (
            <button
              className={`question-card ${active ? "selected" : ""}`}
              key={question}
              onClick={() => onSelect(question)}
              type="button"
            >
              <span className="question-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{question}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Scorecard({
  ratings,
  setRatings,
}: {
  ratings: Ratings;
  setRatings: React.Dispatch<React.SetStateAction<Ratings>>;
}) {
  return (
    <section className="scorecard" aria-labelledby="scorecard-heading">
      <div className="section-title">
        <ClipboardCheck size={22} aria-hidden="true" />
        <h2 id="scorecard-heading">Evaluation Scorecard</h2>
      </div>
      <div className="score-grid">
        {scorecardCriteria.map((criterion) => (
          <div className="score-row" key={criterion.id}>
            <div>
              <h3>{criterion.label}</h3>
              <p>{criterion.detail}</p>
            </div>
            <div className="rating-options" aria-label={`${criterion.label} rating`}>
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  aria-pressed={ratings[criterion.id] === rating}
                  className={ratings[criterion.id] === rating ? "active" : ""}
                  key={rating}
                  onClick={() =>
                    setRatings((current) => ({
                      ...current,
                      [criterion.id]: rating,
                    }))
                  }
                  type="button"
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [role, setRole] = useState(sampleRole);
  const [profile, setProfile] = useState(sampleProfile);
  const [guide, setGuide] = useState<InterviewGuide | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [ratings, setRatings] = useState<Ratings>({});

  const selectedCount = useMemo(
    () => Object.values(ratings).filter(Boolean).length,
    [ratings],
  );

  function handleGenerate() {
    const nextGuide = makeGuide(role, profile);
    setGuide(nextGuide);
    setSelectedQuestion(nextGuide.roleQuestions[0]);
    setCandidateAnswer("");
    setRatings({});
  }

  function handleSimulateAnswer() {
    if (!guide || !selectedQuestion) return;
    setCandidateAnswer(makeAnswer(role, selectedQuestion, guide.profileSnapshot));
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <div className="brand-mark">
            <span>HR</span>
            <span>Interview Coach</span>
          </div>
          <h1>Structured interview guides for confident hiring conversations.</h1>
          <p>
            A polished public demo using mock AI logic, fictional candidate data,
            and presentation-ready output for HR teams.
          </p>
        </div>
        <div className="hero-visual" aria-label="Interview guide preview">
          <div className="signal-card accent">
            <BrainCircuit size={28} aria-hidden="true" />
            <span>AI Fit</span>
            <strong>Strong</strong>
          </div>
          <div className="signal-card">
            <UsersRound size={26} aria-hidden="true" />
            <span>Leadership Probe</span>
            <strong>Focused</strong>
          </div>
          <div className="signal-chart" aria-hidden="true">
            <span style={{ height: "66%" }} />
            <span style={{ height: "82%" }} />
            <span style={{ height: "58%" }} />
            <span style={{ height: "74%" }} />
            <span style={{ height: "91%" }} />
          </div>
        </div>
      </header>

      <div className="workspace">
        <section className="input-panel" aria-labelledby="input-heading">
          <div className="panel-kicker">
            <BriefcaseBusiness size={20} aria-hidden="true" />
            <span>Fictional demo profile</span>
          </div>
          <h2 id="input-heading">Interview Setup</h2>
          <label htmlFor="role">Job role</label>
          <input
            id="role"
            onChange={(event) => setRole(event.target.value)}
            value={role}
          />
          <label htmlFor="profile">Candidate profile</label>
          <textarea
            id="profile"
            onChange={(event) => setProfile(event.target.value)}
            rows={8}
            value={profile}
          />
          <button className="primary-action" onClick={handleGenerate} type="button">
            <Sparkles size={20} aria-hidden="true" />
            Generate Interview Guide
          </button>
        </section>

        <section className="output-panel" aria-label="Generated interview guide">
          {!guide ? (
            <div className="empty-state">
              <Sparkles size={38} aria-hidden="true" />
              <h2>Ready for the live demo</h2>
              <p>
                The fields are pre-filled. Generate a guide to reveal questions,
                scorecard criteria, and an example candidate answer.
              </p>
            </div>
          ) : (
            <>
              <div className="guide-toolbar">
                <div>
                  <p className="eyebrow">Generated {guide.generatedAt}</p>
                  <h2>{role || "Interview Guide"}</h2>
                </div>
                <button
                  className="secondary-action"
                  disabled={!selectedQuestion}
                  onClick={handleSimulateAnswer}
                  type="button"
                >
                  <Play size={18} aria-hidden="true" />
                  Simulate Candidate Answer
                </button>
              </div>

              <QuestionGroup
                icon={BrainCircuit}
                onSelect={setSelectedQuestion}
                questions={guide.roleQuestions}
                selectedQuestion={selectedQuestion}
                title="Role-Specific Questions"
              />
              <QuestionGroup
                icon={MessageSquareText}
                onSelect={setSelectedQuestion}
                questions={guide.behavioralQuestions}
                selectedQuestion={selectedQuestion}
                title="Behavioral Questions"
              />
              <QuestionGroup
                icon={BadgeCheck}
                onSelect={setSelectedQuestion}
                questions={guide.followUpQuestions}
                selectedQuestion={selectedQuestion}
                title="Follow-Up Questions"
              />

              <Scorecard ratings={ratings} setRatings={setRatings} />

              <section className="recommendation" aria-labelledby="summary-heading">
                <div>
                  <p className="eyebrow">Recommendation Summary</p>
                  <h2 id="summary-heading">Interview focus</h2>
                </div>
                <p>{guide.summary}</p>
                <span>{selectedCount}/5 scorecard criteria rated</span>
              </section>

              {candidateAnswer && (
                <section className="answer-card" aria-live="polite">
                  <p className="eyebrow">Selected Question</p>
                  <h2>{selectedQuestion}</h2>
                  <p>{candidateAnswer}</p>
                </section>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
