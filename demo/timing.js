// Conservative elapsed time, not attention. Clocks are supplied for deterministic tests.
export const CHECKPOINT_MS=5000;
export const MAX_GAP_MS=15000;
export const CLOCK_TOLERANCE_MS=2000;
export function sample(anchor, clock, remainingMs) {
  const wall=clock.wall-anchor.wall, mono=clock.mono-anchor.mono;
  if(!Number.isFinite(wall)||!Number.isFinite(mono)||wall<0||mono<0||wall>MAX_GAP_MS||mono>MAX_GAP_MS||Math.abs(wall-mono)>CLOCK_TOLERANCE_MS) {
    return {deltaMs:0,interrupted:true,reason:'Timing gap or clock change. Unverified time was not recorded.'};
  }
  return {deltaMs:Math.min(remainingMs,Math.floor(mono)),interrupted:false,reason:null};
}
