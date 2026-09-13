"""
Fruteinz Protein Bites — marketing concept website.

A single-page Flask app that serves the scroll-driven brand story built for
the Fundamentals of Marketing Task 6 creative deliverable.
"""

import os

from flask import Flask, Response, render_template, url_for

app = Flask(__name__)


@app.after_request
def add_security_headers(response: Response) -> Response:
    """Baseline hardening headers for a public static/content site."""
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    return response


# Single source of truth for the five flavours. Keeping this data-driven
# (rather than duplicated across the template) means the Jinja markup, the
# quiz result copy, and the flavour selector all read from the same list.
FLAVOUR_DEFS = [
    {
        "key": "guava",
        "name": "Guava",
        "color": "#E85A8C",
        "tagline": "Meet the Guava bite.",
        "description": "A bright, fruity favourite with a playful pink personality.",
        "vibe": "Bright, fruity and easy to love.",
    },
    {
        "key": "jackfruit",
        "name": "Jackfruit",
        "color": "#F2A93B",
        "tagline": "Meet the Jackfruit bite.",
        "description": "A warm, golden flavour that stands out from the usual snack aisle.",
        "vibe": "Warm, golden and a little different.",
    },
    {
        "key": "avocado",
        "name": "Avocado",
        "color": "#8BAE46",
        "tagline": "Meet the Avocado bite.",
        "description": "A smooth, green take on protein snacking — a little unexpected, in a good way.",
        "vibe": "Smooth, green and a little unexpected.",
    },
    {
        "key": "blackberry",
        "name": "Blackberry",
        "color": "#7A4B8C",
        "tagline": "Meet the Blackberry bite.",
        "description": "A deep, bold flavour for snackers who like something different.",
        "vibe": "Deep, bold and a little adventurous.",
    },
    {
        "key": "raspberry",
        "name": "Raspberry",
        "color": "#D9455F",
        "tagline": "Meet the Raspberry bite.",
        "description": "A vibrant, tangy pick that's hard to put down.",
        "vibe": "Vibrant, tangy and full of energy.",
    },
]

BENEFIT_ICONS = [
    {"file": "icon-protein.png", "alt": "High protein icon — 20g protein per pack"},
    {"file": "icon-fruit-flavours.png", "alt": "Natural fruit flavours icon"},
    {"file": "icon-honey.png", "alt": "Made with real honey icon"},
    {"file": "icon-soy.png", "alt": "Plant-based soy protein icon"},
    {"file": "icon-no-artificial.png", "alt": "No artificial colours or preservatives icon"},
]

INGREDIENT_CHIPS = ["Soy", "Whey", "Honey", "Natural fruit flavours", "No artificial colours or preservatives"]

INSIGHTS = [
    {
        "title": "Protein matters.",
        "body": (
            "In our survey, protein content emerged as the single strongest "
            "attribute snackers look for in a protein snack."
        ),
    },
    {
        "title": "Clean label matters.",
        "body": (
            "About 86% of respondents rated “no artificial additives, "
            "preservatives or added sugar” a 4 or 5 out of 5 in importance."
        ),
    },
    {
        "title": "Taste can’t be an afterthought.",
        "body": (
            "Our in-depth interviews flagged bitterness and taste as a "
            "recurring frustration with existing protein snacks."
        ),
    },
    {
        "title": "Convenience matters.",
        "body": (
            "Snackers told us they want protein that fits into busy moments — "
            "exactly what a bite-sized, grab-and-go format is for."
        ),
    },
]


def build_flavours() -> list[dict]:
    """Attach the static image URL to each flavour so Jinja and the quiz
    JavaScript both read image paths from one place."""
    flavours = []
    for f in FLAVOUR_DEFS:
        item = dict(f)
        item["image"] = url_for("static", filename=f"images/pack-{f['key']}.jpg")
        flavours.append(item)
    return flavours


@app.route("/")
def index() -> str:
    flavours = build_flavours()
    return render_template(
        "index.html",
        flavours=flavours,
        benefit_icons=BENEFIT_ICONS,
        ingredient_chips=INGREDIENT_CHIPS,
        insights=INSIGHTS,
    )


if __name__ == "__main__":
    # Debug mode (the interactive Werkzeug debugger) must never be the
    # checked-in default — it allows arbitrary code execution if the
    # debugger is ever reachable. Opt in locally with FLASK_DEBUG=1.
    debug_mode = os.environ.get("FLASK_DEBUG") == "1"
    app.run(debug=debug_mode, host="127.0.0.1", port=5000)
