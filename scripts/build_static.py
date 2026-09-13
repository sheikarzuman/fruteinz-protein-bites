"""
Pre-renders the single Flask route to static HTML for GitHub Pages hosting.

The site has no server-side dynamic behaviour at request time (no forms, no
database, no per-user state) — Flask just renders one template from fixed
data — so it can be published as a plain static site. This script renders
index.html exactly as the live Flask route would, rewrites the emitted
`/static/...` asset paths to relative `static/...` paths (so it works when
served from a GitHub Pages *project* subpath rather than the domain root),
and copies the static/ directory alongside it under docs/.

Run once from the project root, whenever templates/CSS/JS/images change:
    source venv/bin/activate && python scripts/build_static.py
"""

import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"

# Running as `python scripts/build_static.py` puts scripts/ (not the project
# root) on sys.path, so app.py wouldn't otherwise be importable.
sys.path.insert(0, str(ROOT))

from app import app  # noqa: E402


def main() -> None:
    with app.test_request_context("/"):
        html = app.view_functions["index"]()

    # url_for('static', ...) always emits root-absolute "/static/..." paths
    # — both in HTML attributes (src="/static/...") and inside the embedded
    # flavourData JSON blob ("image": "/static/..."). A GitHub Pages
    # *project* site is served from a subpath
    # (https://<user>.github.io/<repo>/), so root-absolute paths would
    # resolve to the wrong place. Relative paths work from any subpath.
    html = html.replace('"/static/', '"static/')

    if DOCS.exists():
        shutil.rmtree(DOCS)
    DOCS.mkdir(parents=True)

    (DOCS / "index.html").write_text(html, encoding="utf-8")
    shutil.copytree(ROOT / "static", DOCS / "static")

    # GitHub Pages otherwise runs Jekyll, which ignores files/folders
    # starting with "_" and can mangle a plain static site.
    (DOCS / ".nojekyll").touch()

    print(f"Wrote static site to {DOCS}")


if __name__ == "__main__":
    main()
