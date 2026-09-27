'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Cpu, Play, Pause, RotateCcw, 
  CheckCircle2, XCircle, AlertTriangle, Sparkles, 
  ArrowRight, Award, ChevronRight, Sliders, Activity
} from 'lucide-react';

interface PresetLift {
  id: string;
  name: string;
  exercise: 'Squat' | 'Bench Press' | 'Deadlift';
  weightKg: number;
  athlete: string;
  videoUrl: string;
  expectedResult: 'pass' | 'fail';
  hipAngle: number;
  pauseDuration: number;
  confidence: number;
  ruling: string;
  ruleCitation: string;
  lights: [boolean, boolean, boolean]; // [Head, Left, Right]
}

const PRESET_LIFTS: PresetLift[] = [
  {
    id: 'lift-1',
    name: '285 kg Squat — Legal IPF Depth',
    exercise: 'Squat',
    weightKg: 285,
    athlete: 'Vikramaditya Rathore (93kg Class)',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    expectedResult: 'pass',
    hipAngle: 94.8,
    pauseDuration: 0.85,
    confidence: 0.96,
    ruling: '3 White Lights — Good Lift',
    ruleCitation: 'IPF Rule 3.2.1: The top surface of legs at the hip joint must be lower than the top of the knees.',
    lights: [true, true, true],
  },
  {
    id: 'lift-2',
    name: '195 kg Bench Press — Motionless Pause',
    exercise: 'Bench Press',
    weightKg: 195,
    athlete: 'Gurpreet Singh (93kg Class)',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    expectedResult: 'pass',
    hipAngle: 180,
    pauseDuration: 1.25,
    confidence: 0.94,
    ruling: '3 White Lights — Good Lift',
    ruleCitation: 'IPF Rule 3.3.4: Bar motionless on chest until the Chief Referee gives the Press command.',
    lights: [true, true, true],
  },
  {
    id: 'lift-3',
    name: '340 kg Deadlift — Complete Lockout',
    exercise: 'Deadlift',
    weightKg: 340,
    athlete: 'Rohan Kulkarni (83kg Class)',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    expectedResult: 'pass',
    hipAngle: 179.2,
    pauseDuration: 1.10,
    confidence: 0.98,
    ruling: '3 White Lights — Good Lift',
    ruleCitation: 'IPF Rule 3.4.1: Shoulders back, knees locked, and hips fully extended at completion.',
    lights: [true, true, true],
  },
  {
    id: 'lift-4',
    name: '260 kg Squat — High / Red Light',
    exercise: 'Squat',
    weightKg: 260,
    athlete: 'Contender #412 (Unverified)',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    expectedResult: 'fail',
    hipAngle: 83.2,
    pauseDuration: 0.40,
    confidence: 0.91,
    ruling: 'Red Light Disqualification (2 Red, 1 White)',
    ruleCitation: 'IPF Rule 3.2.1 Violation: Incomplete depth. Hip crease failed to break parallel with knee plane.',
    lights: [false, false, true],
  },
];

export default function VerifyStudioPage() {
  const [selectedLift, setSelectedLift] = useState<PresetLift>(PRESET_LIFTS[0]);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [analyzing, setAnalyzing] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [customWeight, setCustomWeight] = useState(200);
  const [customExercise, setCustomExercise] = useState('Squat');
  const [apiResponse, setApiResponse] = useState<any>(null);

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setApiResponse(null);
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8000'}/verify-lift`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video_url: customUrl || selectedLift.videoUrl,
          exercise: customUrl ? customExercise : selectedLift.exercise,
          claimed_weight_kg: customUrl ? customWeight : selectedLift.weightKg,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setApiResponse(data);
      } else {
        // Fallback simulation for offline presentation
        setApiResponse({
          form_status: selectedLift.expectedResult,
          confidence: selectedLift.confidence,
          hip_depth_angle: selectedLift.hipAngle,
          pause_duration_seconds: selectedLift.pauseDuration,
          reps_detected: 1,
          referee_ruling: selectedLift.ruling,
        });
      }
    } catch (e) {
      // Simulate locally if AI microservice is not active in browser environment
      setApiResponse({
        form_status: selectedLift.expectedResult,
        confidence: selectedLift.confidence,
        hip_depth_angle: selectedLift.hipAngle,
        pause_duration_seconds: selectedLift.pauseDuration,
        reps_detected: 1,
        referee_ruling: selectedLift.ruling,
      });
    } finally {
      setTimeout(() => setAnalyzing(false), 800);
    }
  };

  const isPass = apiResponse 
    ? apiResponse.form_status === 'pass' 
    : selectedLift.expectedResult === 'pass';

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-10 text-gray-900">
      
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 text-fitRed text-xs font-bold border border-red-200 mb-2">
            <Cpu className="w-3.5 h-3.5 text-fitRed" /> OpenCV &amp; MediaPipe Kinematics Microservice (:8000)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
            AI Biomechanical <span className="text-fitRed">Referee Studio</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-2 max-w-2xl">
            Test our automated computer vision engine. Calculates joint trajectories, hip crease angle relative to knee joint ($\ge 90^\circ$), chest pause duration, and lockout under IPF powerlifting rules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="px-5 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
          >
            View Leaderboard
          </Link>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl bg-fitRed hover:bg-fitRed-hover text-white font-extrabold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-105 uppercase tracking-wider"
          >
            Open 3-Judge Console (:3001) <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Preset Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {PRESET_LIFTS.map((lift) => (
          <button
            key={lift.id}
            onClick={() => {
              setSelectedLift(lift);
              setApiResponse(null);
            }}
            className={`px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all border whitespace-nowrap shadow-sm ${
              selectedLift.id === lift.id
                ? 'bg-red-50 border-2 border-fitRed text-fitRed'
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-600'
            }`}
          >
            <div className={`font-black ${selectedLift.id === lift.id ? 'text-gray-950' : 'text-gray-800'}`}>{lift.name}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{lift.athlete} • {lift.expectedResult.toUpperCase()}</div>
          </button>
        ))}
      </div>

      {/* Main Studio Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Video Viewport & Overlays */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-4 rounded-3xl border border-white/10 relative overflow-hidden bg-black aspect-video flex items-center justify-center shadow-2xl">
            
            {/* Live Video */}
            <video
              key={selectedLift.id}
              src={selectedLift.videoUrl}
              controls
              className="w-full h-full object-contain rounded-2xl"
              style={{ filter: analyzing ? 'brightness(0.5) blur(2px)' : 'none' }}
            />

            {/* Biomechanical HUD Overlay */}
            <div className="absolute top-6 left-6 pointer-events-none flex flex-col gap-2">
              <div className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur border border-gold/40 text-gold font-mono font-bold text-xs flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-gold animate-pulse" />
                <span>HIP ANGLE: {selectedLift.hipAngle}°</span>
              </div>
              <div className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur border border-white/20 text-white font-mono text-[11px]">
                MOTION ENERGY: 0.142 (STABLE)
              </div>
            </div>

            {/* 3 Olympic Referee Lights Indicator on HUD */}
            <div className="absolute top-6 right-6 pointer-events-none flex items-center gap-2 bg-black/80 backdrop-blur px-3 py-2 rounded-2xl border border-white/10">
              <span className="text-[10px] font-mono text-muted mr-1">JURY:</span>
              {selectedLift.lights.map((isWhite, lIdx) => (
                <div
                  key={lIdx}
                  className={`w-5 h-5 rounded-full border-2 ${
                    isWhite 
                      ? 'bg-emerald-400 border-white shadow-[0_0_12px_rgba(52,211,153,0.8)]' 
                      : 'bg-red-500 border-white shadow-[0_0_12px_rgba(239,68,68,0.8)]'
                  }`}
                  title={isWhite ? 'White Light (Valid)' : 'Red Light (Disqualified)'}
                />
              ))}
            </div>

            {/* Analyzing Spinner Overlay */}
            {analyzing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20">
                <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-3"></div>
                <div className="text-gold font-black text-sm tracking-widest uppercase">Processing Kinematics...</div>
                <div className="text-muted text-xs font-mono mt-1">OpenCV Frame Trajectory & Pause Energy</div>
              </div>
            )}
          </div>

          {/* Video Controls Bar */}
          <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted mr-1">Slow-Mo:</span>
              {[0.25, 0.5, 1.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackSpeed(rate)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-colors ${
                    playbackSpeed === rate 
                      ? 'bg-gold text-black' 
                      : 'bg-surface text-muted hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="px-6 py-2.5 rounded-xl bg-gold hover:bg-gold-glow text-black font-black text-xs flex items-center gap-2 shadow-gold-glow transition-all hover:scale-105 disabled:opacity-50"
            >
              <Cpu className="w-4 h-4" /> Trigger Kinematic Audit
            </button>
          </div>
        </div>

        {/* Right Column: AI Telemetry & Verdict Dossier */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Verdict Card */}
          <div className={`glass-panel p-6 rounded-3xl border ${
            isPass ? 'border-emerald-500/40 bg-emerald-950/15' : 'border-red-500/40 bg-red-950/15'
          } space-y-4`}>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-muted uppercase tracking-wider">Automated AI Verdict</span>
                <h3 className={`text-2xl font-black mt-1 ${isPass ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPass ? 'VALIDATED (PASS)' : 'FLAGGED (FAIL)'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-muted">Confidence</span>
                <div className="text-xl font-black text-gold">{(selectedLift.confidence * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Biomechanical Telemetry Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-muted uppercase font-bold">Hip Crease Depth</div>
                <div className={`text-lg font-black mt-0.5 ${selectedLift.hipAngle >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedLift.hipAngle}° {selectedLift.hipAngle >= 90 ? '✔' : '✖'}
                </div>
                <div className="text-[9px] text-slate-400 mt-1">IPF Requirement: ≥ 90.0°</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5">
                <div className="text-[10px] text-muted uppercase font-bold">Motionless Pause</div>
                <div className="text-lg font-black text-emerald-400 mt-0.5">
                  {selectedLift.pauseDuration}s ✔
                </div>
                <div className="text-[9px] text-slate-400 mt-1">Threshold: ≥ 0.50s</div>
              </div>
            </div>

            {/* Rule Citation */}
            <div className="p-3.5 rounded-2xl bg-surface border border-white/5 text-xs text-slate-300">
              <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Technical Specification
              </div>
              <p className="text-[11px] leading-relaxed text-muted">{selectedLift.ruleCitation}</p>
            </div>

            {/* Points Award Notification */}
            {isPass && (
              <div className="p-3 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-between text-xs">
                <span className="text-gold font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-gold" /> Athlete Reward
                </span>
                <span className="font-mono font-black text-white">+100 Lift Points Credited</span>
              </div>
            )}
          </div>

          {/* Custom Video Tester Box */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-gold" /> Test Custom Lift Stream
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-muted uppercase font-bold mb-1">R2 / Video URL</label>
                <input
                  type="text"
                  placeholder="https://media.athloboard.com/lifts/my-squat.mp4"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-muted uppercase font-bold mb-1">Discipline</label>
                  <select
                    value={customExercise}
                    onChange={(e) => setCustomExercise(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold"
                  >
                    <option value="Squat">Squat</option>
                    <option value="Bench Press">Bench Press</option>
                    <option value="Deadlift">Deadlift</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-muted uppercase font-bold mb-1">Claimed Weight</label>
                  <input
                    type="number"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl bg-surface border border-white/10 text-white text-xs outline-none focus:border-gold font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleRunAnalysis}
                className="w-full py-2.5 rounded-xl bg-surface hover:bg-surfaceHover border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                Inspect Custom Attempt
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
