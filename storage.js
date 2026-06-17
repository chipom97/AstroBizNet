// AstroBizNet — shared sync via Supabase
// All four teammates see the same board. No accounts needed to view.

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

if (typeof window !== "undefined" && !window.storage) {
  window.storage = supabaseImpl;
}

export default supabaseImpl;
