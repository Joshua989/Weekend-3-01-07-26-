# IRO – Issues Reporting Outlet

**CSC426 Weekly Dev – Weekend 3 (01/07/26)** · Course lecturer: Dr. O. O. Ajayi

IRO is a web-based outlet where **AAUA students** and **indigenes of Akungba, Iwaro, Etioro, Ayegunle** and neighbouring communities can report issues that affect them, anonymously if they wish, and track each report with a ticket ID until it is resolved. An IRO desk officer reviews, escalates and resolves the reports.

## Deliverables

| Task | Deliverable | Location |
|------|-------------|----------|
| a. Questionnaire (Google Form) | Question design with student/indigene branching, plus an Apps Script that builds the form | [docs/questionnaire/](docs/questionnaire/) |
| b. Ishikawa analysis (draw.io) | Fishbone diagram of the problem | [docs/ishikawa/IRO_Ishikawa.drawio](docs/ishikawa/IRO_Ishikawa.drawio) · [PNG](docs/ishikawa/IRO_Ishikawa.png) |
| c. Mini web interface | HTML/CSS/JavaScript app | [app/](app/) |
| d. Use-case diagram | Actors and use cases | [docs/use-case/IRO_UseCase.drawio](docs/use-case/IRO_UseCase.drawio) · [PNG](docs/use-case/IRO_UseCase.png) |
| e. SRS | Functional and non-functional requirements, component interactions | [docs/srs/IRO_SRS.pdf](docs/srs/IRO_SRS.pdf) · [DOCX](docs/srs/IRO_SRS.docx) |
| j. Print pack | Object listing and code listing (10pt) | [docs/listings/](docs/listings/) |
| **Submission (5 pages)** | **PDF to print: condensed SRS, use-case and Ishikawa diagrams, object listing, IssueStore code listing** | [**docs/IRO_Submission.pdf**](docs/IRO_Submission.pdf) |
| Full pack (34 pages) | Cover, full SRS, both diagrams, full object and code listings | [docs/IRO_Submission_Full.pdf](docs/IRO_Submission_Full.pdf) |

`.drawio` files open at [app.diagrams.net](https://app.diagrams.net) (File → Open from → Device).

## Running the app

No installation is needed. Open `app/index.html` in a browser, or enable GitHub Pages on this repository and visit `/app/`.

| Page | What it does |
|------|--------------|
| **Home** | Explains IRO, the reporting steps and the issue categories |
| **Report an Issue** | Form with student/indigene-specific fields and an anonymous option; returns a ticket ID such as `IRO-26-4F7K2` |
| **Track Report** | Enter the ticket ID to see the status and the history of updates |
| **Admin** | Desk-officer dashboard (demo passcode `iro2026`) with statistics, search and filters, status updates, escalation and deletion |

Reports are stored in the browser's `localStorage`, so this mini version keeps data on the device where it was entered. All data access goes through `IssueStore` in [app/js/store.js](app/js/store.js), so a server database can replace it later without changing the pages.

## Project structure

```
app/
  index.html  report.html  track.html  admin.html
  css/style.css
  js/store.js   – IRO config + IssueStore data layer + helpers
  js/report.js  – ReportForm controller
  js/track.js   – Tracker controller
  js/admin.js   – AdminDesk controller
docs/
  questionnaire/  IRO_Questionnaire.md, createForm.gs
  ishikawa/       IRO_Ishikawa.drawio / .svg / .png
  use-case/       IRO_UseCase.drawio / .svg / .png
  srs/            IRO_SRS.html / .pdf / .docx
  listings/       IRO_Object_Listing.*, IRO_Code_Listing.*, build_listings.py
```

After changing the code or documents, rebuild the listings and both submission PDFs:

```
python3 docs/listings/build_listings.py
python3 docs/build_submission.py
```
