import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════
   ATN 164 Screen2Prevent — Interactive Chatbot Prototype
   Texas Children's Hospital Emergency Department
   ═══════════════════════════════════════════════ */

// ── Survey Script Engine ──
const SURVEY_SCRIPT = [
  {
    id: "age",
    messages: ["Hey there! 👋", "I'm going to ask you a few quick questions about your health. Everything you share is completely private — no one in the waiting room or your family will see your answers.", "Let's start with something easy.\n\nHow old are you?"],
    options: ["14–15", "16–17", "18–20", "21–24"],
    next: "gender",
  },
  {
    id: "gender",
    messages: ["Got it, thanks!", "How do you describe your gender?"],
    options: ["Male", "Female", "Transgender", "Non-binary", "Other", "Prefer not to say"],
    next: "pcp",
  },
  {
    id: "pcp",
    messages: ["Thanks for sharing that.", "Do you have a primary care doctor or clinic you see regularly?"],
    options: ["Yes", "No", "Not sure"],
    next: "hiv_test",
    responses: {
      "No": "That's actually more common than you might think, especially for people your age. That's one reason we offer health screenings here in the ED.",
      "Not sure": "No worries — that's okay. We just want to make sure you have access to the care you need.",
    },
  },
  {
    id: "hiv_test",
    messages: ["Have you ever been tested for HIV?"],
    options: ["Yes", "No", "Not sure", "Prefer not to say"],
    next: "sexual_activity",
    responses: {
      "No": "That's completely fine. HIV testing is a routine part of healthcare, and we recommend it for everyone.",
      "Not sure": "No problem. It may have been part of a blood test you had before.",
    },
  },
  {
    id: "sexual_activity",
    privacyReminder: true,
    messages: ["In the past 12 months, have you been sexually active?"],
    options: ["Yes", "No", "Prefer not to say"],
    next: (answer) => answer === "Yes" ? "partners" : "substances",
    responses: {
      "No": "Thanks for letting me know. I'll skip ahead to the next section.",
    },
  },
  {
    id: "partners",
    messages: ["Thanks for being open with me.", "In the past 12 months, what best describes your sexual partners?"],
    options: ["Male partners", "Female partners", "Both male and female", "Prefer not to say"],
    next: "condom",
  },
  {
    id: "condom",
    messages: ["How often do you use condoms or other barrier protection?"],
    options: ["Always", "Sometimes", "Rarely", "Never", "Prefer not to say"],
    next: "sti",
  },
  {
    id: "sti",
    messages: ["Have you ever been diagnosed with a sexually transmitted infection (STI)?"],
    options: ["Yes", "No", "Not sure", "Prefer not to say"],
    next: "substances",
  },
  {
    id: "substances",
    messages: ["Just a couple more questions — you're doing great.", "In the past 12 months, have you used any recreational drugs or substances?"],
    options: ["Yes", "No", "Prefer not to say"],
    next: "screening_offer",
  },
  {
    id: "screening_offer",
    messages: ["Thanks for answering all of that honestly. It really helps us take better care of you.", "Based on your responses, we'd like to offer you a free, confidential HIV screening test today as part of your ED visit.\n\nWould you like to be tested?"],
    options: ["Yes, test me", "No thanks", "I need more info"],
    next: "complete",
    responses: {
      "Yes, test me": "Great choice. Your care team will follow up with you about the test.",
      "No thanks": "That's completely okay. Your decision is respected, and it won't affect your care today.",
      "I need more info": "No problem. Your care team can answer any questions you have about HIV testing. It's a simple, quick test.",
    },
  },
  {
    id: "complete",
    messages: [],
    isComplete: true,
  },
];

// ── Color tokens ──
const TC_RED = "#CC0033";
const TC_BLUE = "#0066B3";
const CHAT_BG = "#f0f2f5";
const SUCCESS = "#2D8B4E";

// ── Typing indicator ──
function TypingDots() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
      <div style={avatarStyle}>TC</div>
      <div style={{
        background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "12px 18px",
        display: "flex", gap: 5, alignItems: "center", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%", background: "#94a3b8",
            animation: `dotPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

const avatarStyle = {
  width: 32, height: 32, borderRadius: "50%", background: TC_RED,
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0, letterSpacing: 0.5,
};

function BotBubble({ text, isPrivacy }) {
  if (isPrivacy) {
    return (
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <div style={avatarStyle}>TC</div>
        <div style={{
          background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "4px",
          maxWidth: "82%", boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14,
            padding: "10px 14px", margin: "6px 8px 2px",
          }}>
            <div style={{ fontSize: 12, color: TC_BLUE, lineHeight: 1.5 }}>
              🔒 <strong>Reminder:</strong> Your answers are private and will not be shared with anyone in the waiting room or your family.
            </div>
          </div>
          <div style={{ padding: "8px 14px 12px", fontSize: 15, lineHeight: 1.5, color: "#1a1a2e", whiteSpace: "pre-wrap" }}>
            {text}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
      <div style={avatarStyle}>TC</div>
      <div style={{
        background: "#fff", borderRadius: "18px 18px 18px 4px", padding: "12px 16px",
        maxWidth: "82%", fontSize: 15, lineHeight: 1.5, color: "#1a1a2e",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)", whiteSpace: "pre-wrap",
      }}>{text}</div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{
        background: TC_BLUE, borderRadius: "18px 18px 4px 18px", padding: "11px 16px",
        maxWidth: "75%", fontSize: 15, lineHeight: 1.4, color: "#fff",
      }}>{text}</div>
    </div>
  );
}

function OptionButton({ text, onClick, disabled }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={() => { if (!disabled) { setPressed(true); onClick(text); }}}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        padding: "10px 20px", borderRadius: 24,
        border: `1.5px solid ${pressed ? TC_BLUE : "#d0d5dd"}`,
        background: pressed ? "#e8f4fd" : "#fff",
        fontSize: 14, fontWeight: 500, color: pressed ? TC_BLUE : "#344054",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.15s ease", opacity: disabled ? 0.5 : 1,
        WebkitTapHighlightColor: "transparent", outline: "none",
        whiteSpace: "nowrap",
      }}
    >{text}</button>
  );
}

// ── Main App ──
export default function App() {
  const [screen, setScreen] = useState("landing"); // landing, language, consent, chat, complete, mhealth, done
  const [lang, setLang] = useState("en");
  const [chatLog, setChatLog] = useState([]);
  const [typing, setTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [answers, setAnswers] = useState({});
  const [mhealthEligible, setMhealthEligible] = useState(false);
  const scrollRef = useRef(null);
  const isProcessing = useRef(false);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, 50);
  }, []);

  // Deliver messages for a step
  const deliverStep = useCallback(async (stepIdx, customResponse) => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    
    const step = SURVEY_SCRIPT[stepIdx];
    if (!step) { isProcessing.current = false; return; }

    if (step.isComplete) {
      // Check mHealth eligibility (simplified: if sexually active and not always using condoms)
      const eligible = answers["sexual_activity"] === "Yes" || answers["hiv_test"] === "No";
      setMhealthEligible(eligible);
      setProgress(100);

      // Completion messages
      const completionMsgs = [
        "That's all the questions! You did great. 🎉",
        "Here's what happens next:\n\n✅ Your responses have been securely sent to your care team\n✅ A clinician may follow up with you\n✅ No data has been saved on your phone",
        "Thank you for participating. Your honesty helps us provide better care for young people like you. 🙏",
      ];

      for (const msg of completionMsgs) {
        setTyping(true);
        scrollToBottom();
        await delay(800 + Math.random() * 600);
        setTyping(false);
        setChatLog(prev => [...prev, { type: "bot", text: msg }]);
        scrollToBottom();
      }

      await delay(1200);
      if (eligible) {
        setScreen("mhealth");
      } else {
        setScreen("done");
      }
      isProcessing.current = false;
      return;
    }

    // Custom response from previous answer
    if (customResponse) {
      setTyping(true);
      scrollToBottom();
      await delay(500 + Math.random() * 400);
      setTyping(false);
      setChatLog(prev => [...prev, { type: "bot", text: customResponse }]);
      scrollToBottom();
    }

    // Privacy reminder
    const hasPrivacy = step.privacyReminder;

    // Deliver messages one at a time
    for (let i = 0; i < step.messages.length; i++) {
      setTyping(true);
      scrollToBottom();
      const baseDelay = step.messages[i].length > 80 ? 1200 : 700;
      await delay(baseDelay + Math.random() * 500);
      setTyping(false);
      const isLastMsg = i === step.messages.length - 1;
      setChatLog(prev => [...prev, {
        type: "bot",
        text: step.messages[i],
        isPrivacy: isLastMsg && hasPrivacy,
      }]);
      scrollToBottom();
    }

    // Show options
    setProgress(Math.round((stepIdx / (SURVEY_SCRIPT.length - 1)) * 100));
    setCurrentOptions(step.options || []);
    setAwaitingInput(true);
    scrollToBottom();
    isProcessing.current = false;
  }, [answers, scrollToBottom]);

  // Handle user response
  const handleAnswer = useCallback((answer) => {
    if (isProcessing.current) return;
    
    const step = SURVEY_SCRIPT[currentStep];
    setAwaitingInput(false);
    setCurrentOptions([]);
    setChatLog(prev => [...prev, { type: "user", text: answer }]);
    scrollToBottom();

    // Store answer
    setAnswers(prev => ({ ...prev, [step.id]: answer }));

    // Determine next step
    let nextId;
    if (typeof step.next === "function") {
      nextId = step.next(answer);
    } else {
      nextId = step.next;
    }
    const nextIdx = SURVEY_SCRIPT.findIndex(s => s.id === nextId);
    const customResponse = step.responses?.[answer] || null;

    setCurrentStep(nextIdx);
    setTimeout(() => deliverStep(nextIdx, customResponse), 400);
  }, [currentStep, deliverStep, scrollToBottom]);

  // Start chat
  const startChat = useCallback(() => {
    setScreen("chat");
    setTimeout(() => deliverStep(0), 600);
  }, [deliverStep]);

  // ── SCREENS ──

  if (screen === "landing") {
    return (
      <Shell>
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "32px 28px", background: "#fff",
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: `linear-gradient(135deg, ${TC_RED}, #a00028)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 8px 24px rgba(204,0,51,0.25)", marginBottom: 20,
          }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 26 }}>TC</span>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>
            Texas Children's Hospital
          </h1>
          <p style={{ fontSize: 14, fontWeight: 600, color: TC_BLUE, margin: "0 0 8px" }}>
            Emergency Department
          </p>
          <div style={{ width: 40, height: 3, background: TC_RED, borderRadius: 2, marginBottom: 20 }} />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", margin: "0 0 10px", textAlign: "center" }}>
            Health & Wellness Survey
          </h2>
          <p style={{
            fontSize: 14, color: "#667085", textAlign: "center", lineHeight: 1.6,
            margin: "0 0 32px", maxWidth: 300,
          }}>
            This short, private survey helps your care team understand your health needs better. Your answers are confidential and protected.
          </p>
          <button onClick={() => setScreen("language")} style={primaryBtnStyle}>
            Begin Survey
          </button>
          <p style={{ fontSize: 11, color: "#98a2b3", marginTop: 18, textAlign: "center" }}>
            🔒 HIPAA Compliant · Encrypted · No data stored on your device
          </p>
        </div>
      </Shell>
    );
  }

  if (screen === "language") {
    return (
      <Shell showBar>
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "32px 24px", background: "#fff",
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>🌐</div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px" }}>
            Choose Your Language
          </h2>
          <p style={{ fontSize: 13, color: "#667085", margin: "0 0 32px" }}>Elige tu idioma</p>
          <button
            onClick={() => { setLang("en"); setScreen("consent"); }}
            style={{
              width: "100%", maxWidth: 320, padding: "18px 20px", borderRadius: 14,
              border: `2px solid ${TC_BLUE}`, background: "#f0f6ff",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer", marginBottom: 14,
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: TC_BLUE }}>English</div>
              <div style={{ fontSize: 12, color: "#667085" }}>Continue in English</div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: "50%", background: TC_BLUE,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 14, fontWeight: 700,
            }}>✓</div>
          </button>
          <button
            onClick={() => { setLang("es"); setScreen("consent"); }}
            style={{
              width: "100%", maxWidth: 320, padding: "18px 20px", borderRadius: 14,
              border: "1.5px solid #e5e7eb", background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#344054" }}>Español</div>
              <div style={{ fontSize: 12, color: "#667085" }}>Continuar en español</div>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              border: "1.5px solid #d0d5dd",
            }} />
          </button>
        </div>
      </Shell>
    );
  }

  if (screen === "consent") {
    return (
      <Shell showBar>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", margin: 0 }}>Before We Start</h2>
          <p style={{ fontSize: 12, color: "#667085", margin: "2px 0 0" }}>Please review the following information</p>
        </div>
        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px", background: "#fff" }}>
          <div style={{
            background: "#fffbf0", border: "1px solid #fde68a", borderRadius: 12,
            padding: "14px 16px", marginBottom: 18,
          }}>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: "#92400e", margin: 0 }}>
              <strong>🔒 Your Privacy Is Protected</strong><br />
              Your answers are confidential. No information is stored on your phone. Your parent/guardian will not see your responses.
            </p>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px" }}>About This Survey</h3>
          <p style={{ fontSize: 13, color: "#344054", lineHeight: 1.7, margin: "0 0 16px" }}>
            This survey is part of a health research study. It asks questions about your health, including some personal topics. This helps us offer you the best care and connect you with services if needed.
          </p>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e", margin: "0 0 8px" }}>What to Know</h3>
          <div style={{ fontSize: 13, color: "#344054", lineHeight: 1.8, marginBottom: 20 }}>
            <div>• This is <strong>voluntary</strong> — you can stop at any time</div>
            <div>• Your answers are <strong>encrypted</strong> and sent securely</div>
            <div>• Your care will <strong>not change</strong> if you choose not to participate</div>
            <div>• Takes approximately <strong>3–5 minutes</strong></div>
          </div>
          <ConsentCheckbox onAgree={startChat} />
        </div>
      </Shell>
    );
  }

  if (screen === "mhealth") {
    return (
      <Shell>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "24px 20px", background: "#fff" }}>
          <div style={{
            border: "1px solid #e5e7eb", borderRadius: 16, padding: 20,
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `linear-gradient(135deg, ${TC_BLUE}, #004d86)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22,
              }}>💬</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a1a2e" }}>SMART Health Texts</div>
                <div style={{ fontSize: 12, color: "#667085" }}>Free · Confidential · Text-based</div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#344054", lineHeight: 1.6, margin: "0 0 8px" }}>
              Based on your responses, there's a free program that could be helpful for you.
            </p>
            <p style={{ fontSize: 13, color: "#667085", lineHeight: 1.6, margin: "0 0 20px" }}>
              Get private health info, appointment help, and support sent right to your phone. You can opt out at any time.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setScreen("done")} style={{
                flex: 1, padding: "14px 0", borderRadius: 24, border: "none",
                background: SUCCESS, color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}>Sign Me Up</button>
              <button onClick={() => setScreen("done")} style={{
                flex: 1, padding: "14px 0", borderRadius: 24,
                border: "1.5px solid #d0d5dd", background: "#fff",
                color: "#667085", fontSize: 15, fontWeight: 600, cursor: "pointer",
              }}>No Thanks</button>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#98a2b3", textAlign: "center", marginTop: 16, lineHeight: 1.5 }}>
            This is completely optional. Your care today won't be affected either way.
          </p>
        </div>
      </Shell>
    );
  }

  if (screen === "done") {
    return (
      <Shell>
        <div style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", padding: "32px 28px", background: "#fff", textAlign: "center",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%", background: "#f0fdf4",
            border: `3px solid ${SUCCESS}`, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 32, marginBottom: 20,
          }}>✓</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>All Done!</h2>
          <p style={{ fontSize: 14, color: "#667085", lineHeight: 1.6, margin: "0 0 24px", maxWidth: 280 }}>
            You can close this page now. Your care team has received your responses and may follow up with you.
          </p>
          <div style={{
            background: "#f9fafb", borderRadius: 12, padding: "16px 20px", width: "100%", maxWidth: 300,
          }}>
            <p style={{ fontSize: 12, color: "#98a2b3", margin: 0, lineHeight: 1.6 }}>
              🔒 No data has been saved on this device. Your responses were encrypted and transmitted securely.
            </p>
          </div>
          <button
            onClick={() => { setScreen("landing"); setChatLog([]); setCurrentStep(0); setAnswers({}); setProgress(0); }}
            style={{
              marginTop: 28, padding: "10px 28px", borderRadius: 20,
              border: "1.5px solid #d0d5dd", background: "#fff",
              fontSize: 13, fontWeight: 600, color: "#667085", cursor: "pointer",
            }}
          >
            Restart Demo
          </button>
        </div>
      </Shell>
    );
  }

  // ── CHAT SCREEN ──
  return (
    <Shell>
      {/* Chat header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 12,
        flexShrink: 0,
      }}>
        <div style={avatarStyle}>TC</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>Health Survey</div>
          <div style={{ fontSize: 11, color: "#667085" }}>🔒 Secure · Confidential</div>
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: TC_BLUE }}>{progress}%</div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 3, background: "#e5e7eb", flexShrink: 0 }}>
        <div style={{
          height: "100%", background: TC_BLUE, borderRadius: "0 2px 2px 0",
          width: `${progress}%`, transition: "width 0.6s ease",
        }} />
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{
        flex: 1, overflow: "auto", padding: "14px 14px 8px",
        background: CHAT_BG, display: "flex", flexDirection: "column", gap: 10,
        WebkitOverflowScrolling: "touch",
      }}>
        {chatLog.map((msg, i) => (
          <div key={i} style={{ animation: "fadeUp 0.25s ease" }}>
            {msg.type === "bot" ? (
              <BotBubble text={msg.text} isPrivacy={msg.isPrivacy} />
            ) : (
              <UserBubble text={msg.text} />
            )}
          </div>
        ))}
        {typing && <TypingDots />}
        
        {/* Options */}
        {awaitingInput && currentOptions.length > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8, padding: "4px 0 8px 40px",
            animation: "fadeUp 0.3s ease",
          }}>
            {currentOptions.map((opt, i) => (
              <OptionButton key={i} text={opt} onClick={handleAnswer} />
            ))}
          </div>
        )}
        <div style={{ height: 8 }} />
      </div>

      {/* Input area */}
      <div style={{
        background: "#fff", borderTop: "1px solid #e5e7eb",
        padding: "10px 16px 16px", flexShrink: 0,
      }}>
        <div style={{
          padding: "12px 18px", borderRadius: 24, background: "#f3f4f6",
          fontSize: 14, color: "#98a2b3",
        }}>
          {awaitingInput ? "Tap an option above..." : "Waiting..."}
        </div>
      </div>
    </Shell>
  );
}

// ── Shell (phone chrome) ──
function Shell({ children, showBar }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      background: "#fff", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      maxWidth: 480, margin: "0 auto", position: "relative",
    }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes dotPulse { 0%,80%,100% { opacity:0.3; transform:scale(0.8) } 40% { opacity:1; transform:scale(1.1) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; background: #fff; overflow-x: hidden; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      {showBar && (
        <div style={{
          padding: "8px 16px", background: "#f3f4f6",
          display: "flex", alignItems: "center", gap: 6,
          borderBottom: "1px solid #e5e7eb", flexShrink: 0,
        }}>
          <div style={{
            width: 14, height: 14, borderRadius: "50%", background: SUCCESS,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, color: "#fff", fontWeight: 700,
          }}>✓</div>
          <span style={{ fontSize: 12, color: "#344054" }}>s2p.texaschildrens.org/survey</span>
        </div>
      )}
      {children}
    </div>
  );
}

// ── Consent checkbox ──
function ConsentCheckbox({ onAgree }) {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <button
        onClick={() => setChecked(!checked)}
        style={{
          display: "flex", alignItems: "flex-start", gap: 12,
          background: "#f9fafb", borderRadius: 12, padding: 14,
          marginBottom: 18, border: "none", cursor: "pointer",
          width: "100%", textAlign: "left",
        }}
      >
        <div style={{
          width: 22, height: 22, borderRadius: 5, flexShrink: 0, marginTop: 1,
          border: checked ? "none" : "2px solid #d0d5dd",
          background: checked ? TC_BLUE : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s ease",
        }}>
          {checked && <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>✓</span>}
        </div>
        <span style={{ fontSize: 13, color: "#344054", lineHeight: 1.5 }}>
          I have read and understand this information, and I agree to participate in this survey.
        </span>
      </button>
      <button
        onClick={checked ? onAgree : undefined}
        style={{
          ...primaryBtnStyle,
          opacity: checked ? 1 : 0.45,
          cursor: checked ? "pointer" : "default",
        }}
      >
        I Agree — Start Survey
      </button>
    </div>
  );
}

// ── Shared styles ──
const primaryBtnStyle = {
  width: "100%", maxWidth: 320, padding: "15px 0", borderRadius: 26, border: "none",
  background: `linear-gradient(135deg, ${TC_BLUE}, #004d86)`,
  color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
  boxShadow: "0 4px 14px rgba(0,102,179,0.3)", letterSpacing: 0.3,
  WebkitTapHighlightColor: "transparent",
};

// ── Utility ──
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
