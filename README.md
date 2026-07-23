<div align="center">

# FluxCI

**AI-powered CI/CD failure analyzer.** Paste a build log, get a root cause, a plain-English explanation, and a ready-to-run fix — in seconds.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-API-8E75B2?logo=googlegemini&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

<table align="center">
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/a980703d-71d6-42ee-b0e8-262a061c7ffd" width="400" alt="Landing Page" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/de9722bc-26fa-4bf5-ac0a-2ede2a7f8a71" width="400" alt="Investigation Workspace" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/00f8eb69-2a80-4b95-ab9b-76c72e67df5e" width="400" alt="Analysis Report" />
    </td>
    <td align="center">
      <img src="https://github.com/user-attachments/assets/f0c356de-d09d-42aa-9c8c-db9d74757360" width="400" alt="Pipeline Timeline" />
    </td>
  </tr>
  <tr>
    <td colspan="2" align="center">
      <img src="https://github.com/user-attachments/assets/ec910594-424b-45a2-ac90-38cc6887d0e5" width="500" alt="Investigation History" />
    </td>
  </tr>
</table>
</div>

## What makes this worth a second look

Most log analyzers just pipe everything to an LLM and hope for the best. FluxCI doesn't:

> **A deterministic rule engine runs first.** Known failures — missing packages, failing tests, lint violations, permission errors — resolve instantly, consistently, with zero AI cost and zero hallucination risk. Gemini is only called when a failure is genuinely too novel or ambiguous for a rule to safely handle — including recognizing when a log contains *multiple distinct problems at once*, and correctly escalating to AI synthesis instead of confidently reporting just one of them.

That routing decision — and the judgment calls behind it — is the part of this project actually worth discussing in an interview.

## Features

- **Deterministic-first, AI-fallback architecture** — instant answers for known failures, Gemini for everything else
- **Multi-issue aware** — detects when a log has more than one genuine problem and escalates for real synthesis instead of guessing
- **Live investigation timeline** — watch each pipeline stage complete in real time
- **Ready-to-run fixes** — a real terminal command when one genuinely exists, an honest "no single command fixes this" when one doesn't
- **Searchable investigation history** — every analysis saved and revisitable

## Tech stack

**Frontend** — Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
**Backend** — FastAPI · SQLAlchemy · SQLite
**AI** — Google Gemini (`google-genai`)

## Architecture

```
┌──────────────────┐        HTTP / JSON        ┌───────────────────┐
│  Next.js frontend  │ ────────────────────────▶ │   FastAPI backend   │
│  (React, TS)       │ ◀──────────────────────── │                     │
└──────────────────┘                            └──────────┬────────┘
                                                              │
                                                   ┌──────────▼──────────┐
                                                   │  Deterministic rule   │
                                                   │  engine matches log   │
                                                   └──────────┬──────────┘
                                                              │
                                          ┌───────────────────┴───────────────────┐
                                          ▼                                       ▼
                              ┌────────────────────┐                 ┌─────────────────────┐
                              │  Exactly one match,   │                 │  No match, or 2+ rules │
                              │  return instantly      │                 │  matched → escalate to │
                              │  (no AI call made)     │                 │  Gemini for synthesis  │
                              └────────────────────┘                 └─────────────────────┘
```

## Quick start

```bash
# Backend
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_key_here" > .env
uvicorn app.main:app --reload          # → http://localhost:8000

# Frontend (new terminal)
cd frontend-redesign
npm install
npm run dev                            # → http://localhost:3000
```

Requires Node.js 20+, Python 3.11+, and a [Gemini API key](https://aistudio.google.com/app/apikey). Start the backend first.

## Example

**Input:** `Error: Cannot find module 'lodash'`
**Output:** resolved instantly by the rule engine — no AI call made — `npm install lodash`

**Input:** a log with a native module crash, a silently-swallowed TypeScript error, *and* a separate GitHub Actions permissions failure
**Output:** the engine detects three distinct issues and escalates to Gemini, which correctly names all three instead of reporting just one

<br>

<details>
<summary><strong>📖 Full documentation</strong> — project structure, API reference, environment variables, known limitations & roadmap</summary>

<br>

### Project structure

```
backend/
├── app/
│   ├── api/                  # FastAPI route definitions
│   ├── models/                # SQLAlchemy ORM models
│   ├── repositories/          # DB query layer
│   ├── rules/                 # Deterministic failure-detection rules
│   ├── schemas/                # Pydantic request/response models
│   ├── services/               # Rule engine, decision engine, Gemini client, log pipeline
│   └── main.py                 # App entrypoint
├── requirements.txt
└── .env                         # GEMINI_API_KEY (not committed)

frontend-redesign/
├── app/                          # Landing, investigate, analysis, history pages
├── components/                  # Shared UI components
├── lib/                         # API client, session helpers
└── types/                       # Shared TypeScript types
```

### API reference

Base URL: `http://localhost:8000`

| Method | Path | Description |
|---|---|---|
| `POST` | `/analyze?log=<text>` | Starts a new investigation. Returns a `job_id`; analysis runs in the background. |
| `GET` | `/jobs/{job_id}` | Poll for live status and the final analysis. |
| `GET` | `/history` | List every past investigation. |
| `GET` | `/history/search?q=<text>` | Search past investigations. |
| `GET` | `/history/{analysis_id}` | Get one specific investigation. |
| `DELETE` | `/history/{analysis_id}` | Delete one investigation. |
| `DELETE` | `/history` | Clear all investigation history. |

### Environment variables

| Variable | Where | Required | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | `backend/.env` | Yes | Your Gemini API key. |
| `NEXT_PUBLIC_API_URL` | `frontend-redesign/.env.local` | No — defaults to `http://localhost:8000` | Where the frontend sends API requests. |

### Known limitations & roadmap

- [ ] `POST /analyze` takes the log as a query parameter, not a JSON request body — will hit URL-length limits on very large logs
- [ ] `GET /history` returns every record, unpaginated
- [ ] Search and delete exist as backend endpoints but aren't wired into the frontend UI yet
- [ ] No automated test suite yet for the rule engine or decision engine
- [ ] `exit_code` and stack traces are already extracted internally but not yet surfaced to the user
- [ ] Expand deterministic rule coverage to more languages and CI-specific error formats
- [ ] Deploy a live demo

### Acknowledgements

[Google Gemini](https://ai.google.dev/) · [Next.js](https://nextjs.org/) · [FastAPI](https://fastapi.tiangolo.com/) · [lucide-react](https://lucide.dev/) · [shadcn/ui](https://ui.shadcn.com/) · [Tailwind CSS](https://tailwindcss.com/)

</details>

<br>

## License

MIT — see [LICENSE](LICENSE).
