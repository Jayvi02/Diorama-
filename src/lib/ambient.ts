"use client";

// Crime-scene soundscape made entirely with Web Audio (no audio files):
// a low tense drone, distant city noise, police sirens passing in the distance
// and bursts of police radio chatter.
export function createAmbient() {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  const timers: number[] = [];
  const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
  const rand = (a: number, b: number) => a + Math.random() * (b - a);

  // ---------- distant city / rain noise ----------
  const len = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const noiseLp = ctx.createBiquadFilter();
  noiseLp.type = "lowpass";
  noiseLp.frequency.value = 600;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.22;
  noise.connect(noiseLp).connect(noiseGain).connect(master);
  noise.start();

  // ---------- tense drone: detuned lows plus a dissonant semitone ----------
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 220;
  const droneGain = ctx.createGain();
  droneGain.gain.value = 0.05;
  droneFilter.connect(droneGain).connect(master);
  for (const f of [55, 55.4, 58.3]) {
    const o = ctx.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.connect(droneFilter);
    o.start();
  }
  // slow "breathing" of the drone
  const droneLfo = ctx.createOscillator();
  droneLfo.frequency.value = 0.07;
  const droneLfoGain = ctx.createGain();
  droneLfoGain.gain.value = 90;
  droneLfo.connect(droneLfoGain).connect(droneFilter.frequency);
  droneLfo.start();

  // ---------- police siren (US-style wail), always running, gated per pass ----------
  const sirenBus = ctx.createGain();
  sirenBus.gain.value = 0;
  const sirenPan = ctx.createStereoPanner();
  const sirenTone = ctx.createBiquadFilter(); // distance: soften the top end
  sirenTone.type = "lowpass";
  sirenTone.frequency.value = 1600;
  sirenBus.connect(sirenTone).connect(sirenPan).connect(master);

  // echo off buildings
  const echo = ctx.createDelay(1);
  echo.delayTime.value = 0.33;
  const echoFb = ctx.createGain();
  echoFb.gain.value = 0.38;
  const echoLp = ctx.createBiquadFilter();
  echoLp.type = "lowpass";
  echoLp.frequency.value = 900;
  sirenPan.connect(echo);
  echo.connect(echoLp).connect(echoFb).connect(echo);
  echoLp.connect(master);

  const wail = ctx.createOscillator();
  wail.frequency.value = 0.22; // one rise-and-fall every ~4.5 s
  const wailDepth = ctx.createGain();
  wailDepth.gain.value = 330;
  wail.connect(wailDepth);
  wail.start();

  const sirenOscs = (["sawtooth", "square"] as OscillatorType[]).map((type, i) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = 930;
    o.detune.value = i * 7;
    wailDepth.connect(o.frequency);
    const g = ctx.createGain();
    g.gain.value = i ? 0.25 : 0.6;
    o.connect(g).connect(sirenBus);
    o.start();
    return o;
  });

  const sirenPass = () => {
    const t = ctx.currentTime;
    const dur = rand(11, 16);
    const from = Math.random() < 0.5 ? -0.9 : 0.9;
    // fade in from far away, peak, then fade out as it drives off
    sirenBus.gain.cancelScheduledValues(t);
    sirenBus.gain.setValueAtTime(0, t);
    sirenBus.gain.linearRampToValueAtTime(0.05, t + dur * 0.45);
    sirenBus.gain.linearRampToValueAtTime(0.035, t + dur * 0.6);
    sirenBus.gain.linearRampToValueAtTime(0, t + dur);
    sirenPan.pan.cancelScheduledValues(t);
    sirenPan.pan.setValueAtTime(from, t);
    sirenPan.pan.linearRampToValueAtTime(-from, t + dur);
    // doppler: slightly sharp while approaching, flat after it passes
    for (const o of sirenOscs) {
      o.detune.cancelScheduledValues(t);
      o.detune.setValueAtTime(40, t);
      o.detune.linearRampToValueAtTime(40, t + dur * 0.45);
      o.detune.linearRampToValueAtTime(-70, t + dur * 0.65);
    }
    later(sirenPass, (dur + rand(14, 26)) * 1000);
  };
  later(sirenPass, 1800);

  // ---------- police radio: squelch beep + crackling "voice" ----------
  const radioOut = ctx.createGain();
  radioOut.gain.value = 0.5;
  const radioPan = ctx.createStereoPanner();
  radioPan.pan.value = 0.35;
  radioOut.connect(radioPan).connect(master);

  const crackleBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const cd = crackleBuf.getChannelData(0);
  for (let i = 0; i < cd.length; i++) cd[i] = Math.random() * 2 - 1;

  const radio = () => {
    const t = ctx.currentTime;
    // squelch beep
    const beep = ctx.createOscillator();
    const bg = ctx.createGain();
    beep.type = "square";
    beep.frequency.setValueAtTime(1180, t);
    beep.frequency.setValueAtTime(880, t + 0.07);
    bg.gain.setValueAtTime(0.0001, t);
    bg.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
    bg.gain.setValueAtTime(0.05, t + 0.13);
    bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    beep.connect(bg).connect(radioOut);
    beep.start(t);
    beep.stop(t + 0.2);

    // band-limited static, chopped into syllable-like bursts
    const talk = rand(1.2, 2.6);
    const src = ctx.createBufferSource();
    src.buffer = crackleBuf;
    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = 1500;
    band.Q.value = 1.4;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t + 0.18);
    let s = t + 0.2;
    while (s < t + 0.2 + talk) {
      const syl = rand(0.06, 0.18);
      env.gain.setValueAtTime(rand(0.06, 0.16), s);
      env.gain.setValueAtTime(0.01, s + syl);
      band.frequency.setValueAtTime(rand(900, 2200), s);
      s += syl + rand(0.02, 0.09);
    }
    env.gain.setValueAtTime(0, s);
    src.connect(band).connect(env).connect(radioOut);
    src.start(t + 0.18);
    src.stop(s + 0.1);

    // closing squelch tail
    const tail = ctx.createBufferSource();
    tail.buffer = crackleBuf;
    const tg = ctx.createGain();
    tg.gain.setValueAtTime(0.07, s + 0.05);
    tg.gain.exponentialRampToValueAtTime(0.0001, s + 0.3);
    const thp = ctx.createBiquadFilter();
    thp.type = "highpass";
    thp.frequency.value = 2500;
    tail.connect(thp).connect(tg).connect(radioOut);
    tail.start(s + 0.05);
    tail.stop(s + 0.35);

    later(radio, rand(9, 18) * 1000);
  };
  later(radio, 5500);

  return {
    fadeTo(v: number) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(v, ctx.currentTime, 0.6);
    },
    async resume() {
      if (ctx.state === "suspended") await ctx.resume();
    },
    close() {
      timers.forEach(clearTimeout);
      ctx.close();
    },
  };
}
