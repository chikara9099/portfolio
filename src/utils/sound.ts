// Lightweight Web Audio API synthesizer for high-tech micro-interactions
let audioCtx: AudioContext | null = null;
let isMuted = false;

// Initialize or resume AudioContext on first user interaction
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Fire haptic feedback (visual+audio+haptic should land on the same frame).
 * Independent of the AudioContext but gated on the same mute flag — muting
 * signals "be quiet", and vibration honors that too. Cheap 10ms tap by default.
 */
export function vibrate(pattern: number | number[] = 10): void {
  if (getSoundMuted()) return;
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try { navigator.vibrate(pattern); } catch { /* unsupported — silent */ }
  }
}

export function setSoundMuted(muted: boolean) {
  isMuted = muted;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('portfolio_sound_muted', muted ? 'true' : 'false');
  }
}

export function getSoundMuted(): boolean {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('portfolio_sound_muted') === 'true';
  }
  return isMuted;
}

// Subtle crisp key click (for terminal and buttons)
export function playKeyClick() {
  if (getSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio restrictions
  }
}

// High-tech subtle confirmation / selection sound
export function playBlip(freq = 1200) {
  if (getSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.06);
  } catch {
    // Ignore audio restrictions
  }
}

// Success chime (carries a same-frame haptic tap)
export function playSuccessChime() {
  if (getSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  vibrate(15);

  try {
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);

      gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.25);
    });
  } catch {
    // Ignore
  }
}

// Epic overdrive / easter egg synth fanfare (always carries the haptic pulse)
export function playOverdriveFanfare() {
  if (getSoundMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  vibrate([20, 60, 20]);

  try {
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    arpeggio.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.06);
      osc.stop(ctx.currentTime + idx * 0.06 + 0.35);
    });
  } catch {
    // Ignore
  }
}
