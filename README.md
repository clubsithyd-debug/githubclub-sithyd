# GitHub Club · SIT Hyderabad

> *Code. Collaborate. Community.*

The official website of the **GitHub Student Club of Symbiosis Institute of Technology, Hyderabad** — a student-led initiative fostering open-source culture, collaboration, and real-world developer skills beyond the classroom.

---

## 🌐 Live Site

> Hosted on GitHub Pages — add link here once deployed.

---

## ✨ What's Built

### Pages
| Page | Status | Description |
|---|---|---|
| `index.html` | ✅ Done | Home — hero, countdown, past events, quote rotator |
| `about.html` | ✅ Done | Club mission, institute info, leadership team, join section |
| `events.html` | ✅ Done | Full events listing with past event gallery |
| `symbihackathon.html` | 🚧 Partial | Hackathon page — countdown done, rules/schedule/prizes placeholders |
| `problems.html` | ✅ Done | Problem statements — CSV-driven table with search/sort/filter/download |
| `committees.html` | 🚧 Partial | Committee structure — member names all "Coming Soon" |
| `contact.html` | ✅ Done | Contact form page |
| `load.html` | ✅ Done | Terminal boot loader screen |
| `backroom.html` | ✅ Done | 🔒 Hidden easter egg — Merge Conflict Simulator game |

### Features
| Feature | Status | Notes |
|---|---|---|
| Boot loader screen | ✅ Done | BIOS-style terminal, network-adaptive timing |
| Typewriter hero | ✅ Done | Cycles through Code / Collaborate / Community |
| Matrix rain background | ✅ Done | Canvas-based binary animation |
| Countdown timer | ✅ Done | Live countdown to April 24, 2026 |
| Quote rotator | ✅ Done | Slide animation, 20s interval, 10 quotes |
| Custom cursor | ✅ Done | Hover effects on interactive elements |
| Leadership flip cards | ✅ Done | 3D flip on click — back shows LinkedIn |
| Problem statements table | ✅ Done | CSV auto-load, search, sort, filter, paginate, download |
| Easter egg (3 stages) | ✅ Done | 5-click logo trigger → git puzzle → colour puzzle → backroom |
| Merge Conflict Simulator | ✅ Done | Hidden game in backroom with streak/level system |
| Contact form | ✅ Done | Form UI done |
| Social links | 🚧 Partial | Instagram & LinkedIn links are `#` placeholders |
| Responsive design | ✅ Done | Mobile-first across all pages |
| Scroll fade-ins | 🚧 Partial | `.fade-in` class exists but IntersectionObserver not wired up |

---

## 🔧 What Needs to Be Added / Fixed

### Content (No Code Needed)
- [ ] **Leadership team names** — fill in Vice Chairperson, Treasurer, Secretary, Content Developer, Executive Member, Faculty In-Charge on `about.html` and `committees.html`
- [ ] **LinkedIn profile links** — replace `href="#"` on all leader card back faces
- [ ] **Instagram link** — add real Instagram URL in navbar social icons and footer
- [ ] **LinkedIn link** — add real LinkedIn URL in navbar social icons and footer
- [ ] **SymbiHackathon rules** — replace placeholder text on `symbihackathon.html`
- [ ] **SymbiHackathon schedule** — add detailed event schedule for April 24, 2026
- [ ] **SymbiHackathon prize pool** — fill in actual prize amounts
- [ ] **Register Now button** — link to actual registration form
- [ ] **Real problem statements** — replace sample CSV with actual `assets/data/problems.csv`
- [ ] **More past events** — add events beyond the Jan 22–24 Ethical Hacking Workshop

### Code / Features
- [ ] **Contact form backend** — form UI exists but submissions go nowhere; connect to EmailJS / Formspree / similar
- [ ] **Scroll fade-in animations** — wire up IntersectionObserver to `.fade-in` elements
- [ ] **OG meta tags** — add `og:title`, `og:description`, `og:image` to all pages for link previews
- [ ] **Favicon** — add `favicon.ico` or `favicon.png` to the root
- [ ] **404 page** — create a custom `404.html` for GitHub Pages
- [ ] **`problems.html` nav link** — not in the main navbar yet; add `~/problems` link
- [ ] **HEIC image conversion** — `ethical-hacking-poster.heic` won't display in browsers; convert to JPG/WebP

---

## 📁 Project Structure

```
├── index.html               # Home page
├── about.html               # About the club & institute
├── events.html              # Events listing
├── symbihackathon.html      # SymbiHackathon 2026
├── problems.html            # Problem statements table
├── committees.html          # Club committees
├── contact.html             # Contact page
├── load.html                # Boot loader screen
├── backroom.html            # 🔒 Easter egg — Merge Conflict Simulator
│
├── css/
│   ├── index.css            # Global styles & design tokens
│   ├── about.css            # About page
│   ├── events.css           # Events page
│   ├── symbihackathon.css   # Hackathon page
│   ├── problems.css         # Problem statements table
│   ├── contact.css          # Contact modal
│   └── backroom.css         # Backroom / game
│
├── js/
│   ├── index.js             # Core — loader routing, typewriter, matrix, easter egg, quotes
│   ├── about.js             # Leadership card flip
│   ├── events.js            # Events page
│   ├── symbihackathon.js    # Hackathon countdown & animations
│   ├── problem.js           # Problem statements — CSV, search, sort, filter, pagination
│   ├── contact-modal.js     # Contact form modal
│   └── backroom.js          # Merge Conflict Simulator game
│
└── assets/
    ├── image/
    │   ├── GitHub_Club.jpg        # Club logo
    │   └── events/                # Event photos (image1–14)
    ├── docs/
    │   └── ethical-hacking-workshop-schedule.pdf
    └── data/
        └── problems.csv           # Problem statements data
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Page structure |
| CSS3 | Styling, animations, grid/flexbox |
| Vanilla JavaScript | All interactivity — no frameworks |
| Tailwind CSS (CDN) | Utility classes |
| Fira Code | Monospace font — terminal aesthetic |
| Inter | Body font |
| Font Awesome 6 | Icons |
| Canvas API | Matrix rain animation |

---

## 🎨 Design Tokens

Defined in `css/index.css` — use these variables for consistency:

```css
--ghbg:         #010409   /* Page background */
--ghpanel:      #0d1117   /* Card / panel background */
--ghtext:       #c9d1d9   /* Primary text */
--ghmuted:      #8b949e   /* Muted / secondary text */
--ghgreen:      #39d353   /* Accent green */
--ghgreen-dim:  #26a641   /* Dimmed green */
--ghborder:     #30363d   /* Border colour */
```

---

## 🚀 Running Locally

> ⚠️ Do **not** open HTML files directly — `file://` blocks CSV loading. Use a local server.

```bash
# Option 1 — Node
npx serve .

# Option 2 — Python
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## 📦 Deployment

The site is deployed on **GitHub Pages**.

1. Push to `main`
2. Go to repo → Settings → Pages → set source to `main` branch, `/ (root)`
3. Site is live at `https://<username>.github.io/<repo>/`

> Make sure `assets/data/problems.csv` is committed — GitHub Pages serves it over HTTPS so the fetch works automatically.

---

## 🔒 Easter Egg

Triggered by **5 rapid clicks on the club logo**:

1. **Stage 1 — The Command** — enter the right git command in the terminal
2. **Stage 2 — The Vision Test** — a colour puzzle with a colorblind advantage
3. **Stage 3 — Access Granted** — enter the Merge Conflict Simulator in the backroom

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch — `git checkout -b feat/your-feature`
3. Commit — `git commit -m "feat: your change"`
4. Push — `git push origin feat/your-feature`
5. Open a Pull Request

---

## 📬 Contact

**GitHub Club · SIT Hyderabad**  
Symbiosis Institute of Technology, Hyderabad  
Telangana, India

---

*© 2026 GitHub Club · SIT Hyderabad*
