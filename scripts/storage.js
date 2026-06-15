/* =============================================================
   Safe storage wrapper
   -------------------------------------------------------------
   localStorage can be unavailable (private mode, blocked cookies,
   embedded iframes). Every call is wrapped so the simulation never
   crashes if storage is missing — it just falls back to memory.
   ============================================================= */

const Storage = (function () {
  const KEY = 'bsc-201-m1-l2-state';
  let available = false;
  const memory = {}; // fallback when localStorage is blocked

  try {
    const t = '__bsc_test__';
    window.localStorage.setItem(t, '1');
    window.localStorage.removeItem(t);
    available = true;
  } catch (e) {
    available = false;
  }

  return {
    isAvailable() { return available; },

    save(state) {
      try {
        const json = JSON.stringify(state);
        if (available) window.localStorage.setItem(KEY, json);
        else memory[KEY] = json;
        return true;
      } catch (e) {
        return false;
      }
    },

    load() {
      try {
        const json = available ? window.localStorage.getItem(KEY) : memory[KEY];
        if (!json) return null;
        return JSON.parse(json);
      } catch (e) {
        return null;
      }
    },

    clear() {
      try {
        if (available) window.localStorage.removeItem(KEY);
        else delete memory[KEY];
        return true;
      } catch (e) {
        return false;
      }
    }
  };
})();
