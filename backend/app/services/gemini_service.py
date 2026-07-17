import os

from google import genai
from google.genai import types

from app.schemas.gemini_response import GeminiResponse


class GeminiService:

    def __init__(self):

        self.client = genai.Client(
            api_key=os.getenv("GEMINI_API_KEY")
        )

    def analyze(
        self,
        log: str,
    ) -> GeminiResponse:

        prompt = f"""
You are a senior software engineer helping a teammate understand why
their CI/CD pipeline just failed. They are looking at a wall of log
output and feel stuck. Your job is to make them go "oh, THAT'S what
happened" within a few seconds of reading your answer.

Read the ENTIRE log below from top to bottom before answering. Do not
stop at the first error you find. CI/CD logs frequently contain more
than one distinct, unrelated problem — for example, a build step that
silently falls back to a workaround after real errors, followed later
by a completely separate infrastructure or permissions failure. Your
root_cause should be the single most severe, pipeline-blocking failure.
But if you notice any OTHER distinct failure elsewhere in the log —
even one that isn't the final or most dramatic one — you must still
name it explicitly in your explanation. Never silently drop a second
failure just because you already found a first one.

Pay special attention to steps that "recover" or fall back automatically
(a retry, a fallback build tool, a default value substituted for a
missing one). A step that technically finished is not the same as a
step that finished correctly — if real errors were caught and papered
over rather than fixed, treat that as a genuine problem worth reporting,
not a footnote.

When the log's evidence could support more than one plausible technical
explanation for a crash or failure, do not silently pick one and present
it as certain. Name the most likely cause given the evidence, but also
name the credible alternative and, if you can, what a person could check
to tell them apart. For example: a native Node.js module (sharp, bcrypt,
canvas, and similar packages with compiled bindings) crashing inside an
Alpine-based Docker image can look identical to memory exhaustion, but
is frequently actually a musl-libc/glibc ABI incompatibility with a
prebuilt binary — if the log shows an Alpine base image and a crash
inside a native-binding library, explicitly raise that possibility
alongside memory exhaustion, not instead of it. An answer that hides
real uncertainty behind confident-sounding language is worse than one
that is honest about it.

Formatting: if you identify more than one distinct issue (the primary
root cause plus any secondary failures elsewhere in the log), write
your explanation and fix_suggestion as a numbered list — one distinct
finding per line, separated by an actual newline character, like:
"1. First finding here.\\n2. Second, separate finding here." Do not
force numbering if there is genuinely only one issue — plain prose is
fine in that case.

Write your answer as if explaining it out loud to that teammate:

- Be specific. Name the exact file, package, command, environment
  variable, or service involved if it appears in the log. Never say
  vague things like "there was an error in the code" or "check your
  configuration."
- Be concise. No filler phrases like "it appears that" or "it seems
  like." State what happened directly.
- Be useful. The fix should be something the person can actually do
  right now, not generic advice.
- If (and only if) the log is genuinely too short, garbled, or lacks
  any recognizable CI/CD failure signal to analyze, say so plainly in
  root_cause and explanation instead of guessing or inventing details
  that are not supported by the log content.

CI/CD Log:
---
{log}
---
"""

        try:

            response = self.client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                    response_schema=GeminiResponse,
                ),
            )

            if response.parsed:
                return response.parsed

            raise Exception("Gemini returned an empty response.")

        except Exception as e:

            return GeminiResponse(
                error_type="AI Analysis Failed",
                root_cause=str(e),
                explanation=(
                    "Gemini could not analyze this log."
                ),
                fix_suggestion=(
                    "Retry later or inspect the log manually."
                ),
                fix_command="N/A",
            )