"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Recognition = {
  start: () => void; stop: () => void; abort: () => void;
  continuous: boolean; interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null; onend: (() => void) | null;
};

/** Dictation only. It never sends text to planning or saves a record. */
export default function VoiceInput({ disabled, onTranscript }: {
  disabled: boolean; onTranscript: (text: string) => void;
}) {
  const speech = useRef<Recognition | null>(null);
  const sequence = useRef(0);
  const latest = useRef({ disabled, onTranscript });
  useLayoutEffect(() => { latest.current = { disabled, onTranscript }; }, [disabled, onTranscript]);
  const [recording, setRecording] = useState(false);
  const [message, setMessage] = useState("");
  const abort = () => { sequence.current++; speech.current?.abort(); speech.current = null; };
  useEffect(() => {
    if (disabled) {
      sequence.current++;
      speech.current?.abort(); speech.current = null;
    }
  }, [disabled]);
  useEffect(() => () => { sequence.current++; speech.current?.abort(); }, []);
  const toggle = () => {
    if (latest.current.disabled) return;
    if (recording) { speech.current?.stop(); setRecording(false); return; }
    abort();
    const platform = window as unknown as {
      SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition;
    };
    const Constructor = platform.SpeechRecognition ?? platform.webkitSpeechRecognition;
    if (!Constructor) { setMessage("Dictation is unavailable in this browser. You can keep typing."); return; }
    const instance = new Constructor(), attempt = sequence.current;
    speech.current = instance;
    const current = () => attempt === sequence.current && !latest.current.disabled;
    instance.continuous = false; instance.interimResults = false;
    instance.onresult = event => {
      if (!current()) return;
      const text = Array.from(event.results).map(result => result[0]?.transcript ?? "").join(" ").trim();
      // A single recognition run is accepted once, even if an implementation repeats its event.
      sequence.current++; speech.current = null; instance.abort();
      setRecording(false);
      if (text) { latest.current.onTranscript(text); setMessage("Transcript added. Check and edit it before saving or asking AI."); }
      else setMessage("No words received. You can try again or type.");
    };
    instance.onerror = () => {
      if (!current()) return;
      abort(); setRecording(false);
      setMessage("Microphone access was denied or dictation failed. Your text is retained; keep typing.");
    };
    instance.onend = () => {
      if (current()) {
        sequence.current++; setRecording(false); speech.current = null;
        setMessage("Dictation stopped. Review the text, try again or keep typing.");
      }
    };
    try { instance.start(); setMessage("Listening… Say what changed and what remains."); setRecording(true); }
    catch { abort(); setRecording(false); setMessage("Dictation could not start. Your text is retained; keep typing."); }
  };
  return <div className="voice-update">
    <button type="button" className="secondary" disabled={disabled} onClick={toggle} aria-pressed={recording}>
      {recording ? "Stop dictation" : "Dictate update"}
    </button>
    <p className="session-time">Uses your browser’s speech service. Review before saving.</p>
    {message && <p role="status" className="session-time">{message}</p>}
  </div>;
}
