"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Snapshot } from "@/lib/domain";
import { comparisonPeriods, completionBand, displayDate, formatRecordedTime, progressProjection, yearDates } from "@/lib/progress";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
type Totals = ReturnType<ReturnType<typeof progressProjection>["totals"]>;
function Measures({ totals }: { totals: Totals }) {
  return <dl className="progress-measures">
    <div><dt>Completed actions</dt><dd>{totals.completions}</dd></div>
    <div><dt>Days with completions</dt><dd>{totals.days}</dd></div>
    <div><dt>Recorded session time</dt><dd>{formatRecordedTime(totals.recordedMs)}</dd></div>
  </dl>;
}

export default function ProgressView({ snapshot: s, now }: { snapshot: Snapshot; now: number }) {
  const p = useMemo(() => progressProjection(s, now), [s, now]);
  const [selected, setSelected] = useState(p.today);
  const heading = useRef<HTMLHeadingElement>(null);
  const details = useRef<HTMLHeadingElement>(null);
  const allowedYears = p.years.join(",");
  useEffect(() => {
    const restore = () => {
      const date = window.location.hash.slice(1);
      const year = Number(date.slice(0,4));
      if (allowedYears.split(",").includes(String(year)) && yearDates(year).includes(date)) setSelected(date);
    };
    restore();
    heading.current?.focus();
    window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, [allowedYears]);
  const year = Number(selected.slice(0,4));
  const dates = yearDates(year);
  const day = p.day(selected);
  const end = `${year}-12-31` < p.today ? `${year}-12-31` : p.today;
  const periods = comparisonPeriods(s, now);
  const choose = (date: string, reveal = true) => {
    setSelected(date);
    window.history.replaceState(window.history.state, "", `/progress#${date}`);
    if (reveal) requestAnimationFrame(() => {
      details.current?.focus({ preventScroll: true });
      details.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };
  const taskTitle = (id: string) => p.tasks.get(id)?.title ?? "Recorded action";
  const project = (id: string) => p.mountains.get(p.tasks.get(id)?.mountainId ?? "")?.title ?? "Recorded goal";
  return <div className="progress-view">
    <header className="heading"><div><h1 ref={heading} tabIndex={-1}>Progress</h1><p>A record of work, not a rating of your days.</p></div></header>
    <section className="card progress-year" aria-labelledby="progress-year-title">
      <div className="progress-controls"><h2 id="progress-year-title">Your year in checkpoints</h2>
        <div className="progress-year-picker"><label htmlFor="progress-year">Calendar year</label><select id="progress-year" value={year} onChange={e => choose(Number(e.target.value) === Number(p.today.slice(0,4)) ? p.today : `${e.target.value}-01-01`, false)}>{p.years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
        <button className="secondary" onClick={() => choose(p.today)}>Today’s record</button>
      </div>
      <p>Calendar timezone: <strong>{s.calendarTimeZone}</strong>. First use: {displayDate(p.firstUse)}.</p>
      <p className="session-time">Squares count completed actions only. Time, saves and summit confirmations do not add completions. Quiet days keep your earned mountain scenery.</p>
      <div className="progress-legend" aria-label="Completed actions legend">{["0", "1", "2–3", "4–5", "6+"].map((label, i) => <span key={label}><i aria-hidden="true" data-band={i} />{label}</span>)}<span>✓ All commitments completed that day</span></div>
      <p className="progress-key">· No recorded completions &nbsp; — Before first use &nbsp; ○ Future date &nbsp; [ ] Selected date. Choose a date for details.</p>
      <div className="progress-calendar" aria-label={`${year} completion calendar`}>
        {months.map((month, index) => {
          const days = dates.filter(d => Number(d.slice(5,7)) === index + 1);
          const offset = (new Date(`${days[0]}T00:00:00Z`).getUTCDay() + 6) % 7;
          return <section className="progress-month" key={month} aria-label={`${month} ${year}`}>
            <h3>{month}</h3><div className="progress-weekdays" aria-hidden="true">{weekdays.map((w, i) => <span key={i}>{w}</span>)}</div>
            <div className="progress-dates">
              {Array.from({ length: offset }, (_, i) => <span className="date-padding" aria-hidden="true" key={`pad-${i}`} />)}
              {days.map(date => {
                const d = p.day(date);
                const marker = d.planComplete ? "all commitments completed that day" : d.commitments.length ? "not all commitments completed that day" : "no committed plan";
                const state = d.state === "future" ? "future date" : d.state === "before-first-use" ? "before first use" : "recorded period";
                return <button type="button" key={date} data-date={date} data-band={completionBand(d.count)} data-date-state={d.state} aria-pressed={date === selected} aria-current={date === p.today ? "date" : undefined} aria-controls="progress-day-detail" aria-label={`${displayDate(date)}: ${d.count} completed actions; ${marker}; ${state}${date === p.today ? "; today" : ""}`} onClick={() => choose(date)}>
                  <span>{Number(date.slice(8))}</span><small aria-hidden="true">{d.planComplete ? "✓" : d.state === "future" ? "○" : d.state === "before-first-use" ? "—" : d.count ? d.count : "·"}</small>
                </button>;
              })}
            </div>
          </section>;
        })}
      </div>
      <section className="progress-year-summary" aria-label="Selected year summary"><h3>{year} recorded totals</h3><p>{displayDate(`${year}-01-01`)} – {displayDate(end)}{year === Number(p.today.slice(0,4)) ? " · Includes today’s partial record" : ""}</p><Measures totals={p.totals(`${year}-01-01`, end)} /></section>
    </section>

    <section className="card progress-day" id="progress-day-detail" aria-labelledby="progress-day-title">
      <header><h2 id="progress-day-title" tabIndex={-1} ref={details}>{displayDate(selected)}</h2><p>{day.state === "future" ? "Future date — not a missing day of work." : day.state === "before-first-use" ? "Before first use — no activity is inferred." : "Only recorded activity is shown; an empty record is not a judgment."}</p></header>
      <Measures totals={{ completions: day.count, days: day.count ? 1 : 0, recordedMs: day.recordedMs }} />
      <p className="progress-plan-status">{day.commitments.length ? `${day.committedCompleted} / ${day.commitments.length} historical commitments completed on this date after commitment.` : "No committed plan for this date. Unaccepted drafts do not create commitment history."} {day.planComplete ? "✓ All commitments completed that day." : day.commitments.length ? "No all-commitments marker for this date." : ""}</p>
      <div className="progress-detail-columns">
        <section aria-label="Completed actions on selected date"><h3>Completed actions</h3>{!day.count ? <p>No recorded completions on this date.</p> : <ol>{day.completed.map(c => <li key={c.id}><h4>{taskTitle(c.subtaskId)}</h4><p>{project(c.subtaskId)}{p.tasks.get(c.subtaskId)?.archivedAt ? " · Archived action" : ""}</p><p>{day.unplanned.some(x => x.id === c.id) ? "Not committed for this date" : "In this date’s commitment history"} · Completed {new Date(c.completedAt).toLocaleTimeString("en", { timeZone: c.calendarTimeZone })} ({c.calendarTimeZone})</p>{c.note && <p className="progress-note">{c.note}</p>}</li>)}</ol>}</section>
        <section aria-label="Commitment history"><h3>Commitment history</h3>{!day.commitments.length ? <p>No historical commitments for this date.</p> : <ol>{day.commitments.map(({ record, completion, completedOnDate }) => <li key={record.id}><h4>{record.titleSnapshot}</h4><p>{project(record.subtaskId)} · {record.disposition === "removed" ? "Removed" : record.disposition === "deferred" ? "Deferred" : "Committed"}</p><p>{completedOnDate ? "Completed on this date after commitment" : completion ? `Completion recorded ${displayDate(completion.localDate)}${completion.localDate === selected ? " before this commitment" : " on another date"}` : "No active completion recorded"}</p><p className="session-time">Committed {new Date(record.committedAt).toLocaleString("en", { timeZone: s.calendarTimeZone })}{record.dispositionAt ? ` · Latest plan change ${new Date(record.dispositionAt).toLocaleString("en", { timeZone: s.calendarTimeZone })}` : ""}</p></li>)}</ol>}</section>
        <section aria-label="Recorded session time"><h3>Recorded session time</h3><p>Elapsed session time, not proof of attention. Each session’s contribution to this date is counted once.</p>{!day.sessions.length ? <p>No session time recorded on this date.</p> : <ul>{day.sessions.map(({ session, ms }) => <li key={session.id}><h4>{taskTitle(session.subtaskId)}</h4><p>{project(session.subtaskId)} · {formatRecordedTime(ms)} recorded on this date</p></li>)}</ul>}</section>
        <section aria-label="Latest recorded saves"><h3>Latest recorded saves</h3><p>Only each mountain’s latest save date is retained. Notes below are current context, not a historical copy of that save. Heartbeats, pauses and interruptions are not save events.</p>{!day.saves.length ? <p>No latest saved place is recorded for this date; earlier saves may have been replaced.</p> : <ul>{day.saves.map(({ mountain, session }) => <li key={mountain.id}><h4>{mountain.title}</h4><p>{taskTitle(mountain.savedSubtaskId!)}</p>{session?.returnStep && <p className="progress-note">Current first return step: {session.returnStep}</p>}{session?.note && <p className="progress-note">Current stopping note: {session.note}</p>}<Link href={`/mountains#${mountain.id}`}>Inspect this mountain</Link></li>)}</ul>}</section>
      </div>
      <div className="button-row"><Link className="secondary" href="/">Go to Today</Link><Link className="secondary" href="/mountains">Explore Mountains</Link></div>
    </section>

    <section className="card progress-comparison" aria-labelledby="comparison-title"><h2 id="comparison-title">Two complete weeks of records</h2><p>Last 7 complete local dates versus the preceding 7. Today is excluded; these are counts, not productivity scores.</p>
      {periods.sufficient ? <div className="progress-detail-columns">{[{ label: "Last 7 complete dates", range: periods.recent }, { label: "Preceding 7 complete dates", range: periods.previous }].map(({ label, range }) => <section key={label}><h3>{label}</h3><p>{displayDate(range.start)} – {displayDate(range.end)}</p><Measures totals={p.totals(range.start, range.end)} /></section>)}</div> : <p>Insufficient history for two complete 7-day periods after first use. Today and the partial first-use date are excluded.</p>}
      <p className="session-time">Coverage begins at first use. Zero means no activity recorded here, not observed inactivity or lost progress.</p>
    </section>
  </div>;
}
