// ============================================================================
//  storage.js — makes the dashboard work OUTSIDE Claude
// ----------------------------------------------------------------------------
//  Claude's published artifacts provide a global `window.storage` API that the
//  dashboard uses to save tick-offs. That API ONLY exists inside Claude.
//  When you host this app anywhere else, `window.storage` is undefined and the
//  save calls would fail. This file installs a drop-in replacement so the app
//  runs unchanged.
//
//  DEFAULT  -> localStorage : saves PER BROWSER / PER DEVICE (NOT shared).
//  SHARED   -> Supabase     : everyone sees the same board (see bottom).
// ============================================================================

// ============================================================================
//  storage.js — shared sync via Supabase
//  All four teammates see the same board. No accounts needed to view.
// ============================================================================

const SUPABASE_URL = "https://vdjdkrqwaqawmsxhshok.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_1ZctFvAii716LzmmX-bnZQ_hX1LqY09";

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
  "Prefer": "resolution=merge-duplicates",
};

const supabaseImpl = {
  async get(key) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/board?id=eq.${encodeURIComponent(key)}&select=data&limit=1`,
        { headers }
      );
      if (!res.ok) return null;
      const rows = await res.json();
      if (!rows || rows.length === 0) return null;
      return { key, value: JSON.stringify(rows[0].data), shared: true };
    } catch (e) {
      return null;
    }
  },

  async set(key, value) {
    try {
      const parsed = JSON.parse(value);
      const res = await fetch(`${SUPABASE_URL}/rest/v1/board`, {
        method: "POST",
        headers,
        body: JSON.stringify({ id: key, data: parsed }),
      });
      if (!res.ok) return null;
      return { key, value, shared: true };
    } catch (e) {
      return null;
    }
  },

  async delete(key) {
    try {
      await fetch(
        `${SUPABASE_URL}/rest/v1/board?id=eq.${encodeURIComponent(key)}`,
        { method: "DELETE", headers }
      );
      return { key, deleted: true, shared: true };
    } catch (e) {
      return null;
    }
  },

  async list() {
    return { keys: [], shared: true };
  },
};

// Install as window.storage so the dashboard code needs zero changes.
// Only installs if Claude's own storage isn't already present (safe to paste
// back into Claude if needed).
if (typeof window !== "undefined" && !window.storage) {
  window.storage = supabaseImpl;
}

export default supabaseImpl;

// ============================================================================
//  OPTIONAL: shared sync with Supabase (everyone sees the same board)
// ----------------------------------------------------------------------------
//  1.  npm install @supabase/supabase-js
//  2.  In Supabase, create a table `board` with columns:
//          id    text   (primary key)
//          data  jsonb
//  3.  Paste your project URL + anon key below.
//  4.  DELETE the `if (... !window.storage)` block above, and replace the
//      `export default` line above with `export default supabaseImpl;`
//
//  import { createClient } from "@supabase/supabase-js";
//  const supabase = createClient("https://YOUR-PROJECT.supabase.co", "YOUR-ANON-KEY");
//
//  const supabaseImpl = {
//    async get(key) {
//      const { data } = await supabase.from("board").select("data").eq("id", key).maybeSingle();
//      return data ? { key, value: JSON.stringify(data.data), shared: true } : null;
//    },
//    async set(key, value) {
//      await supabase.from("board").upsert({ id: key, data: JSON.parse(value) });
//      return { key, value, shared: true };
//    },
//    async delete(key) {
//      await supabase.from("board").delete().eq("id", key);
//      return { key, deleted: true, shared: true };
//    },
//    async list() { return { keys: [], shared: true }; },
//  };
//
//  TIP: for LIVE updates (a teammate's tick appears on your screen instantly),
//  subscribe to Supabase Realtime on the `board` table and re-read on change.
// ============================================================================
