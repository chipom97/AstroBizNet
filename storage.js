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

const PREFIX = "astrobiznet::";

// ---- localStorage implementation (default, no setup, per-device) -----------
const localStorageImpl = {
  async get(key, shared = false) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw === null ? null : { key, value: raw, shared };
    } catch (e) {
      return null;
    }
  },
  async set(key, value, shared = false) {
    localStorage.setItem(PREFIX + key, value);
    return { key, value, shared };
  },
  async delete(key, shared = false) {
    localStorage.removeItem(PREFIX + key);
    return { key, deleted: true, shared };
  },
  async list(prefix = "", shared = false) {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX + prefix)) keys.push(k.slice(PREFIX.length));
    }
    return { keys, prefix, shared };
  },
};

// Install the shim ONLY if the real Claude storage isn't already present,
// so this same code still works if you ever paste it back into Claude.
if (typeof window !== "undefined" && !window.storage) {
  window.storage = localStorageImpl;
}

export default (typeof window !== "undefined" ? window.storage : localStorageImpl);

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
