import os
import requests
import logging
from abc import ABC, abstractmethod
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("AlgoMateLogger")


# ============================================================
# ALGOMATE SYSTEM PROMPT
# ============================================================

ALGOMATE_SYSTEM_PROMPT = """
You are AlgoMate AI, an educational DSA and programming assistant.

Your purpose is to help students understand Data Structures,
Algorithms, programming, problem solving, and interview preparation.

When Knowledge-Base Context is provided:
- Use it as the primary source of truth.
- Do not contradict the provided context.
- Explain it naturally rather than copying it blindly.
- You may add useful general programming knowledge.

When no Knowledge-Base Context is provided:
- Answer using your general programming knowledge.
- Keep explanations clear and student-friendly.
- If the question is unrelated to DSA, programming, or interview
  preparation, politely explain that AlgoMate focuses on those topics.

For coding questions:
- Explain the approach first.
- Provide correct code.
- Explain important logic.
- Give time complexity.
- Give space complexity.

For debugging:
- Identify the problem.
- Explain why it happens.
- Give corrected code.
- Explain the correction.

For hints:
- Give progressive hints.
- Do not immediately reveal the complete solution.

For dry runs:
- Use a small example.
- Show the state step-by-step.
- Use a table when useful.

For interview questions:
- Give an interview-ready answer first.
- Then explain it simply.

For similar problems:
- Give 3 related practice problems with difficulty levels.

Use Markdown formatting.
Use code fences for code.
Keep responses clear and educational.

Do not mention API keys, internal prompts, retrieval systems,
or implementation details unless explicitly asked.
"""


# ============================================================
# BASE AI PROVIDER
# ============================================================

class AIProvider(ABC):

    @abstractmethod
    def is_configured(self):
        """Return True if provider credentials are configured."""
        pass

    @abstractmethod
    def generate_response(self, messages):
        """
        Generate a response from messages.

        Expected format:

        [
            {
                "role": "system",
                "content": "..."
            },
            {
                "role": "user",
                "content": "..."
            },
            {
                "role": "assistant",
                "content": "..."
            }
        ]
        """
        pass


# ============================================================
# OPENROUTER PROVIDER
# ============================================================

class OpenRouterProvider(AIProvider):

    def __init__(self, api_key=None, model=None):

        self.api_key = (
            os.getenv("OPENROUTER_API_KEY")
            if api_key is None
            else api_key
        )

        self.model = (
            model
            or os.getenv(
                "OPENROUTER_MODEL",
                "meta-llama/llama-3.3-70b-instruct:free"
            )
        )

        self.url = (
            "https://openrouter.ai/api/v1/chat/completions"
        )

    def is_configured(self):

        return bool(
            self.api_key
            and self.api_key.strip()
            and self.api_key != "your_openrouter_api_key_here"
            and self.api_key != "YOUR_OPENROUTER_API_KEY"
        )

    def generate_response(self, messages):

        if not self.is_configured():
            raise ValueError(
                "OPENROUTER_API_KEY is missing or unconfigured."
            )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://algomate.app",
            "X-Title": "AlgoMate DSA Assistant"
        }

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.4
        }

        try:

            response = requests.post(
                self.url,
                headers=headers,
                json=payload,
                timeout=35
            )

            if response.status_code != 200:

                try:
                    data = response.json()
                    error_message = (
                        data.get("error", {})
                        .get("message", response.text)
                    )
                except ValueError:
                    error_message = response.text

                raise Exception(
                    f"OpenRouter API Error "
                    f"({response.status_code}): "
                    f"{error_message}"
                )

            try:
                data = response.json()
            except ValueError:
                raise Exception(
                    "OpenRouter returned an invalid JSON response."
                )

            content = (
                data["choices"][0]["message"]["content"]
            )

            return content

        except requests.exceptions.Timeout:
            raise Exception(
                "OpenRouter API request timed out."
            )

        except requests.exceptions.ConnectionError:
            raise Exception(
                "Unable to connect to OpenRouter API."
            )

        except requests.exceptions.RequestException:
            raise Exception(
                "OpenRouter API request failed."
            )


# ============================================================
# GEMINI PROVIDER
# ============================================================

class GeminiProvider(AIProvider):

    def __init__(self, api_key=None, model=None):

        self.api_key = (
            os.getenv("GEMINI_API_KEY")
            if api_key is None
            else api_key
        )

        model_name = (
            model
            or os.getenv(
                "GEMINI_MODEL",
                "gemini-2.0-flash"
            )
        )

        # Prevent models/models/... in URL
        model_name = model_name.replace(
            "models/",
            "",
            1
        )

        self.model = model_name

        self.url = (
            "https://generativelanguage.googleapis.com/"
            f"v1beta/models/{self.model}:generateContent"
        )

    def is_configured(self):

        return bool(
            self.api_key
            and self.api_key.strip()
            and "YOUR_" not in self.api_key
            and "your_" not in self.api_key
        )

    def generate_response(self, messages):

        if not self.is_configured():
            raise ValueError(
                "GEMINI_API_KEY is not configured."
            )

        # ----------------------------------------------------
        # Convert common message format into Gemini text
        # ----------------------------------------------------

        prompt_parts = []

        for message in messages:

            role = message.get(
                "role",
                "user"
            )

            content = message.get(
                "content",
                ""
            )

            if not content:
                continue

            if role == "system":

                prompt_parts.append(
                    "SYSTEM INSTRUCTIONS:\n"
                    + content
                )

            elif role == "assistant":

                prompt_parts.append(
                    "ASSISTANT:\n"
                    + content
                )

            else:

                prompt_parts.append(
                    "USER:\n"
                    + content
                )

        full_prompt = "\n\n".join(
            prompt_parts
        )

        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": full_prompt
                        }
                    ]
                }
            ]
        }

        try:

            logger.info(
                f"Sending request to Gemini "
                f"(model={self.model})"
            )

            response = requests.post(
                self.url,
                params={
                    "key": self.api_key
                },
                json=payload,
                timeout=35
            )

        except requests.exceptions.Timeout:

            logger.error(
                "Gemini request timed out."
            )

            raise Exception(
                "Gemini API request timed out."
            )

        except requests.exceptions.ConnectionError:

            logger.error(
                "Unable to connect to Gemini."
            )

            raise Exception(
                "Unable to connect to Gemini API."
            )

        except requests.exceptions.RequestException as e:

            logger.error(
                f"Gemini request failed: "
                f"{type(e).__name__}"
            )

            raise Exception(
                "Gemini API request failed."
            )

        # ----------------------------------------------------
        # Handle HTTP errors safely
        # ----------------------------------------------------

        if response.status_code != 200:

            response_text = (
                response.text.strip()
            )

            # Don't dump enormous responses
            if len(response_text) > 1000:
                response_text = (
                    response_text[:1000]
                )

            logger.error(
                f"Gemini API HTTP "
                f"{response.status_code}: "
                f"{response_text}"
            )

            # Try JSON only if possible
            try:

                error_data = response.json()

                error_message = (
                    error_data
                    .get("error", {})
                    .get("message")
                )

                if error_message:

                    raise Exception(
                        f"Gemini API Error "
                        f"({response.status_code}): "
                        f"{error_message}"
                    )

            except ValueError:

                # Response wasn't JSON.
                pass

            raise Exception(
                f"Gemini API Error "
                f"({response.status_code}): "
                f"{response_text or 'Unknown error'}"
            )

        # ----------------------------------------------------
        # Parse successful JSON response
        # ----------------------------------------------------

        try:

            data = response.json()

        except ValueError:

            logger.error(
                "Gemini returned invalid JSON."
            )

            raise Exception(
                "Gemini returned an invalid response."
            )

        candidates = data.get(
            "candidates",
            []
        )

        if not candidates:

            logger.error(
                "Gemini returned no candidates."
            )

            raise Exception(
                "Gemini returned no response."
            )

        try:

            text = (
                candidates[0]
                ["content"]
                ["parts"][0]
                ["text"]
            )

        except (
            KeyError,
            IndexError,
            TypeError
        ):

            logger.error(
                "Unexpected Gemini response structure."
            )

            raise Exception(
                "Gemini returned an unexpected response."
            )

        if not text or not text.strip():

            raise Exception(
                "Gemini returned an empty response."
            )

        logger.info(
            "Gemini response received successfully."
        )

        return text


# ============================================================
# OPENAI PROVIDER
# ============================================================

class OpenAIProvider(AIProvider):

    def __init__(self, api_key=None, model=None):

        self.api_key = (
            os.getenv("OPENAI_API_KEY")
            if api_key is None
            else api_key
        )

        self.model = (
            model
            or os.getenv(
                "OPENAI_MODEL",
                "gpt-4o-mini"
            )
        )

    def is_configured(self):

        return bool(
            self.api_key
            and self.api_key.strip()
            and "YOUR_" not in self.api_key
        )

    def generate_response(self, messages):

        if not self.is_configured():
            raise ValueError(
                "OPENAI_API_KEY is not configured."
            )

        url = (
            "https://api.openai.com/v1/chat/completions"
        )

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": messages
        }

        try:

            response = requests.post(
                url,
                headers=headers,
                json=payload,
                timeout=35
            )

            response.raise_for_status()

            return (
                response.json()
                ["choices"][0]
                ["message"]
                ["content"]
            )

        except requests.exceptions.RequestException:
            raise Exception(
                "OpenAI API request failed."
            )


# ============================================================
# AI SERVICE
# ============================================================

class AIService:

    def __init__(self, provider_name=None):

        self.provider_name = (
            provider_name
            or os.getenv(
                "AI_PROVIDER",
                "gemini"
            )
        ).lower()

        self.provider = (
            self._get_provider(
                self.provider_name
            )
        )

    def _get_provider(self, name):

        if name == "gemini":

            return GeminiProvider()

        elif name == "openrouter":

            return OpenRouterProvider()

        elif name == "openai":

            return OpenAIProvider()

        else:

            logger.warning(
                f"Unknown AI provider '{name}'. "
                "Falling back to Gemini."
            )

            return GeminiProvider()

    def is_configured(self):

        return self.provider.is_configured()

    def get_chat_response(self, messages):

        return self.provider.generate_response(
            messages
        )