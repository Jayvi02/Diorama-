"use client";

// A low, uneasy room tone made entirely with Web Audio (no audio files):
// filtered brown noise + a 50 Hz electrical hum + the odd water drip.
export function createAmbient() {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // brown noise
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 420;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.35;
  noise.connect(lp).connect(noiseGain).connect(master);
  noise.start();

  // fluorescent hum
  const hum = ctx.createOscillator();
  hum.type = "sawtooth";
  hum.frequency.value = 50;
  const humFilter = ctx.createBiquadFilter();
  humFilter.type = "lowpass";
  humFilter.frequency.value = 180;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.025;
  hum.connect(humFilter).connect(humGain).connect(master);
  hum.start();

  // drips
  let dripTimer = 0;
  const drip = () => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const t = ctx.currentTime;
    o.type = "sine";
    o.frequency.setValueAtTime(1400 + Math.random() * 600, t);
    o.frequency.exponentialRampToValueAtTime(380, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + 0.3);
    dripTimer = window.setTimeout(drip, 2500 + Math.random() * 6000);
  };
  dripTimer = window.setTimeout(drip, 1500);

  return {
    fadeTo(v: number) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(v, ctx.currentTime, 0.6);
    },
    async resume() {
      if (ctx.state === "suspended") await ctx.resume();
    },
    close() {
      clearTimeout(dripTimer);
      ctx.close();
    },
  };
}
