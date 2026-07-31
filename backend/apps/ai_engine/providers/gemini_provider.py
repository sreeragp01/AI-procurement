import os
import json
import logging
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)

def get_gemini_client():
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if api_key and api_key != "your_google_ai_studio_api_key_here":
        try:
            return genai.Client(api_key=api_key)
        except Exception as e:
            logger.warning(f"Failed to initialize Google GenAI Client: {e}")
    return None

def call_gemini_api(
    prompt: str,
    system_instruction: str = "You are an expert enterprise AI procurement assistant. Respond in clean structured JSON.",
    model: str = "gemini-2.5-flash",
    json_mode: bool = True
) -> dict:
    """
    Centralized Google GenAI SDK Provider wrapper.
    Executes content generation via gemini-2.5-flash / gemini-1.5-flash.
    Returns parsed JSON dict or raw string text.
    """
    client = get_gemini_client()
    if not client:
        return None

    # Preferred model fallback hierarchy (valid Google AI Studio model IDs)
    models_to_try = ["gemini-2.0-flash", "gemini-2.0-flash-lite"]
    if model and model not in models_to_try and "2.5" not in model and "1.5" not in model:
        models_to_try.insert(0, model)
    # De-duplicate preserving order
    seen = set()
    models_to_try = [m for m in models_to_try if not (m in seen or seen.add(m))]

    config = types.GenerateContentConfig(
        system_instruction=system_instruction,
        temperature=0.2,
    )
    if json_mode:
        config.response_mime_type = "application/json"

    for candidate_model in models_to_try:
        try:
            response = client.models.generate_content(
                model=candidate_model,
                contents=prompt,
                config=config
            )
            if response and response.text:
                if json_mode:
                    try:
                        return json.loads(response.text)
                    except json.JSONDecodeError:
                        # Attempt to sanitize markdown fences if present
                        cleaned = response.text.replace("```json", "").replace("```", "").strip()
                        return json.loads(cleaned)
                return {"text": response.text}
        except Exception as e:
            logger.warning(f"Gemini API call failed for model {candidate_model}: {e}")
            continue

    return None
