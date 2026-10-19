/*
 * IRO – report.js : ReportForm object (controls report.html).
 */

const ReportForm = {
  form: document.getElementById("reportForm"),
  el: id => document.getElementById(id),

  init() {
    fillSelect(this.el("category"), IRO.CATEGORIES, "-- Select category --");
    fillSelect(this.el("severity"), IRO.SEVERITIES, "-- Select severity --");
    fillSelect(this.el("community"), IRO.COMMUNITIES, "-- Select community --");
    this.el("incidentDate").max = new Date().toISOString().slice(0, 10);

    this.el("reporterType").addEventListener("change", () => this.toggleReporterFields());
    this.el("anonymous").addEventListener("change", () => this.toggleIdentity());
    this.form.addEventListener("submit", e => this.submit(e));
  },

  /** Students may give a matric number; indigenes pick their community. */
  toggleReporterFields() {
    const type = this.el("reporterType").value;
    this.el("matricGroup").classList.toggle("hidden", type !== "Student");
    this.el("communityGroup").classList.toggle("hidden", type !== "Indigene");
  },

  toggleIdentity() {
    this.el("identityGroup").classList.toggle("hidden", this.el("anonymous").checked);
  },

  /** Read all fields into a plain object. */
  collect() {
    return {
      reporterType: this.el("reporterType").value,
      matricNo: this.el("matricNo").value,
      community: this.el("community").value,
      anonymous: this.el("anonymous").checked,
      name: this.el("name").value,
      contact: this.el("contact").value,
      category: this.el("category").value,
      severity: this.el("severity").value,
      location: this.el("location").value,
      incidentDate: this.el("incidentDate").value,
      title: this.el("title").value,
      description: this.el("description").value
    };
  },

  /** Return an error message, or "" when the data is valid. */
  validate(d) {
    if (!d.reporterType) return "Please tell us whether you are a student or an indigene.";
    if (d.reporterType === "Indigene" && !d.community) return "Please select your community.";
    if (!d.category) return "Please choose a category.";
    if (!d.severity) return "Please choose a severity.";
    if (!d.location.trim()) return "Please enter where the issue happened.";
    if (!d.incidentDate) return "Please enter the date of the incident.";
    if (d.incidentDate > new Date().toISOString().slice(0, 10)) return "The incident date cannot be in the future.";
    if (d.title.trim().length < 5) return "Please give a short title (at least 5 characters).";
    if (d.description.trim().length < 20) return "Please describe the issue in at least 20 characters.";
    if (!d.anonymous && d.contact.trim() && !/^(\+?\d{10,14}|[^@\s]+@[^@\s]+\.[^@\s]+)$/.test(d.contact.trim()))
      return "Contact must be a valid phone number or email address.";
    return "";
  },

  submit(e) {
    e.preventDefault();
    const data = this.collect();
    const error = this.validate(data);
    this.el("formError").textContent = error;
    if (error) return;

    const issue = IssueStore.create(data);
    this.el("ticketId").textContent = issue.id;
    this.el("trackLink").href = "track.html?id=" + encodeURIComponent(issue.id);
    this.el("formCard").classList.add("hidden");
    this.el("successCard").classList.remove("hidden");
    window.scrollTo(0, 0);
  }
};

ReportForm.init();
