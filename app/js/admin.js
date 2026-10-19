/*
 * IRO – admin.js : AdminDesk object (controls admin.html).
 * Lets the IRO desk officer view, filter and update reports.
 */

const AdminDesk = {
  SESSION_KEY: "iro_admin",
  selectedId: null,
  el: id => document.getElementById(id),

  init() {
    fillSelect(this.el("filterStatus"), IRO.STATUSES, "All statuses");
    fillSelect(this.el("filterCategory"), IRO.CATEGORIES, "All categories");
    fillSelect(this.el("newStatus"), IRO.STATUSES);

    this.el("loginForm").addEventListener("submit", e => this.login(e));
    this.el("logoutBtn").addEventListener("click", () => this.logout());
    ["search", "filterStatus", "filterCategory", "filterReporter"].forEach(id =>
      this.el(id).addEventListener("input", () => this.render()));
    this.el("issueRows").addEventListener("click", e => {
      const btn = e.target.closest("button[data-id]");
      if (btn) this.openDetail(btn.dataset.id);
    });
    this.el("updateForm").addEventListener("submit", e => this.saveUpdate(e));
    this.el("deleteBtn").addEventListener("click", () => this.deleteSelected());

    if (sessionStorage.getItem(this.SESSION_KEY) === "1") this.showDashboard();
  },

  login(e) {
    e.preventDefault();
    if (this.el("passcode").value === IRO.ADMIN_PASSCODE) {
      sessionStorage.setItem(this.SESSION_KEY, "1");
      this.showDashboard();
    } else {
      this.el("loginError").textContent = "Incorrect passcode.";
    }
  },

  logout() {
    sessionStorage.removeItem(this.SESSION_KEY);
    location.reload();
  },

  showDashboard() {
    this.el("loginCard").classList.add("hidden");
    this.el("dashboard").classList.remove("hidden");
    this.render();
  },

  /** Issues that match the search box and the three filters. */
  filtered() {
    const q = this.el("search").value.trim().toLowerCase();
    const st = this.el("filterStatus").value;
    const cat = this.el("filterCategory").value;
    const rep = this.el("filterReporter").value;
    return IssueStore.getAll().filter(i =>
      (!st || i.status === st) &&
      (!cat || i.category === cat) &&
      (!rep || i.reporterType === rep) &&
      (!q || [i.id, i.title, i.location].some(f => f.toLowerCase().includes(q))));
  },

  render() {
    const s = IssueStore.stats();
    this.el("statTotal").textContent = s.total;
    this.el("statOpen").textContent = s.open;
    this.el("statEmergency").textContent = s.emergency;
    this.el("statResolved").textContent = s.byStatus["Resolved"];

    const rows = this.filtered();
    this.el("emptyMsg").classList.toggle("hidden", rows.length > 0);
    this.el("issueRows").innerHTML = rows.map(i => `
      <tr>
        <td><code>${i.id}</code><br><small>${formatDate(i.createdAt)}</small></td>
        <td><strong>${escapeHtml(i.title)}</strong><br><small>${escapeHtml(i.category)} · ${escapeHtml(i.location)}</small></td>
        <td>${i.reporterType}${i.community ? " (" + escapeHtml(i.community) + ")" : ""}</td>
        <td>${i.severity}</td>
        <td>${statusBadge(i.status)}</td>
        <td><button class="btn small secondary" data-id="${i.id}">Open</button></td>
      </tr>`).join("");
  },

  openDetail(id) {
    const i = IssueStore.findById(id);
    if (!i) return;
    this.selectedId = id;
    this.el("dTitle").textContent = `${i.id} – ${i.title}`;
    this.el("dMeta").textContent =
      `${i.category} · ${i.severity} · ${i.location} · incident on ${i.incidentDate}`;
    this.el("dReporter").textContent = i.anonymous
      ? `Reporter: Anonymous ${i.reporterType}`
      : `Reporter: ${i.name || "(no name)"} · ${i.contact || "(no contact)"} · ${i.reporterType}` +
        (i.matricNo ? ` · Matric ${i.matricNo}` : "") + (i.community ? ` · ${i.community}` : "");
    this.el("dDesc").textContent = i.description;
    this.el("dHistory").innerHTML = i.history.map(h =>
      `<li>${statusBadge(h.status)} <small>${formatDate(h.at)}</small>${h.note ? `<div>${escapeHtml(h.note)}</div>` : ""}</li>`
    ).join("");
    this.el("newStatus").value = i.status;
    this.el("note").value = "";
    this.el("detailCard").classList.remove("hidden");
    this.el("detailCard").scrollIntoView({ behavior: "smooth" });
  },

  saveUpdate(e) {
    e.preventDefault();
    if (!this.selectedId) return;
    IssueStore.updateStatus(this.selectedId, this.el("newStatus").value, this.el("note").value.trim());
    this.render();
    this.openDetail(this.selectedId);
  },

  deleteSelected() {
    if (!this.selectedId || !confirm("Delete this report permanently?")) return;
    IssueStore.remove(this.selectedId);
    this.selectedId = null;
    this.el("detailCard").classList.add("hidden");
    this.render();
  }
};

AdminDesk.init();
