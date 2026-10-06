# AI Nature Quest 🌿

> **AI generates the adventure. You go live it.**

AI Nature Quest is an open-source Progressive Web App (PWA) outdoor adventure game that generates real-world nature quests and encourages users to put their phone away, go outside, explore, and return later to submit evidence of what they discovered.

Built for the **DEV.to Hacktoberfest Open-Source AI Challenge — Week 1: Touch Grass**.

---

## 🧭 Core Product Principle

> **"The better the user uses the app, the less time they spend looking at the screen."**

Most mobile AI applications compete for continuous screen time. AI Nature Quest is deliberately architected for the inverse: AI serves as the catalyst that sends you outdoors into the living environment, while **Phone Away Mode** silences screen distractions during your walk.

---

## ✨ Key Features

* 📱 **PWA & Offline Capability**: Installable on iOS/Android home screens with service worker offline caching and local storage persistence.
* 🌿 **AI Quest Generator**: Customizes outdoor challenges based on walk duration (15m, 30m, 45m, 60m), difficulty (Easy, Moderate, Challenging), and adventure style (Nature, Wildlife, Photography, Exploration, Mindfulness, Mystery).
* 📵 **Signature Phone Away Mode**: Ambient, high-contrast countdown timer designed to discourage screen usage during outdoor exploration. Persists across browser refreshes and device restarts.
* 📷 **Multimodal Evidence Submission**: Submit environmental proof for each objective via camera capture, audio recording (MediaRecorder API with graceful fallbacks), or descriptive naturalist notes.
* 🤖 **AI Naturalist Evaluation**: Instant verification and botanical feedback with confidence scoring and XP rewards.
* 📖 **Field Nature Journal**: Personal, 100% private offline archive of all your discoveries, observations, and photos.
* 🏆 **Deterministic Progression System**: Real XP calculations, Level milestones, and unlockable naturalist badges (e.g., *Botanist Eyes*, *Soundscape Listener*, *Screen Free Explorer*).
* 🛡️ **Safety & Privacy First**: Zero user tracking, no accounts or passwords required, no remote telemetry, and built-in outdoor safety guidelines.

---

## 🏗️ Architecture

AI Nature Quest follows modern Next.js App Router conventions with a strict separation between UI, state management, storage, and AI inference.

```text
                           AI Nature Quest (Next.js PWA)
                                        |
                                   AIProvider
                                  (Interface)
                                        |
                     +------------------+------------------+
                     |                                     |
              DemoAIProvider                        GemmaAIProvider
                     |                                     |
        Deterministic Naturalist              Future Open-Weight Model
        Evaluations & 100% Offline            (Ollama / vLLM / Endpoint)
```

### AI Provider Architecture

The application communicates exclusively through the `AIProvider` interface:

```typescript
export interface AIProvider {
  name: string;
  isDeterministic: boolean;
  generateQuest(input: QuestRequest): Promise<Quest>;
  evaluateEvidence(input: EvidenceRequest): Promise<EvidenceResult>;
}
```

#### Demo AI Provider (Default)
The current public demo runs on a deterministic **Demo AI Provider**. This allows anyone to clone or deploy the app and experience the full quest and evaluation loop immediately with zero API keys and zero network latency.

#### Future Gemma Open-Weight Model Integration
The architecture is prepared for open-weight foundation models like **Google Gemma** (running via Ollama, vLLM, or serverless endpoints). To switch providers, configure:

```env
AI_PROVIDER=gemma
AI_API_URL=http://localhost:11434/api/generate
AI_MODEL=gemma-2-9b-it
```

If `gemma` is selected without a configured endpoint, the application presents a clear architectural error rather than silently falling back.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js 18.x or later
* npm or yarn

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ai-nature-quest.git
cd ai-nature-quest

# 2. Install dependencies
npm install

# 3. Start development server (Zero API keys needed!)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env.local
```

### Available Environment Variables

```env
# AI Provider ('demo' or 'gemma')
AI_PROVIDER=demo

# Optional Open-Weight Model Parameters (for future Gemma integration)
AI_MODEL=gemma-2-9b-it
AI_API_URL=
AI_API_KEY=

# Client-side mirror
NEXT_PUBLIC_AI_PROVIDER=demo
```

---

## 📦 Production Build & Netlify Deployment

The project is fully prepared for one-click deployment to **Netlify** or Vercel.

### Building Locally

```bash
npm run build
npm run start
```

### Netlify Deployment Steps
1. Push your repository to GitHub.
2. Link the repository in the **Netlify Dashboard**.
3. Build Settings:
   * **Base directory**: `/` (or root)
   * **Build command**: `npm run build`
   * **Publish directory**: `.next`
4. Netlify will automatically detect Next.js App Router and deploy without requiring any backend servers.

---

## 🔒 Privacy & Safety

* **100% Local Storage**: All journal entries, photos, and quest progress stay in your browser's IndexedDB / LocalStorage. Nothing is uploaded to remote servers in Demo mode.
* **No Account Required**: Instant play without signing up or providing personal information.
* **Outdoor Safety Advisory**: Stay on marked public trails, maintain spatial awareness, respect wildlife distance, and never touch or ingest unknown wild plants based on AI suggestions.

---

## 📄 License

Open-source under the [MIT License](LICENSE).
