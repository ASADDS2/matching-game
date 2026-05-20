import { getState } from '../state';

let audioCtx: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playTone(freq: number, type: OscillatorType, duration: number, gainValue: number): void {
  if (!getState().audioEnabled) return;
  const ctx = getContext();
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(gainValue, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playCorrectSound(): void {
  if (!getState().audioEnabled) return;
  // C4 -> E4
  playTone(261.63, 'sine', 0.08, 0.3);
  setTimeout(() => playTone(329.63, 'sine', 0.08, 0.3), 80);
}

export function playWrongSound(): void {
  if (!getState().audioEnabled) return;
  // D4 -> Bb3
  playTone(293.66, 'sawtooth', 0.1, 0.2);
  setTimeout(() => playTone(233.08, 'sawtooth', 0.1, 0.2), 100);
}

export function playCompletionSound(): void {
  if (!getState().audioEnabled) return;
  // C4, E4, G4, C5
  const delays = [0, 80, 160, 240];
  const freqs = [261.63, 329.63, 392.00, 523.25];
  
  delays.forEach((delay, i) => {
    setTimeout(() => playTone(freqs[i], 'sine', 0.08, 0.25), delay);
  });
}

export function playStampSound(): void {
  if (!getState().audioEnabled) return;
  const ctx = getContext();
  const duration = 0.15;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + duration);
  
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + duration);
}
