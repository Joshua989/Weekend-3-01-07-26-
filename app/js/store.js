/*
 * IRO – Issues Reporting Outlet
 * store.js : data layer (IssueStore object).
 *
 * The mini version keeps all reports in the browser's localStorage so the
 * app runs with no server. Every other script talks to data ONLY through
 * IssueStore, so swapping localStorage for a real backend API later only
 * means rewriting this file.
 */

const IRO = {
  STORAGE_KEY: "iro_issues",
  ADMIN_PASSCODE: "iro2026", // demo only – a real deployment authenticates on a server

  CATEGORIES: [
    "Security / Safety",
    "Accommodation & Rent",
    "Land & Property",
    "Harassment / Assault",
    "Cultural & Festival Conflicts",
    "Sanitation & Environment",
    "Water, Power & Utilities",
    "Transport & Okada",
    "Market & Pricing",
    "Other"
  ],

  COMMUNITIES: ["Akungba", "Iwaro", "Etioro", "Ayegunle", "Oke-Oka", "Other"],

  STATUSES: ["Submitted", "Under Review", "Escalated", "Resolved", "Closed"],

  SEVERITIES: ["Low", "Medium", "High", "Emergency"]
};

const IssueStore = {
  /** Return every saved issue (newest first). */
  getAll() {
    try {
      const raw = localStorage.getItem(IRO.STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch (e) {
      return [];
    }
  },

  /** Persist the full list. */
  saveAll(list) {
    localStorage.setItem(IRO.STORAGE_KEY, JSON.stringify(list));
  },

  /** Create a unique, human-friendly ticket ID such as IRO-26-4F7K2. */
  generateId() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid confusion
    const year = String(new Date().getFullYear()).slice(-2);
    let id;
    do {
      let code = "";
      for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
      id = `IRO-${year}-${code}`;
    } while (this.findById(id));
    return id;
  },

  /** Add a new issue and return it. */
  create(data) {
    const now = new Date().toISOString();
    const issue = {
      id: this.generateId(),
      reporterType: data.reporterType,          // "Student" | "Indigene" | "Other"
      anonymous: !!data.anonymous,
      name: data.anonymous ? "" : data.name.trim(),
      contact: data.anonymous ? "" : data.contact.trim(),
      matricNo: data.matricNo ? data.matricNo.trim() : "",
      community: data.community || "",
      category: data.category,
      severity: data.severity,
      location: data.location.trim(),
      incidentDate: data.incidentDate,
      title: data.title.trim(),
      description: data.description.trim(),
      status: "Submitted",
      createdAt: now,
      history: [{ status: "Submitted", note: "Report received by IRO.", at: now }]
    };
    const list = this.getAll();
    list.push(issue);
    this.saveAll(list);
    return issue;
  },

  /** Find one issue by its ticket ID (case-insensitive). */
  findById(id) {
    if (!id) return null;
    const key = id.trim().toUpperCase();
    return this.getAll().find(i => i.id === key) || null;
  },

  /** Change an issue's status and log the change in its history. */
  updateStatus(id, status, note) {
    const list = this.getAll();
    const issue = list.find(i => i.id === id);
    if (!issue) return null;
    issue.status = status;
    issue.history.push({ status, note: note || "", at: new Date().toISOString() });
    this.saveAll(list);
    return issue;
  },

  /** Remove an issue permanently (admin only). */
  remove(id) {
    this.saveAll(this.getAll().filter(i => i.id !== id));
  },

  /** Counts used by the admin dashboard. */
  stats() {
    const list = this.getAll();
    const byStatus = {};
    IRO.STATUSES.forEach(s => (byStatus[s] = 0));
    list.forEach(i => byStatus[i.status]++);
    return {
      total: list.length,
      open: list.length - byStatus["Resolved"] - byStatus["Closed"],
      emergency: list.filter(i => i.severity === "Emergency" && i.status !== "Closed").length,
      byStatus
    };
  }
};

/* ---------- Small helpers shared by every page ---------- */

/** Escape text before inserting it into HTML (prevents script injection). */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

/** Format an ISO date for display, e.g. 7 Jul 2026, 14:05. */
function formatDate(iso) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
  });
}

/** Status badge markup; CSS class uses a hyphen in place of spaces. */
function statusBadge(status) {
  return `<span class="badge ${status.replace(/\s/g, "-")}">${escapeHtml(status)}</span>`;
}

/** Fill a <select> element with a list of options. */
function fillSelect(select, items, placeholder) {
  select.innerHTML = placeholder ? `<option value="">${placeholder}</option>` : "";
  items.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}
