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
You are an expert CI/CD debugging assistant.

Analyze the following CI/CD log.

CI Log:

{log}
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