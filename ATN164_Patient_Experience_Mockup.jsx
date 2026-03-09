import { useState, useEffect, useRef } from "react";

const SCREENS = [
  {
    id: "qr",
    label: "QR Scan",
    phase: "Phase 3 — QR Code Scan",
  },
  {
    id: "landing",
    label: "Landing Page",
    phase: "Phase 3 — Chatbot Launch",
  },
  {
    id: "language",
    label: "Language",
    phase: "Phase 3 — Language Selection",
  },
  {
    id: "consent",
    label: "Consent",
    phase: "Phase 3 — Informed Consent",
  },
  {
    id: "welcome",
    label: "Welcome",
    phase: "Phase 4 — Survey Start",
  },
  {
    id: "question1",
    label: "Question",
    phase: "Phase 4 — Screening Question",
  },
  {
    id: "sensitive",
    label: "Sensitive Q",
    phase: "Phase 4 — Sensitive Question",
  },
  {
    id: "complete",
    label: "Complete",
    phase: "Phase 4 — Survey Complete",
  },
  {
    id: "mhealth",
    label: "mHealth",
    phase: "Phase 6 — mHealth Enrollment",
  },
];

// Texas Children's brand colors
const TC_RED = "#CC0033";
const TC_DARK = "#1a1a2e";
const TC_BLUE = "#0066B3";
const CHAT_BG = "#f0f2f5";
const BOT_BUBBLE = "#ffffff";
const USER_BUBBLE = "#0066B3";
const SUCCESS_GREEN = "#2D8B4E";

function PhoneFrame({ children, time = "10:42 AM" }) {
  return (
    <div style={{
      width: 310,
      height: 620,
      borderRadius: 40,
      background: "#1a1a1a",
      padding: "12px 8px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08) inset",
      position: "relative",
      flexShrink: 0,
    }}>
      {/* Notch */}
      <div style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: 100,
        height: 26,
        borderRadius: "0 0 16px 16px",
        background: "#1a1a1a",
        zIndex: 20,
      }} />
      {/* Screen */}
      <div style={{
        width: "100%",
        height: "100%",
        borderRadius: 32,
        overflow: "hidden",
        background: "#fff",
        position: "relative",
      }}>
        {/* Status bar */}
        <div style={{
          height: 40,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          fontSize: 11,
          fontWeight: 600,
          color: "#000",
          zIndex: 10,
          position: "relative",
        }}>
          <span>{time}</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0" y="6" width="2.5" height="4" rx="0.5" fill="#000"/><rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill="#000"/><rect x="7" y="2" width="2.5" height="8" rx="0.5" fill="#000"/><rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill="#000"/></svg>
            <svg width="20" height="10" viewBox="0 0 20 10"><rect x="0" y="0" width="18" height="10" rx="2" stroke="#000" strokeWidth="1" fill="none"/><rect x="1.5" y="1.5" width="12" height="7" rx="1" fill="#2D8B4E"/><rect x="18.5" y="3" width="1.5" height="4" rx="0.5" fill="#000"/></svg>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function BotMessage({ text, delay = 0, children }) {
  const [visible, setVisible] = useState(delay === 0);
  useEffect(() => {
    if (delay > 0) {
      const t = setTimeout(() => setVisible(true), delay);
      return () => clearTimeout(t);
    }
  }, [delay]);
  if (!visible) return null;
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-end", animation: "fadeSlideUp 0.3s ease" }}>
      <div style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: TC_RED,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        color: "#fff",
        fontWeight: 700,
        flexShrink: 0,
      }}>TC</div>
      <div style={{
        background: BOT_BUBBLE,
        borderRadius: "16px 16px 16px 4px",
        padding: "10px 14px",
        maxWidth: "78%",
        fontSize: 13,
        lineHeight: 1.45,
        color: "#1a1a1a",
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      }}>
        {text && <span>{text}</span>}
        {children}
      </div>
    </div>
  );
}

function UserMessage({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 10, animation: "fadeSlideUp 0.3s ease" }}>
      <div style={{
        background: USER_BUBBLE,
        borderRadius: "16px 16px 4px 16px",
        padding: "10px 14px",
        maxWidth: "72%",
        fontSize: 13,
        lineHeight: 1.45,
        color: "#fff",
      }}>{text}</div>
    </div>
  );
}

function ChoiceButton({ text, selected, muted }) {
  return (
    <div style={{
      padding: "9px 14px",
      borderRadius: 20,
      border: selected ? `2px solid ${TC_BLUE}` : "1.5px solid #d0d5dd",
      background: selected ? "#e8f0fe" : "#fff",
      fontSize: 13,
      color: selected ? TC_BLUE : "#344054",
      fontWeight: selected ? 600 : 400,
      cursor: "pointer",
      textAlign: "center",
      opacity: muted ? 0.45 : 1,
    }}>{text}</div>
  );
}

function ProgressBar({ pct }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "0 16px 6px" }}>
      <div style={{ flex: 1, height: 4, borderRadius: 2, background: "#e5e7eb" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: TC_BLUE, transition: "width 0.5s ease" }} />
      </div>
      <span style={{ fontSize: 10, color: "#98a2b3", fontWeight: 600 }}>{pct}%</span>
    </div>
  );
}

function ChatHeader({ title, subtitle }) {
  return (
    <div style={{
      background: "#fff",
      borderBottom: "1px solid #e5e7eb",
      padding: "8px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}>
      <div style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        background: TC_RED,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        color: "#fff",
        fontWeight: 700,
      }}>TC</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{title}</div>
        <div style={{ fontSize: 10, color: "#667085" }}>{subtitle}</div>
      </div>
      <div style={{ marginLeft: "auto" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="#98a2b3"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>
      </div>
    </div>
  );
}

// ============ SCREEN COMPONENTS ============

function QRScreen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8f9fa", padding: 24 }}>
      <div style={{ fontSize: 11, color: "#667085", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 600, marginBottom: 12 }}>Camera Active</div>
      <div style={{
        width: 180,
        height: 180,
        border: "3px solid rgba(0,102,179,0.3)",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background: "rgba(0,0,0,0.03)",
      }}>
        {/* Corner brackets */}
        {[[0,0],[1,0],[0,1],[1,1]].map(([x,y], i) => (
          <div key={i} style={{
            position: "absolute",
            [y === 0 ? "top" : "bottom"]: -2,
            [x === 0 ? "left" : "right"]: -2,
            width: 28,
            height: 28,
            borderColor: TC_BLUE,
            borderStyle: "solid",
            borderWidth: 0,
            borderTopWidth: y === 0 ? 3 : 0,
            borderBottomWidth: y === 1 ? 3 : 0,
            borderLeftWidth: x === 0 ? 3 : 0,
            borderRightWidth: x === 1 ? 3 : 0,
            borderRadius: y === 0 && x === 0 ? "8px 0 0 0" : y === 0 && x === 1 ? "0 8px 0 0" : y === 1 && x === 0 ? "0 0 0 8px" : "0 0 8px 0",
          }} />
        ))}
        {/* QR Code representation */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, width: 100, height: 100 }}>
          {Array.from({ length: 49 }).map((_, i) => {
            const r = Math.floor(i / 7), c = i % 7;
            const isCorner = (r < 3 && c < 3) || (r < 3 && c > 3) || (r > 3 && c < 3);
            const isFill = isCorner || [10,11,17,20,24,25,31,32,38,39,40].includes(i);
            return <div key={i} style={{ background: isFill ? "#1a1a2e" : "#d0d5dd", borderRadius: 1.5, aspectRatio: "1" }} />;
          })}
        </div>
      </div>
      <div style={{
        marginTop: 20,
        background: "#fff",
        borderRadius: 12,
        padding: "12px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        textAlign: "center",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1a1a" }}>Open in Browser?</div>
        <div style={{ fontSize: 10, color: "#667085", marginTop: 2, marginBottom: 8 }}>s2p.texaschildrens.org/survey</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <div style={{ padding: "6px 18px", borderRadius: 16, background: "#e5e7eb", fontSize: 11, color: "#344054", fontWeight: 600 }}>Cancel</div>
          <div style={{ padding: "6px 18px", borderRadius: 16, background: TC_BLUE, fontSize: 11, color: "#fff", fontWeight: 600 }}>Open</div>
        </div>
      </div>
    </div>
  );
}

function LandingScreen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", background: "#fff" }}>
      {/* Browser bar */}
      <div style={{ padding: "6px 14px", background: "#f3f4f6", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e5e7eb" }}>
        <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill={SUCCESS_GREEN}/><path d="M3 5.2l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>
        <span style={{ fontSize: 10, color: "#344054" }}>s2p.texaschildrens.org/survey</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28 }}>
        {/* Logo area */}
        <div style={{
          width: 70,
          height: 70,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${TC_RED}, #a00028)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          boxShadow: "0 4px 16px rgba(204,0,51,0.25)",
        }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 22 }}>TC</span>
        </div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a", textAlign: "center", marginBottom: 4 }}>Texas Children's Hospital</div>
        <div style={{ fontSize: 13, color: TC_BLUE, fontWeight: 600, marginBottom: 6 }}>Emergency Department</div>
        <div style={{ width: 40, height: 2, background: TC_RED, borderRadius: 1, marginBottom: 16 }} />
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a1a", textAlign: "center", marginBottom: 6 }}>Health & Wellness Survey</div>
        <div style={{ fontSize: 11, color: "#667085", textAlign: "center", lineHeight: 1.5, marginBottom: 28, padding: "0 8px" }}>
          This short, private survey helps your care team understand your health needs better. Your answers are confidential and protected.
        </div>
        <div style={{
          width: "100%",
          padding: "13px 0",
          borderRadius: 24,
          background: `linear-gradient(135deg, ${TC_BLUE}, #004d86)`,
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,102,179,0.3)",
          letterSpacing: 0.3,
        }}>Begin Survey</div>
        <div style={{ fontSize: 9, color: "#98a2b3", marginTop: 14, textAlign: "center" }}>
          🔒 HIPAA Compliant · Encrypted · No data stored on your device
        </div>
      </div>
    </div>
  );
}

function LanguageScreen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ padding: "6px 14px", background: "#f3f4f6", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e5e7eb" }}>
        <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill={SUCCESS_GREEN}/><path d="M3 5.2l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>
        <span style={{ fontSize: 10, color: "#344054" }}>s2p.texaschildrens.org/survey</span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ fontSize: 28, marginBottom: 16 }}>🌐</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a", marginBottom: 4 }}>Choose Your Language</div>
        <div style={{ fontSize: 12, color: "#667085", marginBottom: 28 }}>Elige tu idioma</div>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{
            padding: "16px 20px",
            borderRadius: 14,
            border: `2px solid ${TC_BLUE}`,
            background: "#f0f6ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: TC_BLUE }}>English</div>
              <div style={{ fontSize: 10, color: "#667085" }}>Continue in English</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: TC_BLUE, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-5" stroke="#fff" strokeWidth="1.8" fill="none"/></svg>
            </div>
          </div>
          <div style={{
            padding: "16px 20px",
            borderRadius: 14,
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#344054" }}>Español</div>
              <div style={{ fontSize: 10, color: "#667085" }}>Continuar en español</div>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: "50%", border: "1.5px solid #d0d5dd" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsentScreen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", background: "#fff" }}>
      <div style={{ padding: "6px 14px", background: "#f3f4f6", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e5e7eb" }}>
        <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill={SUCCESS_GREEN}/><path d="M3 5.2l1.5 1.5 3-3" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>
        <span style={{ fontSize: 10, color: "#344054" }}>s2p.texaschildrens.org/survey</span>
      </div>
      <div style={{ padding: "16px 18px", borderBottom: "1px solid #e5e7eb" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>Before We Start</div>
        <div style={{ fontSize: 11, color: "#667085" }}>Please review the following information</div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: "14px 18px" }}>
        <div style={{
          background: "#fffbf0",
          border: "1px solid #fde68a",
          borderRadius: 10,
          padding: "10px 12px",
          marginBottom: 14,
          fontSize: 11,
          lineHeight: 1.5,
          color: "#92400e",
        }}>
          <span style={{ fontWeight: 700 }}>🔒 Your Privacy Is Protected</span><br/>
          Your answers are confidential. No information is stored on your phone. Your parent/guardian will not see your responses.
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>About This Survey</div>
        <div style={{ fontSize: 11, color: "#344054", lineHeight: 1.6, marginBottom: 12 }}>
          This survey is part of a health research study. It asks questions about your health, including some personal topics. This helps us offer you the best care and connect you with services if needed.
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>What to Know</div>
        <div style={{ fontSize: 11, color: "#344054", lineHeight: 1.6, marginBottom: 4 }}>
          • This is <b>voluntary</b> — you can stop at any time
        </div>
        <div style={{ fontSize: 11, color: "#344054", lineHeight: 1.6, marginBottom: 4 }}>
          • Your answers are <b>encrypted</b> and sent securely
        </div>
        <div style={{ fontSize: 11, color: "#344054", lineHeight: 1.6, marginBottom: 4 }}>
          • Your care will <b>not change</b> if you choose not to participate
        </div>
        <div style={{ fontSize: 11, color: "#344054", lineHeight: 1.6, marginBottom: 14 }}>
          • Takes approximately <b>3–5 minutes</b>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#f9fafb", borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${TC_BLUE}`, background: TC_BLUE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l3 3 5-5" stroke="#fff" strokeWidth="2" fill="none"/></svg>
          </div>
          <div style={{ fontSize: 11, color: "#344054", lineHeight: 1.5 }}>
            I have read and understand this information, and I agree to participate in this survey.
          </div>
        </div>
      </div>
      <div style={{ padding: "10px 18px 16px", borderTop: "1px solid #e5e7eb" }}>
        <div style={{
          width: "100%",
          padding: "12px 0",
          borderRadius: 22,
          background: `linear-gradient(135deg, ${TC_BLUE}, #004d86)`,
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          textAlign: "center",
        }}>I Agree — Start Survey</div>
      </div>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", background: CHAT_BG }}>
      <ChatHeader title="Health Survey" subtitle="Secure · Confidential" />
      <ProgressBar pct={0} />
      <div style={{ flex: 1, overflow: "auto", padding: "12px 14px" }}>
        <BotMessage>
          <div>Hey there! 👋</div>
          <div style={{ marginTop: 6 }}>I'm here to ask you a few quick questions about your health. Everything you share is <b>completely private</b>.</div>
        </BotMessage>
        <BotMessage delay={200}>
          <div>There are no wrong answers — just answer honestly. You can skip any question you're not comfortable with.</div>
        </BotMessage>
        <BotMessage delay={400}>
          <div>Let's start with something easy. How old are you?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            <ChoiceButton text="14–15" />
            <ChoiceButton text="16–17" />
            <ChoiceButton text="18–20" selected />
            <ChoiceButton text="21–24" />
          </div>
        </BotMessage>
        <UserMessage text="18–20" />
      </div>
    </div>
  );
}

function Question1Screen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", background: CHAT_BG }}>
      <ChatHeader title="Health Survey" subtitle="Secure · Confidential" />
      <ProgressBar pct={25} />
      <div style={{ flex: 1, overflow: "auto", padding: "12px 14px" }}>
        <BotMessage>
          <div>Got it! Next — do you have a primary care doctor or clinic you visit regularly?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            <ChoiceButton text="Yes" muted />
            <ChoiceButton text="No" selected />
            <ChoiceButton text="Not sure" muted />
          </div>
        </BotMessage>
        <UserMessage text="No" />
        <BotMessage delay={100}>
          <div>Thanks for letting me know. That's actually more common than you might think.</div>
        </BotMessage>
        <BotMessage delay={300}>
          <div>Have you ever been tested for HIV?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            <ChoiceButton text="Yes" />
            <ChoiceButton text="No" />
            <ChoiceButton text="Not sure" />
            <ChoiceButton text="Prefer not to say" />
          </div>
        </BotMessage>
      </div>
      {/* Input area */}
      <div style={{ padding: "8px 14px 14px", background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, padding: "8px 14px", borderRadius: 20, background: "#f3f4f6", fontSize: 12, color: "#98a2b3" }}>Tap an option above...</div>
      </div>
    </div>
  );
}

function SensitiveScreen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", background: CHAT_BG }}>
      <ChatHeader title="Health Survey" subtitle="🔒 Encrypted" />
      <ProgressBar pct={62} />
      <div style={{ flex: 1, overflow: "auto", padding: "12px 14px" }}>
        <BotMessage>
          <div style={{
            background: "#f0f6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 8,
            padding: "8px 10px",
            marginBottom: 8,
            fontSize: 11,
            color: TC_BLUE,
          }}>
            🔒 Reminder: Your answers are private and will not be shared with anyone in the waiting room or your family.
          </div>
          <div>In the past 12 months, have you been sexually active?</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            <ChoiceButton text="Yes" />
            <ChoiceButton text="No" />
            <ChoiceButton text="Prefer not to say" />
          </div>
        </BotMessage>
      </div>
      <div style={{ padding: "8px 14px 14px", background: "#fff", borderTop: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, padding: "8px 14px", borderRadius: 20, background: "#f3f4f6", fontSize: 12, color: "#98a2b3" }}>Tap an option above...</div>
      </div>
    </div>
  );
}

function CompleteScreen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", background: CHAT_BG }}>
      <ChatHeader title="Health Survey" subtitle="Complete" />
      <ProgressBar pct={100} />
      <div style={{ flex: 1, overflow: "auto", padding: "12px 14px" }}>
        <BotMessage>
          <div>That's all the questions! You did great. 🎉</div>
        </BotMessage>
        <BotMessage delay={200}>
          <div>Here's what happens next:</div>
          <div style={{ marginTop: 8, fontSize: 12, lineHeight: 1.7 }}>
            <div>✅ Your responses have been securely sent</div>
            <div>✅ Your care team may follow up with you</div>
            <div>✅ No data is saved on your phone</div>
          </div>
        </BotMessage>
        <BotMessage delay={400}>
          <div style={{
            background: `linear-gradient(135deg, #f0fdf4, #dcfce7)`,
            border: `1px solid #86efac`,
            borderRadius: 10,
            padding: "12px 14px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🙏</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: SUCCESS_GREEN }}>Thank You</div>
            <div style={{ fontSize: 11, color: "#344054", marginTop: 4 }}>Your participation helps us improve care for young people like you.</div>
          </div>
        </BotMessage>
      </div>
    </div>
  );
}

function MHealthScreen() {
  return (
    <div style={{ height: "calc(100% - 40px)", display: "flex", flexDirection: "column", background: CHAT_BG }}>
      <ChatHeader title="Health Survey" subtitle="One More Thing" />
      <div style={{ flex: 1, overflow: "auto", padding: "12px 14px" }}>
        <BotMessage>
          <div>Based on your responses, there's a free program that could be helpful for you.</div>
        </BotMessage>
        <BotMessage delay={200}>
          <div style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: 12,
            padding: 14,
            marginTop: 4,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${TC_BLUE}, #004d86)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontSize: 16 }}>💬</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>SMART Health Texts</div>
                <div style={{ fontSize: 10, color: "#667085" }}>Free · Confidential · Text-based</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#344054", lineHeight: 1.5, marginBottom: 10 }}>
              Get private health info, appointment help, and support sent right to your phone. You can opt out anytime.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 18,
                background: SUCCESS_GREEN,
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                textAlign: "center",
              }}>Sign Me Up</div>
              <div style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: 18,
                border: "1.5px solid #d0d5dd",
                color: "#667085",
                fontSize: 12,
                fontWeight: 600,
                textAlign: "center",
              }}>No Thanks</div>
            </div>
          </div>
        </BotMessage>
        <BotMessage delay={400}>
          <div style={{ fontSize: 11, color: "#667085" }}>This is completely optional. Your care today won't be affected either way.</div>
        </BotMessage>
      </div>
    </div>
  );
}

const SCREEN_MAP = {
  qr: QRScreen,
  landing: LandingScreen,
  language: LanguageScreen,
  consent: ConsentScreen,
  welcome: WelcomeScreen,
  question1: Question1Screen,
  sensitive: SensitiveScreen,
  complete: CompleteScreen,
  mhealth: MHealthScreen,
};

export default function App() {
  const [activeIdx, setActiveIdx] = useState(0);
  const screen = SCREENS[activeIdx];
  const ScreenComponent = SCREEN_MAP[screen.id];
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const btn = scrollRef.current.children[activeIdx];
      if (btn) btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeIdx]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "24px 16px",
    }}>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2.5, color: "#64748b", fontWeight: 600, marginBottom: 4 }}>ATN 164 · Screen2Prevent</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5 }}>Patient Experience Mockup</h1>
        <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Tap screens below to walk through the patient journey</div>
      </div>

      {/* Phase label */}
      <div style={{
        margin: "14px 0 10px",
        padding: "6px 16px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.08)",
        fontSize: 12,
        color: "#94a3b8",
        fontWeight: 600,
      }}>
        {screen.phase}
      </div>

      {/* Screen tabs */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 20,
          maxWidth: "100%",
          overflowX: "auto",
          padding: "4px 8px",
        }}
      >
        {SCREENS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActiveIdx(i)}
            style={{
              padding: "6px 12px",
              borderRadius: 14,
              border: "none",
              background: i === activeIdx ? TC_BLUE : "rgba(255,255,255,0.06)",
              color: i === activeIdx ? "#fff" : "#64748b",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
            }}
          >{i + 1}. {s.label}</button>
        ))}
      </div>

      {/* Phone */}
      <PhoneFrame>
        <ScreenComponent />
      </PhoneFrame>

      {/* Navigation arrows */}
      <div style={{ display: "flex", gap: 16, marginTop: 20, alignItems: "center" }}>
        <button
          onClick={() => setActiveIdx(Math.max(0, activeIdx - 1))}
          disabled={activeIdx === 0}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: activeIdx === 0 ? "transparent" : "rgba(255,255,255,0.06)",
            color: activeIdx === 0 ? "#334155" : "#94a3b8",
            fontSize: 18,
            cursor: activeIdx === 0 ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >←</button>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
          {activeIdx + 1} / {SCREENS.length}
        </span>
        <button
          onClick={() => setActiveIdx(Math.min(SCREENS.length - 1, activeIdx + 1))}
          disabled={activeIdx === SCREENS.length - 1}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: activeIdx === SCREENS.length - 1 ? "transparent" : "rgba(255,255,255,0.06)",
            color: activeIdx === SCREENS.length - 1 ? "#334155" : "#94a3b8",
            fontSize: 18,
            cursor: activeIdx === SCREENS.length - 1 ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >→</button>
      </div>

      <div style={{ marginTop: 16, fontSize: 10, color: "#475569", textAlign: "center", maxWidth: 320, lineHeight: 1.5 }}>
        These are conceptual mockups for stakeholder review. Final UI will reflect Texas Children's brand guidelines and IRB-approved survey language.
      </div>
    </div>
  );
}
