import Link from 'next/link';
import {
  Compass,
  Smartphone,
  Sparkles,
  TreePine,
  ShieldCheck,
  CheckCircle,
  Eye,
  Volume2,
  Camera,
  ArrowRight,
  Flame,
  Award,
  Layers,
  Cpu,
} from 'lucide-react';
import SafetyBanner from '../components/SafetyBanner';

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto pt-2 sm:pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/10 dark:bg-emerald-400/10 border border-emerald-800/20 dark:border-emerald-400/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-bold tracking-wide">
          <TreePine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>DEV Hacktoberfest Challenge · Touch Grass</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.1]">
          AI Nature Quest
        </h1>

        <div className="space-y-1">
          <p className="text-xl sm:text-2xl font-bold text-emerald-800 dark:text-emerald-400 tracking-tight">
            AI generates the adventure.
          </p>
          <p className="text-xl sm:text-2xl font-bold text-stone-700 dark:text-stone-300 tracking-tight">
            You go live it.
          </p>
        </div>

        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Turn an ordinary walk into an AI-powered nature adventure. Complete real-world quests, discover something new, and put your phone away.
        </p>

        {/* Primary & Secondary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/quest/new"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Compass className="w-5 h-5 text-emerald-300" />
            <span>Start a Quest</span>
            <ArrowRight className="w-5 h-5 text-emerald-300" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-stone-200/80 dark:bg-stone-800/80 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-base transition-colors"
          >
            <span>How It Works</span>
          </a>
        </div>

        {/* Product Principle Callout */}
        <div className="pt-4 max-w-xl mx-auto">
          <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl border border-emerald-800/80 shadow-md text-left sm:text-center space-y-1">
            <span className="text-[11px] uppercase font-extrabold tracking-widest text-emerald-400 block">
              Core Design Principle
            </span>
            <p className="text-sm font-medium italic text-emerald-100">
              &ldquo;The better the user uses the app, the less time they spend looking at the screen.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step How It Works */}
      <section id="how-it-works" className="space-y-8 scroll-mt-20">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Field Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            How It Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="field-journal-card rounded-2xl p-6 relative border border-stone-300 dark:border-stone-800 space-y-4 hover:border-emerald-600/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">01</span>
              <div className="p-2.5 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Generate</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              AI creates a personalized outdoor quest tailored to your available time, target difficulty, and adventure style.
            </p>
          </div>

          {/* Step 2 */}
          <div className="field-journal-card rounded-2xl p-6 relative border-2 border-emerald-600/40 dark:border-emerald-500/40 bg-emerald-900/5 dark:bg-emerald-950/20 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">02</span>
              <div className="p-2.5 bg-emerald-600 text-stone-950 rounded-xl">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Explore</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Enter <strong>Phone Away Mode</strong>. Pocket your device, tune your senses, and immerse yourself in the natural world.
            </p>
          </div>

          {/* Step 3 */}
          <div className="field-journal-card rounded-2xl p-6 relative border border-stone-300 dark:border-stone-800 space-y-4 hover:border-emerald-600/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-black text-emerald-700 dark:text-emerald-400">03</span>
              <div className="p-2.5 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">Discover</h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Return with photos, acoustic recordings, or field observations. Receive AI evaluation, level up, and build your Nature Journal.
            </p>
          </div>
        </div>
      </section>

      {/* Why AI Nature Quest */}
      <section className="field-journal-card rounded-3xl p-6 sm:p-10 border border-stone-300 dark:border-stone-800 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            The Philosophy
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            Why AI Nature Quest?
          </h2>
          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300">
            Most mobile apps compete ruthlessly for your screentime. AI Nature Quest is engineered for the exact opposite.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-stone-200 dark:bg-stone-800 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0">
              <TreePine className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">Encourage Outdoor Exploration</h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Transforms parks, trails, backyards, and city streets into interactive living discovery grounds.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-stone-200 dark:bg-stone-800 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">Make Walks More Interesting</h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Challenges you to spot hidden leaf symmetries, micro-habitats, and seasonal patterns you normally walk right past.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-stone-200 dark:bg-stone-800 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">Gamified Observation</h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                Earn XP, unlock naturalist badges, level up your field rank, and document discoveries in your personal Nature Journal.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-3 bg-stone-200 dark:bg-stone-800 rounded-xl text-emerald-700 dark:text-emerald-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">Zero In-Walk Screen Interaction</h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400">
                The persistent Phone Away timer lets you silence digital noise and focus completely on the environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open AI Architecture Section */}
      <section className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
              <Cpu className="w-3.5 h-3.5" />
              <span>Pluggable AI Provider Architecture</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
              Open-Weight AI Ready
            </h2>
          </div>
          <Link
            href="/settings"
            className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>View Provider Settings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <p className="text-sm text-stone-300 leading-relaxed">
          AI Nature Quest is built with a strictly decoupled <code className="bg-stone-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-xs">AIProvider</code> contract.
          The public demo runs on a deterministic <strong>Demo AI Provider</strong> with zero API key dependencies. The architecture is ready for open-weight foundation models like <strong>Google Gemma</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span>Demo AI Provider</span>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded text-[10px]">ACTIVE</span>
            </div>
            <p className="text-stone-400">
              Deterministic, realistic naturalist challenges and evidence evaluation. Works 100% offline with zero external network calls.
            </p>
          </div>

          <div className="p-4 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2">
            <div className="flex items-center justify-between text-stone-300 font-bold">
              <span>Gemma Open-Weight Provider</span>
              <span className="px-2 py-0.5 bg-stone-800 text-stone-400 rounded text-[10px]">CONFIGURABLE</span>
            </div>
            <p className="text-stone-400">
              Designed for local inference servers (Ollama, vLLM, or serverless endpoints). Configurable via <code className="text-emerald-400">AI_PROVIDER=gemma</code>.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <SafetyBanner />

      {/* Final CTA Strip */}
      <section className="text-center py-6 space-y-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
          Ready to touch grass?
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Choose your walk duration, put your phone in your pocket, and explore the wild right outside.
        </p>
        <Link
          href="/quest/new"
          className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-lg shadow-lg hover:scale-105 transition-all"
        >
          <Compass className="w-5 h-5" />
          <span>Generate My First Quest</span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="pt-8 border-t border-stone-300 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400 space-y-2">
        <p>
          AI Nature Quest · Built for DEV.to Hacktoberfest Open-Source AI Challenge: <em>Touch Grass</em>.
        </p>
        <p>
          100% Local Browser Storage · Zero User Tracking · Privacy First
        </p>
      </footer>
    </div>
  );
}
