type AudioContextClass = typeof AudioContext;

function getAudioContext(): AudioContext | null {
  try {
    const contextClass: AudioContextClass | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextClass }).webkitAudioContext;
    if (!contextClass) return null;
    const context = new contextClass();
    if (context.state === "suspended") {
      void context.resume().catch(() => {});
    }
    return context;
  } catch {
    return null;
  }
}

export function startRingtone(): () => void {
  const context = getAudioContext();
  if (!context) return () => {};

  let stopped = false;

  const playBeep = (frequency: number, delay: number, duration: number, volume: number) => {
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  };

  const playTone = () => {
    if (stopped || context.state === "suspended") return;
    playBeep(880, 0, 0.35, 0.05);
    playBeep(1175, 0.45, 0.35, 0.05);
  };

  playTone();
  const interval = window.setInterval(playTone, 1300);

  return () => {
    stopped = true;
    window.clearInterval(interval);
  };
}
