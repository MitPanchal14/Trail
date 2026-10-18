"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import type { Snapshot } from "@/lib/domain";
import { comparisonPeriods, completionBand, displayDate, formatRecordedTime, progressProjection, yearDates } from "@/lib/progress";
import { overviewTime } from "@/lib/progress-display";

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
type Totals = ReturnType<ReturnType<typeof progressProjection>["totals"]>;
function Measures({ totals }: { totals: Totals }) {
  return <dl className="progress-measures">
    <div><dt>Actions completed</dt><dd>{totals.completions}</dd></div>
    <div><dt>Days with completions</dt><dd>{totals.days}</dd></div>
    <div><dt>Recorded time</dt><dd>{overviewTime(totals.recordedMs)}</dd></div>
  </dl>;
}

export default function ProgressView({ snapshot: s, now }: { snapshot: Snapshot; now: number }) {
  const p = useMemo(() => progressProjection(s, now), [s, now]);
  const [selected, setSelected] = useState(p.today);
  const [fullYear, setFullYear] = useState(true);
  const [focusedDate, setFocusedDate] = useState<string | null>(null);
  const heatmap = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const details = useRef<HTMLHeadingElement>(null);
  const allowedYears = p.years.join(",");
  useEffect(() => {
    const restore = () => {
      const date = window.location.hash.slice(1);
      const year = Number(date.slice(0,4));
      if (allowedYears.split(",").includes(String(year)) && yearDates(year).includes(date)) {
        setSelected(date);
      }
    };
    restore();
    heading.current?.focus();
    window.addEventListener("hashchange", restore);
    return () => window.removeEventListener("hashchange", restore);
  }, [allowedYears]);
  const year = Number(selected.slice(0,4));
  const dates = yearDates(year);
  const day = p.day(selected);
  const offset = (new Date(`${dates[0]}T00:00:00Z`).getUTCDay() + 6) % 7;
  const weeks = Math.ceil((offset + dates.length) / 7);
  useEffect(() => {
    const scroll = heatmap.current;
    const cell = scroll?.querySelector<HTMLElement>(`[data-date="${selected}"]`);
    if (scroll && cell) scroll.scrollLeft += cell.getBoundingClientRect().left - scroll.getBoundingClientRect().left - scroll.clientWidth / 2;
  }, [selected, fullYear]);
  const end = `${year}-12-31` < p.today ? `${year}-12-31` : p.today;
  const periods = comparisonPeriods(s, now);
  const month = Number(selected.slice(5,7)) - 1;
  const totals = p.totals(`${year}-01-01`, end);
  const periodLabel = year === Number(p.today.slice(0,4)) ? `${year} so far` : String(year);
  const choose = (date: string, reveal = true) => {
    setSelected(date);
    setFocusedDate(date);
    window.history.replaceState(window.history.state, "", `/progress#${date}`);
    if (reveal) requestAnimationFrame(() => {
      details.current?.focus({ preventScroll: true });
      details.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };
  const taskTitle = (id: string) => p.tasks.get(id)?.title ?? "Recorded action";
  const project = (id: string) => p.mountains.get(p.tasks.get(id)?.mountainId ?? "")?.title ?? "Recorded goal";
  const renderMonth = (index: number) => {
    const days = dates.filter(d => Number(d.slice(5,7)) === index + 1);
    const offset = (new Date(`${days[0]}T00:00:00Z`).getUTCDay() + 6) % 7;
    return <section className="progress-month" key={index} aria-label={`${months[index]} ${year}`}>
      <h3>{months[index]} {year}</h3>
      <div className="progress-weekdays" aria-hidden="true">{weekdays.map((w, i) => <span key={i}>{w}</span>)}</div>
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
  };
  return <div className="progress-view progress-year-expanded">
    <header className="heading"><div><h1 ref={heading} tabIndex={-1}>Progress</h1></div></header>
    <section className="progress-overview" aria-labelledby="progress-period-title">
      <div className="progress-controls"><h2 id="progress-period-title">{periodLabel}</h2>
        <div className="progress-year-picker"><label htmlFor="progress-year">Calendar year</label><select id="progress-year" value={year} onChange={e => choose(Number(e.target.value) === Number(p.today.slice(0,4)) ? p.today : `${e.target.value}-01-01`, false)}>{p.years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
      </div>
      <Measures totals={totals} />
      <div className="progress-encouragement"><p>{totals.completions ? `${totals.completions} action${totals.completions === 1 ? "" : "s"} completed ${year === Number(p.today.slice(0,4)) ? "this year" : `in ${year}`}. Choose your next step.` : s.completions.some(c => !c.undoneAt) ? "No actions completed in this period. Choose your next step." : "Your first checkpoint starts with one action."}</p><Link className="quiet progress-continue" href="/">Continue your work <span aria-hidden="true">↗</span></Link></div>
    </section>

    <section className="progress-activity" aria-labelledby="progress-activity-title">
      <div className="progress-controls"><h2 id="progress-activity-title">Your trail through the year</h2>
        {!fullYear && <label className="progress-month-picker">Month<select aria-label="Month" value={month} onChange={e => choose(`${year}-${String(Number(e.target.value) + 1).padStart(2,"0")}-01`, false)}>{months.map((label, i) => <option key={label} value={i}>{label}</option>)}</select></label>}
        <button className="quiet progress-view-toggle" aria-pressed={!fullYear} onClick={() => setFullYear(value => !value)}>{fullYear ? "Larger month view" : "Year overview"}</button>
        <button className="quiet" onClick={() => choose(p.today, false)}>Today’s record</button>
      </div>
      {fullYear ? (<div className="progress-heatmap-scroll" ref={heatmap} role="region" aria-label={`${year} completion calendar. Use arrow keys to explore dates, Enter to select. Scroll horizontally for the full year.`}>
    <div className="progress-heatmap" style={{ "--weeks": weeks } as CSSProperties}>
      <div className="heatmap-months" aria-hidden="true">{months.map((label, index) => {
        const start = dates.findIndex(date => Number(date.slice(5, 7)) === index + 1);
        return <span key={label} style={{ gridColumn: Math.floor((start + offset) / 7) + 1 }}>{label.slice(0, 3)}</span>;
      })}</div>
      <div className="heatmap-weekdays" aria-hidden="true"><span>Mon</span><span>Wed</span><span>Fri</span></div>
      <div className="heatmap-dates">
        {Array.from({ length: offset }, (_, i) => <span key={`padding-${i}`} aria-hidden="true" />)}
        {dates.map((date, index) => {
          const d = p.day(date);
          const label = `${displayDate(date)}: ${d.count} completed actions; ${d.planComplete ? "all commitments completed that day" : d.commitments.length ? "not all commitments completed that day" : "no committed plan"}; ${d.state === "future" ? "future date" : d.state === "before-first-use" ? "before first use" : "recorded period"}`;
          return <button key={date} type="button" data-date={date} data-band={completionBand(d.count)} data-date-state={d.state} data-plan-complete={d.planComplete} aria-label={label} title={label} aria-pressed={date === selected} aria-current={date === p.today ? "date" : undefined} aria-controls="progress-day-detail" tabIndex={date === (focusedDate && dates.includes(focusedDate) ? focusedDate : selected) ? 0 : -1} onFocus={() => setFocusedDate(date)} onClick={() => choose(date)} onKeyDown={event => {
            const move = { ArrowLeft: -7, ArrowRight: 7, ArrowUp: -1, ArrowDown: 1 }[event.key];
            if (move === undefined && event.key !== "Home" && event.key !== "End") return;
            event.preventDefault();
            const target = event.key === "Home" ? 0 : event.key === "End" ? dates.length - 1 : Math.max(0, Math.min(dates.length - 1, index + move!));
            heatmap.current?.querySelector<HTMLElement>(`[data-date="${dates[target]}"]`)?.focus();
          }} />;
        })}
      </div>
    </div>
  </div>) : <div className="progress-current-month">{renderMonth(month)}</div>}
      <div className="progress-activity-footer"><span className="session-time">{fullYear ? "Each square is a day. Select one to look closer." : "Select a date to see its record."}</span><div className="progress-legend" aria-label="Completed actions legend"><span>Less</span>{["0", "1", "2–3", "4–5", "6+"].map((label, i) => <span key={label} title={`${label} completed actions`}><i aria-hidden="true" data-band={i} /><span className="sr-only">{label} completed actions</span></span>)}<span>More</span></div></div>
    </section>

    <section className="progress-day" id="progress-day-detail" aria-labelledby="progress-day-title">
      <header><h2 id="progress-day-title" tabIndex={-1} ref={details}>{displayDate(selected)}</h2>{day.state === "future" ? <p>Future date — not a missing day of work.</p> : day.state === "before-first-use" ? <p>Before first use — no activity is inferred.</p> : !day.count && <p>No recorded completions on this date.</p>}</header>
      <dl className="progress-day-measures"><div><dt>Actions completed</dt><dd>{day.count}</dd></div><div><dt>Recorded time</dt><dd>{overviewTime(day.recordedMs)}</dd></div></dl>
      {!!day.commitments.length && <p className="progress-plan-status">{day.committedCompleted} of {day.commitments.length} planned actions completed.{day.planComplete ? " ✓ Plan completed that day." : ""}</p>}
      <details className="progress-day-disclosure" key={selected}><summary>View day details</summary><div className="progress-records">
        <details><summary>Completed actions · {day.count}</summary><section aria-label="Completed actions on selected date">{!day.count ? <p>No recorded completions on this date.</p> : <ol>{day.completed.map(c => <li key={c.id}><h4>{taskTitle(c.subtaskId)}</h4><p>{project(c.subtaskId)}{p.tasks.get(c.subtaskId)?.archivedAt ? " · Archived action" : ""}</p><p>{day.unplanned.some(x => x.id === c.id) ? "Not committed for this date" : "In this date’s commitment history"} · Completed {new Date(c.completedAt).toLocaleTimeString("en", { timeZone: c.calendarTimeZone })} ({c.calendarTimeZone})</p>{c.note && <p className="progress-note">{c.note}</p>}</li>)}</ol>}</section></details>
        <details><summary>Plan history · {day.commitments.length}</summary><section aria-label="Commitment history"><p>Only active completions on this date at or after commitment count toward its plan. Removed or deferred unfinished actions remain in its history; completions on another date do not finish this date’s plan.</p>{!day.commitments.length ? <p>No historical commitments for this date. Unaccepted drafts do not create commitment history.</p> : <ol>{day.commitments.map(({ record, completion, completedOnDate }) => <li key={record.id}><h4>{record.titleSnapshot}</h4><p>{project(record.subtaskId)} · {record.disposition === "removed" ? "Removed" : record.disposition === "deferred" ? "Deferred" : "Committed"}</p><p>{completedOnDate ? "Completed on this date after commitment" : completion ? `Completion recorded ${displayDate(completion.localDate)}${completion.localDate === selected ? " before this commitment" : " on another date"}` : "No active completion recorded"}</p><p className="session-time">Committed {new Date(record.committedAt).toLocaleString("en", { timeZone: s.calendarTimeZone })}{record.dispositionAt ? ` · Latest plan change ${new Date(record.dispositionAt).toLocaleString("en", { timeZone: s.calendarTimeZone })}` : ""}</p></li>)}</ol>}</section></details>
        <details><summary>Recorded time · {overviewTime(day.recordedMs)}</summary><section aria-label="Recorded session time"><p>{formatRecordedTime(day.recordedMs)} ({day.recordedMs / 1000} seconds) recorded on this date. Elapsed session time, not proof of attention; each session’s daily contribution is counted once.</p>{!day.sessions.length ? <p>No session time recorded on this date.</p> : <ul>{day.sessions.map(({ session, ms }) => <li key={session.id}><h4>{taskTitle(session.subtaskId)}</h4><p>{project(session.subtaskId)} · {formatRecordedTime(ms)} ({ms / 1000} seconds) recorded on this date</p></li>)}</ul>}</section></details>
        <details><summary>Saved places · {day.saves.length}</summary><section aria-label="Latest recorded saves"><p>Only each mountain’s latest save date is retained. Notes below are current context, not a historical copy of that save. Heartbeats, pauses and interruptions are not save events.</p>{!day.saves.length ? <p>No latest saved place is recorded for this date; earlier saves may have been replaced.</p> : <ul>{day.saves.map(({ mountain, session }) => <li key={mountain.id}><h4>{mountain.title}</h4><p>{taskTitle(mountain.savedSubtaskId!)}</p>{session?.returnStep && <p className="progress-note">Current first return step: {session.returnStep}</p>}{session?.note && <p className="progress-note">Current stopping note: {session.note}</p>}<Link href={`/mountains#${mountain.id}`}>Inspect this mountain</Link></li>)}</ul>}</section></details>
      </div></details>
    </section>

    <details className="progress-comparison"><summary>Compare recent weeks</summary><p>Last 7 complete local dates versus the preceding 7. Today is excluded; these are counts, not productivity scores.</p>
      {periods.sufficient ? <div className="progress-detail-columns">{[{ label: "Last 7 days", range: periods.recent }, { label: "Previous 7 days", range: periods.previous }].map(({ label, range }) => { const t = p.totals(range.start, range.end); return <section key={label}><h3>{label}</h3><p>{displayDate(range.start)} – {displayDate(range.end)}</p><Measures totals={t} /><p className="session-time">Exact recorded time: {formatRecordedTime(t.recordedMs)} ({t.recordedMs / 1000} seconds).</p></section>; })}</div> : <p>Insufficient history for two complete 7-day periods after first use. Today and the partial first-use date are excluded.</p>}
      <p className="session-time">Coverage begins at first use. Zero means no activity recorded here, not observed inactivity or lost progress.</p>
    </details>
    <details className="progress-about"><summary>About these numbers</summary>
      <p>{periodLabel}: {displayDate(`${year}-01-01`)} – {displayDate(end)}{year === Number(p.today.slice(0,4)) ? ". Includes today’s partial record." : "."} Exact recorded time: {formatRecordedTime(totals.recordedMs)} ({totals.recordedMs / 1000} seconds).</p>
      <p>Calendar timezone: <strong>{s.calendarTimeZone}</strong>. First use: {displayDate(p.firstUse)}.</p>
      <p>Squares count active completed actions on their recorded dates, including archived work. Undo removes only corrected credit. Time, saves and summit confirmations do not add completions.</p>
      <p>Empty squares: no recorded completions. Dashed squares: before first use. Dotted squares: future dates. Outlined square: selected date. Underlined square: today. Small dot: plan completed that day. Colours use fixed bands: 0, 1, 2–3, 4–5, 6+.</p>
      <p>✓ requires a nonempty commitment history and every action actively completed on that date after commitment. Removing or deferring unfinished actions does not earn it. Quiet days retain your earned mountain scenery.</p>
    </details>
  </div>;
}
