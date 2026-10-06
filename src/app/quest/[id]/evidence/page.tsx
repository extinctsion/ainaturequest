'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  FileText,
  CheckCircle2,
  Sparkles,
  Award,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Clock,
  Trash2,
  X,
  Play,
  Square,
} from 'lucide-react';
import {
  getActiveQuestSession,
  saveEvidenceToSession,
  updateSessionStatus,
} from '../../../../lib/storage/session';
import { getAIProvider } from '../../../../lib/ai';
import { DEMO_QUEST_DATABASE } from '../../../../lib/ai/demo-provider';
import {
  Quest,
  QuestObjective,
  QuestSession,
  Evidence,
  EvidenceResult,
} from '../../../../lib/types/quest';

export default function EvidenceSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [session, setSession] = useState<QuestSession | null>(null);
  const [quest, setQuest] = useState<Quest | null>(null);
  const [activeObjectiveIndex, setActiveObjectiveIndex] = useState<number>(0);

  // Per-objective user input state
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [textObservation, setTextObservation] = useState<string>('');
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string>('');
  const [audioPermissionError, setAudioPermissionError] = useState<string | null>(null);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  // Evaluation states
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EvidenceResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let currentSession = getActiveQuestSession();
    if (!currentSession || currentSession.quest.id !== resolvedParams.id) {
      const fallbackQuest =
        DEMO_QUEST_DATABASE.find((q) => q.id === resolvedParams.id) ||
        DEMO_QUEST_DATABASE[0];
      const now = Date.now();
      currentSession = {
        id: `session_${Date.now()}_${fallbackQuest.id}`,
        quest: fallbackQuest,
        startTime: now - 30 * 60 * 1000,
        targetEndTime: now,
        status: 'review',
        elapsedSeconds: 30 * 60,
        submittedEvidence: {},
        evaluations: {},
        totalXpEarned: 0,
      };
    }
    setSession(currentSession);
    setQuest(currentSession.quest);

    // If active objective already has evaluation in session, restore it
    const activeObj = currentSession.quest.objectives[activeObjectiveIndex];
    if (activeObj && currentSession.evaluations[activeObj.id]) {
      setEvaluationResult(currentSession.evaluations[activeObj.id]);
    } else {
      setEvaluationResult(null);
    }
  }, [resolvedParams.id, activeObjectiveIndex]);

  const currentObjective: QuestObjective | undefined =
    quest?.objectives[activeObjectiveIndex];

  // Handle Photo input (camera or upload)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
      setCameraPermissionError(null);
    };
    reader.readAsDataURL(file);
  };

  // Handle Audio recording via Web MediaRecorder API
  const handleStartAudioRecording = async () => {
    setAudioPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setRecordedAudioUrl(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      console.warn('Microphone permission denied or unsupported:', err);
      setAudioPermissionError(
        'Microphone access was not available. You can describe the natural sound in the text field below.'
      );
      setIsRecordingAudio(false);
    }
  };

  const handleStopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  // Submit current objective evidence for AI evaluation
  const handleSubmitObjectiveEvidence = async () => {
    if (!currentObjective || !quest) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    let evidenceData = '';
    if (currentObjective.evidenceType === 'photo') {
      evidenceData = photoPreview || 'Sample Leaf / Botanical Discovery Photo';
    } else if (currentObjective.evidenceType === 'audio') {
      evidenceData = recordedAudioUrl || textObservation || 'Chirping songbird in high conifer canopy';
    } else {
      evidenceData = textObservation || 'Observed distinct micro-ecosystem details and subtle natural patterns.';
    }

    const evidence: Evidence = {
      objectiveId: currentObjective.id,
      type: currentObjective.evidenceType,
      data: evidenceData,
      note: textObservation,
      timestamp: Date.now(),
    };

    try {
      const provider = getAIProvider();
      const result = await provider.evaluateEvidence({
        questId: quest.id,
        objective: currentObjective,
        evidence,
      });

      // Save to session storage
      const updatedSession = saveEvidenceToSession(currentObjective.id, evidence, result);
      if (updatedSession) {
        setSession(updatedSession);
      }

      setEvaluationResult(result);
    } catch (err) {
      console.error('Evidence evaluation failed:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextObjective = () => {
    if (!quest) return;
    setPhotoPreview('');
    setTextObservation('');
    setRecordedAudioUrl('');
    setAudioPermissionError(null);
    setEvaluationResult(null);

    if (activeObjectiveIndex < quest.objectives.length - 1) {
      setActiveObjectiveIndex((prev) => prev + 1);
    }
  };

  const handleCompleteQuest = () => {
    if (!quest) return;
    updateSessionStatus('completed');
    router.push(`/quest/${quest.id}/complete`);
  };

  if (!quest || !currentObjective) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Clock className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold">Loading quest evidence...</p>
        </div>
      </div>
    );
  }

  const completedCount = session ? Object.keys(session.evaluations).length : 0;
  const isAllObjectivesEvaluated = session
    ? quest.objectives.every((obj) => session.evaluations[obj.id]?.completed)
    : false;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            EVIDENCE VERIFICATION · STAGE 03
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100">
            Submit Evidence
          </h1>
        </div>

        {/* Progress pill */}
        <div className="px-3 py-1.5 bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-black">
          {completedCount} / {quest.objectives.length} Verified
        </div>
      </div>

      {/* Objective Stepper Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {quest.objectives.map((obj, idx) => {
          const isDone = session?.evaluations[obj.id]?.completed;
          const isCurrent = idx === activeObjectiveIndex;

          return (
            <button
              key={obj.id}
              type="button"
              onClick={() => {
                setActiveObjectiveIndex(idx);
                setPhotoPreview('');
                setTextObservation('');
                setRecordedAudioUrl('');
                setAudioPermissionError(null);
                setEvaluationResult(session?.evaluations[obj.id] || null);
              }}
              className={`flex-1 min-w-[100px] p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-md'
                  : isDone
                  ? 'bg-emerald-900/10 dark:bg-emerald-400/10 border-emerald-500/30 text-stone-800 dark:text-stone-200'
                  : 'bg-stone-100 dark:bg-stone-900/60 border-stone-300 dark:border-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold">0{idx + 1}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <div className="text-[11px] font-semibold truncate mt-1">
                {obj.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Current Objective Card */}
      <div className="field-journal-card rounded-3xl p-6 sm:p-8 border border-stone-300 dark:border-stone-800 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
              OBJECTIVE 0{activeObjectiveIndex + 1}
            </span>
            <span className="text-xs font-black text-amber-600 dark:text-amber-400">
              +{currentObjective.xp} XP
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            {currentObjective.title}
          </h2>

          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
            {currentObjective.description}
          </p>

          {currentObjective.hint && (
            <p className="text-xs text-emerald-700 dark:text-emerald-400 italic pt-1">
              Field Hint: {currentObjective.hint}
            </p>
          )}
        </div>

        {/* Dynamic Evidence Input Forms */}
        <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
          {/* PHOTO OBJECTIVE INPUT */}
          {currentObjective.evidenceType === 'photo' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Visual Evidence
              </label>

              {photoPreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/50 bg-stone-950 max-h-72 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Nature discovery evidence"
                    className="w-full h-auto max-h-72 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview('')}
                    className="absolute top-3 right-3 p-1.5 bg-stone-900/80 hover:bg-stone-900 text-white rounded-full transition"
                    aria-label="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Take Photo with Environment Camera */}
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="p-5 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-600 bg-stone-50 dark:bg-stone-900/40 flex flex-col items-center justify-center gap-2 text-stone-700 dark:text-stone-300 transition cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-sm">Take Photo</span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      Use phone camera
                    </span>
                  </button>
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />

                  {/* Upload Photo from gallery */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-5 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-600 bg-stone-50 dark:bg-stone-900/40 flex flex-col items-center justify-center gap-2 text-stone-700 dark:text-stone-300 transition cursor-pointer"
                  >
                    <Upload className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-bold text-sm">Upload Photo</span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400">
                      From photo library
                    </span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </div>
              )}

              {/* Optional Field Observation Note */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400">
                  Observation Note (Optional)
                </label>
                <textarea
                  value={textObservation}
                  onChange={(e) => setTextObservation(e.target.value)}
                  placeholder="Describe where you found it, colors, species details, or surrounding habitat..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* AUDIO OBJECTIVE INPUT */}
          {currentObjective.evidenceType === 'audio' && (
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Acoustic Recording
              </label>

              {audioPermissionError && (
                <div className="p-3.5 bg-amber-950/20 border border-amber-500/40 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{audioPermissionError}</span>
                </div>
              )}

              <div className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-300 dark:border-stone-800 flex flex-col items-center justify-center gap-3 text-center">
                {isRecordingAudio ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center animate-ping mx-auto">
                      <Mic className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-wider">
                      Recording Ambient Acoustics...
                    </div>
                    <button
                      type="button"
                      onClick={handleStopAudioRecording}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer mx-auto"
                    >
                      <Square className="w-3.5 h-3.5" />
                      <span>Stop Recording</span>
                    </button>
                  </div>
                ) : recordedAudioUrl ? (
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>✓ Acoustic Sample Captured</span>
                      <button
                        type="button"
                        onClick={() => setRecordedAudioUrl('')}
                        className="text-stone-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <audio src={recordedAudioUrl} controls className="w-full h-10" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleStartAudioRecording}
                      className="px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-md mx-auto"
                    >
                      <Mic className="w-4 h-4 text-emerald-300" />
                      <span>Record Natural Sound</span>
                    </button>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Captures bird calls, wind through foliage, or stream sounds
                    </p>
                  </div>
                )}
              </div>

              {/* Sound Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400">
                  Sound Description & Perception
                </label>
                <textarea
                  value={textObservation}
                  onChange={(e) => setTextObservation(e.target.value)}
                  placeholder="Describe the pitch, cadence, source (bird, rustling leaf, water), and direction..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* TEXT OBJECTIVE INPUT */}
          {currentObjective.evidenceType === 'text' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                WHAT DID YOU NOTICE?
              </label>
              <textarea
                value={textObservation}
                onChange={(e) => setTextObservation(e.target.value)}
                placeholder="Log your exact field observations, interactions between living organisms, or hidden details..."
                rows={4}
                className="w-full p-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden leading-relaxed"
              />
            </div>
          )}
        </div>

        {/* AI Evaluation Result Card */}
        {isEvaluating && (
          <div className="p-5 rounded-2xl bg-emerald-950/10 border border-emerald-500/30 flex items-center justify-center gap-3 animate-pulse">
            <Sparkles className="w-5 h-5 text-emerald-600 animate-spin" />
            <div className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Analyzing evidence... ✓ Evidence received
            </div>
          </div>
        )}

        {evaluationResult && !isEvaluating && (
          <div className="p-5 rounded-2xl bg-emerald-900/10 dark:bg-emerald-950/30 border border-emerald-500/40 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-extrabold text-sm uppercase tracking-wide">
                <CheckCircle2 className="w-5 h-5" />
                <span>OBJECTIVE COMPLETE</span>
              </div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>+{evaluationResult.xpAwarded} XP</span>
              </div>
            </div>

            <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
              {evaluationResult.feedback}
            </p>

            {evaluationResult.naturalistInsight && (
              <p className="text-xs text-stone-600 dark:text-stone-400 italic bg-stone-200/50 dark:bg-stone-900/50 p-3 rounded-xl border border-stone-300/50 dark:border-stone-800">
                {evaluationResult.naturalistInsight}
              </p>
            )}

            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-1">
              <span>Demo AI Evaluation Confidence</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {Math.round(evaluationResult.confidence * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          {!evaluationResult ? (
            <button
              type="button"
              disabled={isEvaluating}
              onClick={handleSubmitObjectiveEvidence}
              className="w-full py-3.5 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Verify & Evaluate Objective</span>
            </button>
          ) : (
            <>
              {activeObjectiveIndex < quest.objectives.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextObjective}
                  className="w-full py-3.5 px-6 bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <span>Proceed to Objective 0{activeObjectiveIndex + 2}</span>
                  <ChevronRight className="w-4 h-4 text-emerald-300" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCompleteQuest}
                  className="w-full py-4 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer transition animate-pulse"
                >
                  <Award className="w-5 h-5 text-emerald-300" />
                  <span>Finalize Expedition & View Summary</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Direct Jump to Complete if all done */}
      {isAllObjectivesEvaluated && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleCompleteQuest}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-400 underline underline-offset-4 cursor-pointer"
          >
            All objectives verified. Complete Quest now →
          </button>
        </div>
      )}
    </div>
  );
}
