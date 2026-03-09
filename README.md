# ATN 164: Screen2Prevent — Personal Device Chatbot Demo

**Texas Children's Hospital — Emergency Department**

An interactive prototype demonstrating a QR code–initiated chatbot survey for the ATN 164 Screen2Prevent (S2P) study. This prototype shows how adolescents and young adults (ages 14–24) would complete an HIV screening and prevention survey on their personal mobile device in a pediatric ED setting.

## The Goal of using a personal device solves many issues including:

Device allocation. The device does not need to be purchased and managed by the hospital.
Device management. Patches and device security are not the responsibilty of the hospital. Theft or damage are not issues. The device belongs to the patient.
Comfort level. The device owned by the patient is known to them and they control it.
Contamination. The devices not need to be wiped down before beinging handled by another patient. This is their device and they own it.

---

## What's in This Repo

| File | Purpose |
|------|---------|
| `index.html` | **Interactive chatbot prototype** — the full patient experience from QR scan through survey completion and mHealth enrollment offer |
| `ATN164_QR_Sign_Generator.html` | **Printable QR sign generator** — enter your hosted URL to produce a branded triage room sign with a real, scannable QR code |

## Live Demo

**Chatbot:** [https://yourusername.github.io/atn164-demo/](https://yourusername.github.io/atn164-demo/)

**QR Sign Generator:** [https://yourusername.github.io/atn164-demo/ATN164_QR_Sign_Generator.html](https://yourusername.github.io/atn164-demo/ATN164_QR_Sign_Generator.html)

> Replace `yourusername` with your actual GitHub username after deploying.

## How to Demo

### Option A: Share the Link
Text or email the chatbot URL to anyone. They open it on their phone and tap through the full experience.

### Option B: Full QR Code Experience
1. Open the QR Sign Generator on a laptop
2. Paste in the chatbot URL
3. Print the generated sign (or display it on a tablet/screen)
4. People scan the QR code with their phone camera and land directly in the chatbot

### What the Patient Experiences

1. **QR Scan** — Simulated camera viewfinder recognizes the code; "Open in browser?" prompt appears
2. **Landing Page** — Texas Children's branded entry with HIPAA compliance badge
3. **Language Selection** — English / Spanish
4. **Informed Consent** — Privacy banner, study information, active checkbox acknowledgment
5. **Chatbot Survey** — Conversational tone, tap-to-select responses, empathetic acknowledgments, branching logic based on answers
6. **Sensitive Questions** — Inline privacy reminders appear before sensitive topics
7. **Survey Completion** — Confirmation that responses were sent securely and no data remains on device
8. **mHealth Enrollment** — SMART Health Texts offer for eligible patients (appears conditionally based on responses)

### Key Design Decisions

- **Privacy by design** — Inline encryption reminders before every sensitive question; explicit "your parent/guardian will not see your responses" messaging
- **Zero typing required** — Tap-to-select buttons throughout; critical for speed in an ED environment
- **Conversational tone** — Age-appropriate language for 14–24 year olds with empathetic acknowledgments that vary based on answers
- **Non-coercive flow** — "Prefer not to say" and skip options on every question; voluntary mHealth enrollment
- **Branching logic** — Survey adapts based on responses (e.g., sexual activity follow-ups only appear if relevant)

## About ATN 164 / Screen2Prevent

Screen2Prevent (S2P) is a multi-site study focused on increasing HIV screening and prevention linkage for adolescents and young adults in pediatric Emergency Departments. The study compares three screening approaches (targeted, opt-in, opt-out) and uses digital health tools (mHealth) to link eligible youth to PrEP and HIV care services.

This prototype demonstrates an enhanced delivery model where patients complete the screening survey on their personal mobile device via QR code, rather than on a shared hospital tablet — improving privacy, infection control, and adolescent comfort.

## Technical Details

- **Self-contained** — Each HTML file includes all code inline; no build step or dependencies to install
- **React 18** — Loaded via CDN (Cloudflare); no npm/node required
- **Mobile-first** — Designed for phone screens; works on any modern browser
- **No data collection** — This is a UI prototype only; no responses are stored or transmitted anywhere
- **No server required** — Runs entirely in the browser as static HTML

## Disclaimer

This is a **conceptual prototype for stakeholder review**. It is not an approved medical device, does not collect real patient data, and is not affiliated with or endorsed by Texas Children's Hospital or the ATN network. Survey questions shown are representative examples — final survey content would follow the IRB-approved ATN 164 protocol.

---

*Confidential — For internal review purposes only*
