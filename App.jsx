import React, { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, Clock, CalendarDays, CheckCircle2, Circle, Users,
  Flag, Rocket, ChevronDown, ChevronRight, Wallet, FileText, Bell, Star,
  Pencil, Plus, Trash2, X, CalendarPlus, RotateCcw, Check
} from "lucide-react";

// ---------- Team ----------
const TEAM = {
  shain:    { name: "Shain Mukungu",        short: "SM",  role: "Project & Technical Lead — LMS, systems, coordination", color: "#6366f1" },
  tumisang: { name: "Tumisang Kedidimetse", short: "TK",  role: "Head of Academics — curriculum & lessons",             color: "#10b981" },
  baboloki: { name: "Baboloki C. Mazhani",  short: "BM",  role: "Data, Operations, Logistics & Finance (3rd party)",    color: "#0ea5e9" },
  calvin:   { name: "Calvin Dichaba",       short: "CD",  role: "Marketing, Branding & Design",                         color: "#a855f7" },
  all:      { name: "Whole team",           short: "ALL", role: "Everyone",                                              color: "#64748b" },
};
const TEAM_IDS = ["shain", "tumisang", "baboloki", "calvin"];
const STORAGE_KEY = "abiznet_board_v1";
const LEGACY_KEY = "abiznet_task_status_v1";
const PROJECT_END = "2026-12-31";

// ---------- Seed data ----------
const SEED_PHASES = [
  { id: "p0", label: "Done so far", month: "May – Jun", accent: "#10b981", tasks: [
    { id: "p0-1", title: "Confirm implementation + team acceptance to OAD", owner: ["shain"], due: "2026-05-20", done: true },
    { id: "p0-2", title: "Submit signed grant agreement, banking & supporting docs", owner: ["shain"], due: "2026-05-31", done: true, ext: true },
    { id: "p0-3", title: "Submit completed Project Plan", owner: ["shain"], due: "2026-05-31", done: true, ext: true },
    { id: "p0-4", title: "Attend OAD virtual onboarding session", owner: ["all"], due: "2026-06-12", done: true },
  ]},
  { id: "p1", label: "Planning & setup", month: "June", accent: "#6366f1", tasks: [
    { id: "p1-10", title: "Schedule first internal team planning meeting", owner: ["shain"], due: "2026-06-18" },
    { id: "p1-2",  title: "Set up team comms + shared workspace (WhatsApp / Drive)", owner: ["baboloki"], due: "2026-06-19" },
    { id: "p1-1",  title: "Decide & register the domain (astrobiz.net vs astrobiznet.com — pick ONE)", owner: ["shain"], due: "2026-06-20" },
    { id: "p1-3",  title: "Confirm grant received; open financial tracking sheet", owner: ["baboloki"], due: "2026-06-25" },
    { id: "p1-9",  title: "Agree baseline evaluation timing with OAD; request the survey", owner: ["shain","baboloki"], due: "2026-06-26" },
    { id: "p1-4",  title: "Finalise 16-lesson curriculum outline & weekly flow", owner: ["tumisang"], due: "2026-06-28" },
    { id: "p1-5",  title: "Design brand identity (logo, colours, slide & poster templates)", owner: ["calvin"], due: "2026-06-28" },
    { id: "p1-6",  title: "Design LMS competition structure (dashboards, quizzes, scoring, filtering)", owner: ["shain"], due: "2026-06-30" },
    { id: "p1-7",  title: "Draft communications & social media plan + content calendar", owner: ["calvin"], due: "2026-06-30" },
    { id: "p1-8",  title: "Define weekly assessment & participant filtering plan", owner: ["tumisang","shain"], due: "2026-06-30" },
  ]},
  { id: "p2", label: "Build & recruit", month: "July", accent: "#0ea5e9", tasks: [
    { id: "p2-1", title: "Purchase hosting & deploy the LMS environment", owner: ["shain"], due: "2026-07-05" },
    { id: "p2-4", title: "Create Google Form registration + intake process", owner: ["baboloki"], due: "2026-07-08" },
    { id: "p2-5", title: "Produce recruitment creatives & campus posters", owner: ["calvin"], due: "2026-07-10" },
    { id: "p2-6", title: "Launch recruitment campaign (target 50 applicants)", owner: ["calvin","all"], due: "2026-07-15" },
    { id: "p2-7", title: "Secure university venue for final event (UNAM / BIUST)", owner: ["baboloki","shain"], due: "2026-07-20" },
    { id: "p2-2", title: "Build LMS features (dashboards, quiz engine, scoring, filtering, progress)", owner: ["shain"], due: "2026-07-25" },
    { id: "p2-3", title: "Develop materials for all 16 lessons (content, slides, quizzes)", owner: ["tumisang"], due: "2026-07-28" },
    { id: "p2-8", title: "Select & confirm the 50-participant cohort", owner: ["shain","tumisang"], due: "2026-07-31" },
  ]},
  { id: "p3", label: "Astronomy lessons (8)", month: "August", accent: "#8b5cf6", tasks: [
    { id: "p3-1", title: "Administer BASELINE evaluation to cohort (before any lessons)", owner: ["baboloki"], due: "2026-08-03", ext: true },
    { id: "p3-2", title: "Run participant onboarding & orientation", owner: ["shain","all"], due: "2026-08-05" },
    { id: "p3-3", title: "Set up cohort communication channels", owner: ["calvin","baboloki"], due: "2026-08-05" },
    { id: "p3-4", title: "Deliver 8 intro astronomy lessons", owner: ["tumisang"], due: "2026-08-28" },
    { id: "p3-5", title: "Run weekly quizzes & track engagement", owner: ["shain"], due: "2026-08-28" },
    { id: "p3-6", title: "Monitor attendance & completion weekly", owner: ["baboloki"], due: "2026-08-28" },
  ]},
  { id: "p4", label: "Skills & entrepreneurship (8)", month: "September", accent: "#ec4899", tasks: [
    { id: "p4-3", title: "Administer MIDLINE evaluation (OAD survey)", owner: ["baboloki"], due: "2026-09-15", ext: true },
    { id: "p4-1", title: "Deliver 8 skills & entrepreneurship lessons (Python, data, CV, pitching)", owner: ["tumisang"], due: "2026-09-25" },
    { id: "p4-2", title: "Continue weekly assessments & filtering rounds", owner: ["shain"], due: "2026-09-25" },
    { id: "p4-4", title: "Track quiz performance; identify front-runners", owner: ["shain"], due: "2026-09-25" },
  ]},
  { id: "p5", label: "Finals & pitch event", month: "October", accent: "#f59e0b", tasks: [
    { id: "p5-1", title: "Mentorship & participant project refinement", owner: ["all"], due: "2026-10-09" },
    { id: "p5-2", title: "Shortlist top 6 finalists / teams", owner: ["shain","tumisang"], due: "2026-10-09" },
    { id: "p5-3", title: "Lock final-event logistics (accommodation, catering, transport)", owner: ["baboloki"], due: "2026-10-10" },
    { id: "p5-4", title: "Confirm judges, mentors, stakeholders & invitations", owner: ["shain","calvin"], due: "2026-10-12" },
    { id: "p5-5", title: "Prepare name tags, event branding & materials", owner: ["calvin"], due: "2026-10-15" },
    { id: "p5-6", title: "Run the 3-day final pitch competition & networking event", owner: ["all"], due: "2026-10-20", ext: true },
    { id: "p5-7", title: "Award seed funding (£350 / £250) + top quiz performer (£100)", owner: ["baboloki"], due: "2026-10-22" },
  ]},
  { id: "p6", label: "Evaluation & reporting", month: "November", accent: "#14b8a6", tasks: [
    { id: "p6-1", title: "Administer post-project / endline evaluation", owner: ["baboloki"], due: "2026-11-05", ext: true },
    { id: "p6-2", title: "Collect testimonials, case studies & participant feedback", owner: ["tumisang","baboloki"], due: "2026-11-10" },
    { id: "p6-4", title: "Compare baseline vs endline; assess outcomes achieved", owner: ["shain","baboloki"], due: "2026-11-18" },
    { id: "p6-3", title: "Compile financial report (breakdown + receipts / invoices)", owner: ["baboloki"], due: "2026-11-20", ext: true },
    { id: "p6-5", title: "Draft & submit the OAD Final Project Report", owner: ["shain"], due: "2026-11-28", ext: true },
    { id: "p6-6", title: "Plan future cohorts & collaborations", owner: ["all"], due: "2026-11-30" },
  ]},
];

const SEED_EVENTS = [
  { id: "ev-onboard",  label: "OAD virtual onboarding",          date: "2026-06-12", type: "meeting",   done: true },
  { id: "ev-meet1",    label: "First internal team meeting",     date: "2026-06-18", type: "meeting",   tbd: true },
  { id: "ev-recruit",  label: "Recruitment launch",              date: "2026-07-15", type: "milestone" },
  { id: "ev-cohort",   label: "Cohort starts (baseline first)",  date: "2026-08-03", type: "milestone" },
  { id: "ev-final",    label: "Final pitch competition",         date: "2026-10-20", endDate: "2026-10-22", type: "milestone" },
  { id: "ev-complete", label: "Project completion",              date: "2026-12-31", type: "milestone" },
];

// ---------- helpers ----------
const parseDate = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const fmt = (s) => parseDate(s).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const fmtLong = (s) => parseDate(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const toICSDate = (s) => s.replace(/-/g, "");
const addDay = (s) => { const d = parseDate(s); d.setDate(d.getDate() + 1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
const newId = () => "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const sortTasks = (arr) => [...arr].sort((a, b) => {
  if (!a.due) return 1; if (!b.due) return -1; return parseDate(a.due) - parseDate(b.due);
});
const clone = (x) => JSON.parse(JSON.stringify(x));

export default function Dashboard() {
  const [board, setBoard] = useState(null);
  const [synced, setSynced] = useState(true);
  const [lastSynced, setLastSynced] = useState(null);
  const [polling, setPolling] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [showDone, setShowDone] = useState(true);
  const [collapsed, setCollapsed] = useState({ p0: true });
  const [editing, setEditing] = useState(null); // {mode:'task'|'event', isNew}
  const [draft, setDraft] = useState(null);

  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);
  const todayStr = useMemo(() => `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`, [today]);
  const daysTo = (s) => Math.round((parseDate(s) - today) / 86400000);

  // ----- load -----
  useEffect(() => {
    (async () => {
      try {
        if (typeof window !== "undefined" && window.storage) {
          const r = await window.storage.get(STORAGE_KEY, true);
          if (r && r.value) { setBoard(JSON.parse(r.value)); return; }
        }
      } catch (e) { /* none yet */ }
      // seed (with optional migration from v1 tick-offs)
      const seed = { phases: clone(SEED_PHASES), events: clone(SEED_EVENTS) };
      try {
        if (typeof window !== "undefined" && window.storage) {
          const old = await window.storage.get(LEGACY_KEY, true);
          if (old && old.value) {
            const m = JSON.parse(old.value);
            seed.phases.forEach((p) => p.tasks.forEach((t) => { if (Object.prototype.hasOwnProperty.call(m, t.id)) t.done = m[t.id]; }));
          }
        }
      } catch (e) { /* ignore */ }
      setBoard(seed);
      persist(seed, true);
    })();
    // eslint-disable-next-line
  }, []);

  // ----- poll for remote changes every 30s -----
  const fetchRemote = async (silent = false) => {
    if (!silent) setPolling(true);
    try {
      if (typeof window !== "undefined" && window.storage) {
        const r = await window.storage.get(STORAGE_KEY, true);
        if (r && r.value) {
          setBoard(JSON.parse(r.value));
          setSynced(true);
          setLastSynced(new Date());
        }
      }
    } catch (e) { setSynced(false); }
    if (!silent) setPolling(false);
  };

  useEffect(() => {
    const id = setInterval(() => fetchRemote(true), 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, []);

  const persist = async (next, silent) => {
    if (!silent) setBoard(next);
    try {
      if (typeof window !== "undefined" && window.storage) {
        await window.storage.set(STORAGE_KEY, JSON.stringify(next), true);
        setSynced(true);
        setLastSynced(new Date());
      }
    } catch (e) { setSynced(false); }
  };

  // ----- mutations -----
  const toggleTask = (id) => persist({
    ...board,
    phases: board.phases.map((p) => ({ ...p, tasks: p.tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t) })),
  });

  const openNewTask = (phaseId) => { setDraft({ id: newId(), title: "", owner: ["all"], due: todayStr, note: "", ext: false, done: false, phaseId }); setEditing({ mode: "task", isNew: true }); };
  const openEditTask = (t, phaseId) => { setDraft({ ...t, note: t.note || "", phaseId }); setEditing({ mode: "task", isNew: false }); };
  const commitTask = () => {
    const d = draft;
    const owner = d.owner && d.owner.length ? d.owner : ["all"];
    const t = { id: d.id, title: d.title.trim(), owner, due: d.due || "", note: (d.note || "").trim(), ext: !!d.ext, done: !!d.done };
    let phases = board.phases.map((p) => ({ ...p, tasks: p.tasks.filter((x) => x.id !== t.id) }));
    phases = phases.map((p) => p.id === d.phaseId ? { ...p, tasks: sortTasks([...p.tasks, t]) } : p);
    persist({ ...board, phases }); setEditing(null); setDraft(null);
  };
  const removeTask = (id) => { persist({ ...board, phases: board.phases.map((p) => ({ ...p, tasks: p.tasks.filter((t) => t.id !== id) })) }); setEditing(null); setDraft(null); };

  const openNewEvent = () => { setDraft({ id: newId(), label: "", date: todayStr, type: "meeting", done: false }); setEditing({ mode: "event", isNew: true }); };
  const openEditEvent = (e) => { setDraft({ ...e }); setEditing({ mode: "event", isNew: false }); };
  const commitEvent = () => {
    const e = { id: draft.id, label: draft.label.trim(), date: draft.date, type: draft.type, done: !!draft.done, endDate: draft.endDate };
    const others = board.events.filter((x) => x.id !== e.id);
    const events = [...others, e].sort((a, b) => parseDate(a.date) - parseDate(b.date));
    persist({ ...board, events }); setEditing(null); setDraft(null);
  };
  const removeEvent = (id) => { persist({ ...board, events: board.events.filter((e) => e.id !== id) }); setEditing(null); setDraft(null); };

  const resetBoard = () => {
    if (!window.confirm("Reset the whole board back to the original plan? Any edits and tick-offs will be lost for everyone.")) return;
    const seed = { phases: clone(SEED_PHASES), events: clone(SEED_EVENTS) };
    persist(seed);
  };

  // ----- calendar export -----
  const exportICS = () => {
    if (!board) return;
    const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const items = [];
    board.events.forEach((e) => items.push({ uid: e.id, start: e.date, end: e.endDate ? addDay(e.endDate) : addDay(e.date), title: e.label, desc: e.type === "meeting" ? "AstroBizNet meeting" : "AstroBizNet milestone" }));
    board.phases.forEach((p) => p.tasks.forEach((t) => { if (t.ext && !t.done) items.push({ uid: t.id, start: t.due, end: addDay(t.due), title: t.title, desc: "Owner: " + t.owner.map((o) => TEAM[o]?.name).join(", ") }); }));
    const L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//AstroBizNet//Dashboard//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:AstroBizNet"];
    items.filter((i) => i.start).forEach((i) => {
      L.push("BEGIN:VEVENT", `UID:${i.uid}@astrobiznet`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${toICSDate(i.start)}`, `DTEND;VALUE=DATE:${toICSDate(i.end)}`, `SUMMARY:AstroBizNet · ${i.title}`, `DESCRIPTION:${i.desc}`, "TRANSP:TRANSPARENT");
      ["-P7D", "-P1D"].forEach((off) => L.push("BEGIN:VALARM", `TRIGGER:${off}`, "ACTION:DISPLAY", `DESCRIPTION:Reminder: ${i.title}`, "END:VALARM"));
      L.push("END:VEVENT");
    });
    L.push("END:VCALENDAR");
    try {
      const blob = new Blob([L.join("\r\n") + "\r\n"], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "astrobiznet-calendar.ics";
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
    } catch (e) { window.alert("Couldn't download here — use the .ics file shared in the chat instead."); }
  };

  // ----- derived -----
  const matchesOwner = (t) => ownerFilter === "all" || t.owner.includes(ownerFilter);
  const allTasks = useMemo(() => board ? board.phases.flatMap((p) => p.tasks.map((t) => ({ ...t, phase: p }))) : [], [board]);

  const buckets = useMemo(() => {
    const open = allTasks.filter((t) => !t.done && t.due && matchesOwner(t));
    const s = (a, b) => parseDate(a.due) - parseDate(b.due);
    return {
      overdue: open.filter((t) => daysTo(t.due) < 0).sort(s),
      week: open.filter((t) => daysTo(t.due) >= 0 && daysTo(t.due) <= 7).sort(s),
      soon: open.filter((t) => daysTo(t.due) >= 8 && daysTo(t.due) <= 21).sort(s),
    };
    // eslint-disable-next-line
  }, [allTasks, ownerFilter]);

  const counts = useMemo(() => {
    const total = allTasks.length, done = allTasks.filter((t) => t.done).length;
    return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  }, [allTasks]);

  const ownerStats = (id) => { const l = allTasks.filter((t) => t.owner.includes(id)); return { open: l.filter((t) => !t.done).length }; };
  const daysLeft = daysTo(PROJECT_END);

  const taskState = (t) => {
    if (t.done) return "done";
    if (!t.due) return "scheduled";
    const d = daysTo(t.due);
    return d < 0 ? "overdue" : d <= 7 ? "week" : "scheduled";
  };
  const STATE = {
    overdue:   { bar: "#f43f5e", chip: "#fecdd3", text: "#9f1239" },
    week:      { bar: "#f59e0b", chip: "#fde68a", text: "#92400e" },
    scheduled: { bar: "#cbd5e1", chip: "#e2e8f0", text: "#475569" },
    done:      { bar: "#10b981", chip: "#f1f5f9", text: "#94a3b8" },
  };

  // ----- UI bits -----
  const OwnerChip = ({ id }) => { const m = TEAM[id]; return (
    <span className="inline-flex items-center gap-1 rounded-full font-medium" style={{ background: m.color + "1f", color: m.color, padding: "1px 7px", fontSize: 11 }}>
      <span className="rounded-full" style={{ width: 6, height: 6, background: m.color }} />{m.short}
    </span>); };

  const TaskRow = ({ t, phaseId }) => {
    const st = taskState(t), d = t.due ? daysTo(t.due) : null;
    return (
      <div className="group flex items-start gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-slate-50" style={{ borderLeft: `3px solid ${STATE[st].bar}` }}>
        <button onClick={() => toggleTask(t.id)} className="mt-0.5 shrink-0" aria-label="toggle done">
          {t.done ? <CheckCircle2 size={19} style={{ color: "#10b981" }} /> : <Circle size={19} className="text-slate-300 hover:text-slate-400" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className={"text-sm leading-snug " + (t.done ? "line-through text-slate-400" : "text-slate-800")}>
            {t.title}{t.ext && !t.done && <Flag size={12} className="inline -mt-0.5 ml-1" style={{ color: "#f43f5e" }} />}
          </div>
          {t.note && <div className="text-[12px] text-slate-500 mt-0.5 italic">{t.note}</div>}
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
            {t.owner.map((o) => <OwnerChip key={o} id={o} />)}
            {t.due && (
              <span className="inline-flex items-center gap-1 rounded-full text-xs font-medium px-2 py-0.5" style={{ background: STATE[st].chip, color: STATE[st].text }}>
                <CalendarDays size={11} /> {fmt(t.due)}
                {!t.done && d < 0 && <span className="font-semibold"> · {Math.abs(d)}d late</span>}
                {!t.done && d >= 0 && d <= 7 && <span className="font-semibold"> · {d === 0 ? "today" : d + "d"}</span>}
              </span>
            )}
          </div>
        </div>
        <button onClick={() => openEditTask(t, phaseId)} className="shrink-0 p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="edit task">
          <Pencil size={14} />
        </button>
      </div>
    );
  };

  const MiniTask = ({ t }) => (
    <button onClick={() => toggleTask(t.id)} className="w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-white/70">
      <Circle size={15} className="text-slate-300 shrink-0" />
      <span className="flex-1 min-w-0 text-[13px] text-slate-700 truncate">{t.title}</span>
      <span className="flex items-center gap-1 shrink-0">
        {t.owner.slice(0, 2).map((o) => <span key={o} className="rounded-full" style={{ width: 7, height: 7, background: TEAM[o].color }} title={TEAM[o].name} />)}
        <span className="text-[11px] font-semibold text-slate-500 tabular-nums">{fmt(t.due)}</span>
      </span>
    </button>
  );

  if (!board) return <div className="min-h-[300px] grid place-items-center text-slate-400" style={{ fontFamily: "ui-sans-serif, system-ui" }}>Loading your board…</div>;

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto" }} className="bg-slate-100 text-slate-900 p-3 sm:p-5">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl text-white p-5 sm:p-7 mb-4" style={{ background: "radial-gradient(120% 140% at 85% -10%, #2a3473 0%, #141a35 45%, #0b0f23 100%)" }}>
          <div className="absolute inset-0 opacity-70 pointer-events-none" style={{ backgroundImage: "radial-gradient(1px 1px at 12% 30%, #fff, transparent), radial-gradient(1px 1px at 28% 70%, #cbd5e1, transparent), radial-gradient(1.5px 1.5px at 52% 22%, #fff, transparent), radial-gradient(1px 1px at 68% 58%, #e0e7ff, transparent), radial-gradient(1px 1px at 82% 34%, #fff, transparent), radial-gradient(1px 1px at 92% 72%, #cbd5e1, transparent), radial-gradient(1px 1px at 40% 48%, #fff, transparent)" }} />
          <div className="relative">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-indigo-300/90 font-semibold">DARA · IAU OAD 2026 · Grant ABizNet</div>
                <h1 className="text-2xl sm:text-3xl font-bold mt-1 tracking-tight">AstroBizNet — Mission Control</h1>
                <p className="text-indigo-200/80 text-sm mt-1">£4,896 · Jan–Dec 2026 · Botswana &amp; Namibia · Lead: Shain Mukungu</p>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-widest text-indigo-300/80">Today</div>
                <div className="text-lg font-semibold tabular-nums">{today.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs"><Clock size={12} /> {daysLeft} days to completion</div>
              </div>
            </div>
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs text-indigo-200/80 mb-1.5">
                <span>{counts.done} of {counts.total} tasks complete</span>
                <span className="font-semibold text-white">{counts.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/15 overflow-hidden"><div className="h-full rounded-full" style={{ width: counts.pct + "%", background: "linear-gradient(90deg,#818cf8,#22d3ee)" }} /></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={exportICS} className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 text-slate-800 text-xs font-semibold px-3 py-2 hover:bg-white transition-colors">
                <CalendarPlus size={14} /> Add deadlines to calendar
              </button>
            </div>
          </div>
        </header>

        {/* Action centre */}
        <section className="mb-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Bell size={15} className="text-slate-500" />
            <h2 className="text-[11px] uppercase tracking-[0.18em] font-bold text-slate-500">Action centre — what needs you now</h2>
            {ownerFilter !== "all" && <span className="text-xs text-slate-500">· {TEAM[ownerFilter].name}</span>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ActionCard title="Overdue" icon={AlertTriangle} accent="#f43f5e" tasks={buckets.overdue} empty="Nothing overdue 🎉" MiniTask={MiniTask} />
            <ActionCard title="Due this week" icon={Clock} accent="#f59e0b" tasks={buckets.week} empty="Clear this week" MiniTask={MiniTask} />
            <ActionCard title="Next 2 weeks" icon={CalendarDays} accent="#6366f1" tasks={buckets.soon} empty="Nothing coming up yet" MiniTask={MiniTask} />
          </div>
        </section>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-3 px-1">
          <span className="text-xs font-semibold text-slate-500 mr-1">Filter:</span>
          <button onClick={() => setOwnerFilter("all")} className={"text-xs font-medium px-3 py-1.5 rounded-full border " + (ownerFilter === "all" ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")}>Everyone</button>
          {TEAM_IDS.map((id) => { const active = ownerFilter === id, m = TEAM[id]; return (
            <button key={id} onClick={() => setOwnerFilter(id)} className="text-xs font-medium px-3 py-1.5 rounded-full border inline-flex items-center gap-1.5" style={active ? { background: m.color, borderColor: m.color, color: "#fff" } : { background: "#fff", borderColor: "#e2e8f0", color: "#475569" }}>
              <span className="rounded-full" style={{ width: 7, height: 7, background: active ? "#fff" : m.color }} />{m.name.split(" ")[0]}
            </button>); })}
          <label className="ml-auto text-xs text-slate-500 inline-flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} className="accent-indigo-600" /> Show completed
          </label>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-3">
            {board.phases.map((p) => {
              const visible = p.tasks.filter((t) => matchesOwner(t) && (showDone || !t.done));
              const done = p.tasks.filter((t) => t.done).length, total = p.tasks.length;
              const isOpen = !collapsed[p.id];
              if (visible.length === 0 && ownerFilter !== "all") return null;
              return (
                <div key={p.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="w-full flex items-center gap-3 px-3 py-3">
                    <button onClick={() => setCollapsed((c) => ({ ...c, [p.id]: !c[p.id] }))} className="flex items-center gap-3 flex-1 text-left hover:opacity-70">
                      {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                      <span className="rounded-md" style={{ width: 9, height: 9, background: p.accent }} />
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800 text-sm">{p.label}</div>
                        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">{p.month}</div>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-slate-500">{done}/{total}</span>
                      <div className="w-14 h-1.5 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full" style={{ width: (total ? (done / total) * 100 : 0) + "%", background: p.accent }} /></div>
                    </button>
                    <button onClick={() => openNewTask(p.id)} className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" title="Add task to this phase"><Plus size={16} /></button>
                  </div>
                  {isOpen && (
                    <div className="px-2 pb-2 space-y-0.5 border-t border-slate-100">
                      {visible.length === 0 ? <div className="text-xs text-slate-400 px-3 py-3">No tasks here yet. Use ＋ to add one.</div> : visible.map((t) => <TaskRow key={t.id} t={t} phaseId={p.id} />)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Panel icon={Users} title="Team & load">
              <div className="space-y-2.5">
                {TEAM_IDS.map((id) => { const m = TEAM[id], s = ownerStats(id); return (
                  <button key={id} onClick={() => setOwnerFilter(ownerFilter === id ? "all" : id)} className="w-full flex items-center gap-3 text-left group">
                    <span className="grid place-items-center rounded-full text-[11px] font-bold text-white shrink-0" style={{ width: 30, height: 30, background: m.color }}>{m.short}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-slate-800 truncate group-hover:text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{m.role}</div>
                    </div>
                    <span className="text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0" style={{ background: m.color + "1a", color: m.color }}>{s.open} open</span>
                  </button>); })}
              </div>
            </Panel>

            <Panel icon={CalendarDays} title="Dates & meetings" action={<button onClick={openNewEvent} className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" title="Add date / meeting"><Plus size={15} /></button>}>
              <div className="space-y-2.5">
                {board.events.map((k) => { const past = k.done, d = daysTo(k.date); const Icon = k.type === "meeting" ? Users : Flag; return (
                  <div key={k.id} className="group flex items-center gap-2.5">
                    <Icon size={15} className="shrink-0" style={{ color: past ? "#10b981" : d < 0 ? "#94a3b8" : k.type === "meeting" ? "#6366f1" : "#14b8a6" }} />
                    <div className="flex-1 min-w-0">
                      <div className={"text-[13px] " + (past ? "text-slate-400 line-through" : "text-slate-700")}>{k.label}{k.tbd && <span className="text-amber-500 text-[11px]"> · confirm</span>}</div>
                      <div className="text-[11px] text-slate-400">{fmtLong(k.date)}{k.endDate ? " – " + fmtLong(k.endDate) : ""}</div>
                    </div>
                    {!past && d >= 0 && <span className="text-[11px] font-semibold text-slate-400 tabular-nums shrink-0">{d}d</span>}
                    <button onClick={() => openEditEvent(k)} className="shrink-0 p-1 rounded-md text-slate-300 hover:text-slate-600 hover:bg-slate-100 opacity-0 group-hover:opacity-100" aria-label="edit"><Pencil size={13} /></button>
                  </div>); })}
              </div>
            </Panel>

            <Panel icon={FileText} title="Don't get caught out">
              <ul className="space-y-2 text-[12px] text-slate-600">
                <li className="flex gap-2"><Wallet size={14} className="shrink-0 mt-0.5 text-teal-600" /><span><b>Keep every receipt & invoice.</b> The financial report needs proof of expenditure.</span></li>
                <li className="flex gap-2"><Clock size={14} className="shrink-0 mt-0.5 text-amber-600" /><span>Final reporting data is due <b>within 30 days</b> of the OAD's request.</span></li>
                <li className="flex gap-2"><Bell size={14} className="shrink-0 mt-0.5 text-rose-500" /><span>Any interim report the OAD asks for is due in <b>7 working days</b>.</span></li>
                <li className="flex gap-2"><Flag size={14} className="shrink-0 mt-0.5 text-indigo-500" /><span>Tell the OAD in writing <b>before</b> any major budget or timeline change.</span></li>
              </ul>
            </Panel>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-5 text-[11px] text-slate-400 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-full" style={{ width: 6, height: 6, background: synced ? "#10b981" : "#f43f5e" }} />
            {synced ? "Synced with team" : "Sync unavailable"}
          </span>
          {lastSynced && <span>· last updated {lastSynced.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</span>}
          <span>·</span>
          <button onClick={() => fetchRemote(false)} disabled={polling} className="inline-flex items-center gap-1 hover:text-slate-600 disabled:opacity-40">
            <RotateCcw size={11} className={polling ? "animate-spin" : ""} /> {polling ? "Syncing…" : "Sync now"}
          </button>
          <span>·</span>
          <button onClick={resetBoard} className="inline-flex items-center gap-1 hover:text-slate-600"><RotateCcw size={11} /> Reset to template</button>
        </div>
      </div>

      {/* ---------- Editor modal ---------- */}
      {editing && draft && (
        <div className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/40 p-0 sm:p-4" onClick={() => { setEditing(null); setDraft(null); }}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white">
              <h3 className="font-semibold text-slate-800">{editing.isNew ? (editing.mode === "task" ? "Add task" : "Add date / meeting") : (editing.mode === "task" ? "Edit task" : "Edit date / meeting")}</h3>
              <button onClick={() => { setEditing(null); setDraft(null); }} className="p-1 rounded-md text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>

            <div className="p-5 space-y-4">
              {editing.mode === "task" ? (
                <>
                  <Field label="Task">
                    <input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="What needs doing?" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </Field>
                  <Field label="Assigned to">
                    <div className="flex flex-wrap gap-1.5">
                      {TEAM_IDS.map((id) => { const m = TEAM[id], on = draft.owner.includes(id) && !draft.owner.includes("all"); return (
                        <button key={id} onClick={() => { const cur = draft.owner.filter((o) => o !== "all"); const next = on ? cur.filter((o) => o !== id) : [...cur, id]; setDraft({ ...draft, owner: next.length ? next : ["all"] }); }} className="text-xs font-medium px-2.5 py-1.5 rounded-full border inline-flex items-center gap-1.5" style={on ? { background: m.color, borderColor: m.color, color: "#fff" } : { background: "#fff", borderColor: "#e2e8f0", color: "#475569" }}>
                          <span className="rounded-full" style={{ width: 7, height: 7, background: on ? "#fff" : m.color }} />{m.name.split(" ")[0]}
                        </button>); })}
                      <button onClick={() => setDraft({ ...draft, owner: ["all"] })} className="text-xs font-medium px-2.5 py-1.5 rounded-full border inline-flex items-center gap-1.5" style={draft.owner.includes("all") ? { background: "#64748b", borderColor: "#64748b", color: "#fff" } : { background: "#fff", borderColor: "#e2e8f0", color: "#475569" }}>Whole team</button>
                    </div>
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Due date"><input type="date" value={draft.due} onChange={(e) => setDraft({ ...draft, due: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></Field>
                    <Field label="Phase"><select value={draft.phaseId} onChange={(e) => setDraft({ ...draft, phaseId: e.target.value })} className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">{board.phases.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select></Field>
                  </div>
                  <Field label="Note (optional) — blockers, links, details"><textarea value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} rows={2} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></Field>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"><input type="checkbox" checked={draft.ext} onChange={(e) => setDraft({ ...draft, ext: e.target.checked })} className="accent-rose-500" /><Flag size={14} className="text-rose-500" /> Hard deadline (grant-critical — adds to calendar export)</label>
                </>
              ) : (
                <>
                  <Field label="Title"><input autoFocus value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="e.g. OAD check-in call" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Date"><input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></Field>
                    <Field label="End (optional)"><input type="date" value={draft.endDate || ""} onChange={(e) => setDraft({ ...draft, endDate: e.target.value || undefined })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" /></Field>
                  </div>
                  <Field label="Type">
                    <div className="flex gap-1.5">
                      {[["meeting", "Meeting"], ["milestone", "Milestone"]].map(([v, lab]) => (
                        <button key={v} onClick={() => setDraft({ ...draft, type: v })} className={"text-sm font-medium px-3 py-1.5 rounded-lg border flex-1 " + (draft.type === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200")}>{lab}</button>
                      ))}
                    </div>
                  </Field>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"><input type="checkbox" checked={draft.done} onChange={(e) => setDraft({ ...draft, done: e.target.checked })} className="accent-emerald-500" /> Mark as done / past</label>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 px-5 py-4 border-t border-slate-100 sticky bottom-0 bg-white">
              {!editing.isNew && <button onClick={() => editing.mode === "task" ? removeTask(draft.id) : removeEvent(draft.id)} className="inline-flex items-center gap-1.5 text-sm text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg font-medium"><Trash2 size={15} /> Delete</button>}
              <div className="ml-auto flex gap-2">
                <button onClick={() => { setEditing(null); setDraft(null); }} className="text-sm text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 font-medium">Cancel</button>
                <button disabled={editing.mode === "task" ? !draft.title.trim() : !draft.label.trim()} onClick={() => editing.mode === "task" ? commitTask() : commitEvent()} className="inline-flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-40 disabled:cursor-not-allowed"><Check size={15} /> Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionCard({ title, icon: Icon, accent, tasks, empty, MiniTask }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-slate-100" style={{ background: accent + "0f" }}>
        <Icon size={15} style={{ color: accent }} />
        <span className="text-sm font-semibold text-slate-700">{title}</span>
        <span className="ml-auto text-xs font-bold rounded-full px-2 py-0.5 tabular-nums" style={{ background: accent + "1f", color: accent }}>{tasks.length}</span>
      </div>
      <div className="p-1.5 min-h-[52px]">
        {tasks.length === 0 ? <div className="text-[12px] text-slate-400 px-2.5 py-3 text-center">{empty}</div> : tasks.map((t) => <MiniTask key={t.id} t={t} />)}
      </div>
    </div>
  );
}

function Panel({ icon: Icon, title, children, action }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={15} className="text-slate-500" />
        <h3 className="text-[11px] uppercase tracking-[0.16em] font-bold text-slate-500 flex-1">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
