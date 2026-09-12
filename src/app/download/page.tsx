import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, ShieldCheck, Smartphone, CheckCircle2, ArrowRight, Zap, Trophy, HardDrive, Cpu, Github } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Download Athloboard Android App (APK) | Official Release',
  description: 'Download the official Athloboard Android app for IPF-compliant AI lift verification, gym radar, and real-time strength leaderboards.',
};

export default function DownloadPage() {
  const GITHUB_RAW_URL = 'https://github.com/aniketsachan989/athloboard/raw/main/public/downloads/athloboard-app.apk';
  const LOCAL_APK_URL = '/downloads/athloboard-app.apk';

  return (
    <div className="relative min-h-[90vh] py-16 px-6 max-w-6xl mx-auto flex flex-col items-center">
      {/* Top Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border-emerald-500/40 text-emerald-400 text-xs font-black tracking-widest uppercase mb-6 shadow-sm">
        <Smartphone className="w-3.5 h-3.5" /> Official Android Release • v1.0 (Build 1)
      </div>

      {/* Main Heading */}
      <h1 className="text-4xl sm:text-6xl font-black text-center text-white tracking-tight leading-tight max-w-3xl">
        Download <span className="text-emerald-400">Athloboard</span> for Android
      </h1>
      <p className="text-muted text-base sm:text-lg text-center max-w-2xl mt-4 leading-relaxed">
        Record your Squat, Bench Press, and Deadlift sets with real-time CameraX skeletal tracking, autonomous AI biomechanical auditing, and verified lift points.
      </p>

      {/* Primary Download Card */}
      <div className="w-full max-w-2xl mt-10 glass-panel p-8 sm:p-10 rounded-3xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mb-6 border border-emerald-500/30 shadow-inner">
          <Download className="w-8 h-8 animate-bounce" />
        </div>

        <h2 className="text-2xl font-black text-white">Athloboard Mobile App v1.0.0</h2>
        <p className="text-xs text-muted font-mono mt-1">Package: com.athloboard.app • 16.0 MB</p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={LOCAL_APK_URL}
            download="Athloboard-v1.0.apk"
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-black text-black bg-emerald-400 hover:bg-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] text-base flex items-center justify-center gap-3 transition-all hover:scale-105"
          >
            <Download className="w-5 h-5 text-black" />
            <span>Download APK Directly</span>
            <span className="text-xs bg-black/15 px-2 py-0.5 rounded font-extrabold uppercase">16 MB</span>
          </a>

          <a
            href={GITHUB_RAW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 rounded-xl font-bold text-white bg-surface hover:bg-surfaceHover border border-white/10 text-sm flex items-center justify-center gap-2 transition-colors"
            title="Alternative download link hosted directly on GitHub repository"
          >
            <Github className="w-4 h-4 text-muted" />
            GitHub Mirror
          </a>
        </div>

        <p className="text-[11px] text-muted mt-4">
          Download starts automatically upon clicking. Safe, signed, malware-free release.
        </p>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-8 border-t border-white/10 text-left">
          <div className="p-3 rounded-xl bg-background border border-white/5">
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">Target OS</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Android 8.0+</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-white/5">
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">Architecture</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Universal APK</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-white/5">
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">Framework</span>
            <span className="text-sm font-bold text-white mt-0.5 block">Jetpack Compose</span>
          </div>
          <div className="p-3 rounded-xl bg-background border border-white/5">
            <span className="text-[10px] text-muted uppercase font-bold tracking-wider block">Verification</span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 block">OpenCV / AI</span>
          </div>
        </div>
      </div>

      {/* 3-Step Install Instructions */}
      <div className="w-full max-w-4xl mt-16">
        <h3 className="text-xl font-black text-white text-center mb-8">How to Install the APK in 3 Steps</h3>
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center mb-4">
              1
            </div>
            <h4 className="font-bold text-white text-base">Download the File</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Tap the "Download APK" button above. Your browser will download <code className="text-emerald-300 font-mono">Athloboard-v1.0.apk</code> (16 MB).
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center mb-4">
              2
            </div>
            <h4 className="font-bold text-white text-base">Allow Unknown Apps</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              If Android displays an "Install unknown apps" security prompt, tap <strong>Settings</strong> and enable <strong>Allow from this source</strong>.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center mb-4">
              3
            </div>
            <h4 className="font-bold text-white text-base">Record & Verify Lifts</h4>
            <p className="text-xs text-muted mt-2 leading-relaxed">
              Open Athloboard, log in via phone OTP or Google, and record your sets with CameraX angle guidance to earn verified points!
            </p>
          </div>
        </div>
      </div>

      {/* App Features Deep Dive */}
      <div className="w-full max-w-4xl mt-16 glass-panel p-8 rounded-3xl border border-white/10">
        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" /> What's Inside the Athloboard Mobile App
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block text-xs">CameraX Biomechanical HUD</strong>
              <span className="text-muted text-[11px]">Real-time joint angle guides and chest pause timers while recording.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block text-xs">Direct SigV4 Cloudflare R2 Uploads</strong>
              <span className="text-muted text-[11px]">Streams full-resolution 4K video straight to edge storage without device lag.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block text-xs">Autonomous AI Refereeing</strong>
              <span className="text-muted text-[11px]">FastAPI + OpenCV analyzes squat depth (&ge;90&deg;), pauses, and lockouts under 2s.</span>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-surface/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <strong className="text-white block text-xs">Decentralized Points Ledger</strong>
              <span className="text-muted text-[11px]">Earn +100 verified lift points per approved attempt redeemable in the store.</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="text-xs text-muted hover:text-white transition-colors flex items-center gap-1.5">
            &larr; Back to Athloboard Home
          </Link>
          <a
            href={LOCAL_APK_URL}
            download="Athloboard-v1.0.apk"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            Start Download (Athloboard-v1.0.apk) &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
