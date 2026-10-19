"""Builds the print packs for physical submission.

docs/IRO_Submission.pdf       – 5-page pack (condensed SRS, both diagrams, object
                                listing, IssueStore code listing), from
                                docs/IRO_Submission_5page.html.
docs/IRO_Submission_Full.pdf  – full pack: cover & contents, full SRS, Use-Case
                                diagram, Ishikawa diagram, Object listing, Code listing.

Run from the repository root:  python3 docs/build_submission.py
Needs Chromium/Chrome and pdfunite (poppler-utils).
"""
import html
import pathlib
import re
import shutil
import subprocess
import tempfile

ROOT = pathlib.Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
BROWSER = next(filter(None, map(shutil.which, ["chromium", "google-chrome", "chrome"])))

STUDENT = "Joshua Omolafe"
MATRIC = "220404244"
GITHUB = "github.com/Joshua989/Weekend-3-01-07-26-"

BASE_CSS = """
body { font-family: "Times New Roman", Times, serif; font-size: 10pt; color: #000; margin: 0; }
h1 { font-size: 18pt; margin: 0 0 6pt; }
h2 { font-size: 13pt; margin: 0 0 8pt; }
"""


def to_pdf(html_path, pdf_path):
    subprocess.run([BROWSER, "--headless", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer",
                    f"--print-to-pdf={pdf_path}", html_path.as_uri()],
                   check=True, stderr=subprocess.DEVNULL)


def pages(pdf_path):
    info = subprocess.run(["pdfinfo", str(pdf_path)], capture_output=True, text=True, check=True).stdout
    return int(re.search(r"Pages:\s+(\d+)", info).group(1))


def diagram_page(tmp, name, title, image, caption):
    """One landscape A4 page holding a diagram."""
    html = tmp / f"{name}.html"
    html.write_text(f"""<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@page {{ size: A4 landscape; margin: 12mm; }}
{BASE_CSS}
.wrap {{ height: 180mm; display: flex; flex-direction: column; }}
img {{ flex: 1; min-height: 0; object-fit: contain; width: 100%; }}
p {{ text-align: center; font-style: italic; margin: 4pt 0 0; }}
</style></head><body><div class="wrap">
<h2>{title}</h2><img src="{image.as_uri()}"><p>{caption}</p>
</div></body></html>""", encoding="utf-8")
    pdf = tmp / f"{name}.pdf"
    to_pdf(html, pdf)
    return pdf


def cover(tmp, sections):
    rows, page = [], 2  # page 1 is the cover itself
    for title, pdf in sections:
        n = pages(pdf)
        rows.append(f"<tr><td>{title}</td><td class='p'>{page}–{page + n - 1}</td></tr>" if n > 1
                    else f"<tr><td>{title}</td><td class='p'>{page}</td></tr>")
        page += n
    html = tmp / "cover.html"
    html.write_text(f"""<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
@page {{ size: A4; margin: 25mm 22mm; }}
{BASE_CSS}
.c {{ text-align: center; }}
.top {{ margin-top: 30mm; }}
table {{ border-collapse: collapse; width: 100%; margin-top: 8pt; }}
td, th {{ border: 1px solid #000; padding: 4pt 6pt; font-size: 10pt; text-align: left; }}
th {{ background: #e6e6e6; }}
td.p {{ width: 22%; text-align: center; }}
.details td:first-child {{ width: 30%; font-weight: bold; }}
</style></head><body>
<div class="c top">
  <p>ADEKUNLE AJASIN UNIVERSITY, AKUNGBA-AKOKO<br>DEPARTMENT OF COMPUTER SCIENCE</p>
  <p style="margin-top:14pt">CSC426 – WEEKLY DEV, WEEKEND 3 (01/07/26)</p>
  <h1 style="margin-top:20pt">IRO – ISSUES REPORTING OUTLET</h1>
  <p>A web-based system for relating and reporting issues concerning<br>
     AAUA students and indigenes of Akungba, Iwaro, Etioro, Ayegunle and environs</p>
</div>
<table class="details" style="margin-top:22pt">
  <tr><td>Name</td><td>{STUDENT}</td></tr>
  <tr><td>Matric No.</td><td>{MATRIC}</td></tr>
  <tr><td>Course lecturer</td><td>Dr. O. O. Ajayi</td></tr>
  <tr><td>GitHub repository</td><td>{GITHUB}</td></tr>
</table>
<h2 style="margin-top:22pt">Contents</h2>
<table><tr><th>Document</th><th>Page</th></tr>{''.join(rows)}</table>
</body></html>""", encoding="utf-8")
    pdf = tmp / "cover.pdf"
    to_pdf(html, pdf)
    return pdf


def main():
    with tempfile.TemporaryDirectory() as t:
        tmp = pathlib.Path(t)
        sections = [
            ("1. Software Requirements Specification (SRS)", DOCS / "srs" / "IRO_SRS.pdf"),
            ("2. Use-Case Diagram", diagram_page(tmp, "usecase", "2. IRO Use-Case Diagram",
                                                  DOCS / "use-case" / "IRO_UseCase.png",
                                                  "Source: docs/use-case/IRO_UseCase.drawio")),
            ("3. Ishikawa (Fishbone) Problem Analysis", diagram_page(tmp, "ishikawa", "3. IRO Ishikawa (Fishbone) Problem Analysis",
                                                                     DOCS / "ishikawa" / "IRO_Ishikawa.png",
                                                                     "Source: docs/ishikawa/IRO_Ishikawa.drawio")),
            ("4. Object Listing", DOCS / "listings" / "IRO_Object_Listing.pdf"),
            ("5. Code Listing", DOCS / "listings" / "IRO_Code_Listing.pdf"),
        ]
        out = DOCS / "IRO_Submission_Full.pdf"
        subprocess.run(["pdfunite", str(cover(tmp, sections)), *[str(p) for _, p in sections], str(out)], check=True)
        print("wrote", out.relative_to(ROOT), f"({pages(out)} pages)")
    short_pack()


def short_pack():
    """Fill the 5-page template with the IssueStore source and print it."""
    src = (ROOT / "app" / "js" / "store.js").read_text(encoding="utf-8").split("\n")
    start = next(i for i, l in enumerate(src) if l.startswith("const IssueStore"))
    end = next(i for i in range(start, len(src)) if src[i] == "};")
    rows = "".join(f"<tr><td class='n'>{i + 1}</td><td>{html.escape(src[i]) or ' '}</td></tr>"
                   for i in range(start, end + 1))
    template = (DOCS / "IRO_Submission_5page.html").read_text(encoding="utf-8")
    filled = DOCS / "_submission_build.html"  # next to the template so image paths resolve
    filled.write_text(template.replace("<!--CODE_LISTING-->", f"<table class='code'>{rows}</table>"), encoding="utf-8")
    out = DOCS / "IRO_Submission.pdf"
    try:
        to_pdf(filled, out)
    finally:
        filled.unlink()
    print("wrote", out.relative_to(ROOT), f"({pages(out)} pages)")


if __name__ == "__main__":
    main()
