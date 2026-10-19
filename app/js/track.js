/*
 * IRO – track.js : Tracker object (controls track.html).
 * Shows only non-identifying details so a leaked ticket ID reveals nothing personal.
 */

const Tracker = {
  el: id => document.getElementById(id),

  init() {
    this.el("trackForm").addEventListener("submit", e => {
      e.preventDefault();
      this.show(this.el("ticketInput").value);
    });

    // Allow links such as track.html?id=IRO-26-4F7K2
    const id = new URLSearchParams(location.search).get("id");
    if (id) {
      this.el("ticketInput").value = id;
      this.show(id);
    }
  },

  show(id) {
    const issue = IssueStore.findById(id);
    this.el("resultCard").classList.toggle("hidden", !issue);
    this.el("trackError").textContent = issue ? "" : "No report found with that ticket ID. Check it and try again.";
    if (!issue) return;

    this.el("resTitle").textContent = issue.title;
    this.el("resMeta").textContent =
      `${issue.id} · ${issue.category} · ${issue.severity} severity · reported ${formatDate(issue.createdAt)}`;
    this.el("resStatus").innerHTML = statusBadge(issue.status);
    this.el("resHistory").innerHTML = issue.history.map(h => `
      <li>
        ${statusBadge(h.status)}
        <small>${formatDate(h.at)}</small>
        ${h.note ? `<div>${escapeHtml(h.note)}</div>` : ""}
      </li>`).join("");
  }
};

Tracker.init();
