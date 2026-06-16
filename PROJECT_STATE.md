FluxCI Project State

Project Overview

AI-powered CI failure analyzer that accepts CI logs, extracts failures, classifies errors, provides deterministic fixes for common issues, and uses Gemini for advanced root-cause analysis.

⸻

Milestones

M1 - Project Setup

Backend

* FastAPI initialized ✅
* Folder structure created ✅
* Environment variables configured ✅
* SQLite configured
* SQLAlchemy configured
* Pydantic schemas configured

Frontend

* Next.js initialized
* Tailwind configured
* shadcn/ui configured
* API client configured

Status:  IN PROGRESS
⸻

M2 - Database Layer

Tables

Analysis

* id
* job_id
* original_log
* cleaned_log
* error_type
* root_cause
* explanation
* fix_suggestion
* fix_command
* created_at

ProcessingJob

* id
* job_id
* status
* created_at

Status: NOT STARTED

⸻

M3 - Log Processing Engine

Log Cleaner

* Remove INFO logs
* Remove success logs
* Remove noise

Extraction

* Error blocks
* Stack traces
* Exit codes
* Failure sections

Status: NOT STARTED

⸻

M4 - Deterministic Error Engine

Dependency Errors

* ModuleNotFoundError
* npm dependency failures
* pip dependency failures

Docker

* Docker build failures

Compilation

* Common compilation failures

Status: NOT STARTED

⸻

M5 - Failure Classification

* Dependency Error
* Compilation Error
* Test Failure
* Docker Failure
* Lint Failure
* Unknown Failure

Status: NOT STARTED

⸻

M6 - Async Processing

* Job ID generation
* BackgroundTasks
* Processing queue
* Status endpoint
* Completion tracking

Status: NOT STARTED

⸻

M7 - Gemini Analysis

Structured Output

* Error Type
* Root Cause
* Explanation
* Fix Suggestion
* Fix Command

Status: NOT STARTED

⸻

M8 - Backend APIs

Analysis

* POST /analyze

Job Tracking

* GET /jobs/{job_id}

History

* GET /history
* GET /history/search

Status: NOT STARTED

⸻

M9 - Frontend

Analyze Page

* Log textbox
* File upload
* Analyze button

Results Page

* Error type
* Root cause
* Explanation
* Fix command

History Page

* History table
* Search
* Filtering

Status: NOT STARTED

⸻

M10 - Deployment

Backend

* Render deployment

Frontend

* Vercel deployment

Status: NOT STARTED

⸻

Current Work

Current Milestone:
M1 - Project Setup

Current Task:
Configure database foundation

Current File:
backend/app/main.py

Current Blocker:
None

Next Step:
Create SQLite connection layer

⸻

Session Log

Session 1

Completed:

* Project scope finalized
* Architecture finalized
* Milestone tracking system created

Next Session Goal:
Create backend and frontend project structure