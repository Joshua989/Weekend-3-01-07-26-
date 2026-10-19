"""Builds the printable (10pt) code listing and exports both listings to PDF.

Run from the repository root:  python3 docs/listings/build_listings.py
Needs Chromium or Google Chrome for the PDF export.
"""
import html
import pathlib
import shutil
import subprocess

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "listings"
FILES = [
    "app/index.html", "app/report.html", "app/track.html", "app/admin.html",
    "app/css/style.css", "app/js/store.js", "app/js/report.js",
    "app/js/track.js", "app/js/admin.js",
]

STYLE = """
@page { size: A4; margin: 15mm; }
body { font-family: "Times New Roman", serif; font-size: 10pt; }
h1 { font-size: 14pt; text-align: center; }
h2 { font-size: 11pt; border-bottom: 1px solid #000; margin-top: 16pt; page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; font-family: "Courier New", monospace; font-size: 10pt; }
td { padding: 0 4pt; vertical-align: top; white-space: pre-wrap; word-break: break-all; }
td.n { width: 3em; text-align: right; color: #555; border-right: 1px solid #999; user-select: none; }
"""


def code_listing():
    parts = [f"<!DOCTYPE html><html><head><meta charset='UTF-8'><title>IRO – Code Listing</title>"
             f"<style>{STYLE}</style></head><body>",
             "<h1>IRO – Issues Reporting Outlet: Code Listing</h1>",
             "<p style='text-align:center'>CSC426 Weekly Dev – Weekend 3 · Joshua Omolafe · Matric No. 220404244</p>"]
    for rel in FILES:
        lines = (ROOT / rel).read_text(encoding="utf-8").rstrip("\n").split("\n")
        parts.append(f"<h2>{html.escape(rel)} ({len(lines)} lines)</h2><table>")
        parts += [f"<tr><td class='n'>{i}</td><td>{html.escape(l) or ' '}</td></tr>"
                  for i, l in enumerate(lines, 1)]
        parts.append("</table>")
    parts.append("</body></html>")
    path = OUT / "IRO_Code_Listing.html"
    path.write_text("\n".join(parts), encoding="utf-8")
    return path


def to_pdf(src):
    browser = next(filter(None, map(shutil.which, ["chromium", "google-chrome", "chrome"])), None)
    if not browser:
        print("Chromium/Chrome not found – open", src.name, "in a browser and print to PDF.")
        return
    subprocess.run([browser, "--headless", "--disable-gpu", "--no-sandbox", "--no-pdf-header-footer",
                    f"--print-to-pdf={src.with_suffix('.pdf')}", src.as_uri()],
                   check=True, stderr=subprocess.DEVNULL)
    print("wrote", src.with_suffix(".pdf").relative_to(ROOT))


if __name__ == "__main__":
    to_pdf(code_listing())
    to_pdf(OUT / "IRO_Object_Listing.html")
