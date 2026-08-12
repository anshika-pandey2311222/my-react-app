import time
import logging
import traceback
from flask import Blueprint, request, jsonify
from knowledge_base_service import KnowledgeBaseService
from ai_service import AIService, ALGOMATE_SYSTEM_PROMPT

# ---------------------------------------------------------------------------
# Logger setup
# ---------------------------------------------------------------------------
logger = logging.getLogger("AlgoMateLogger")
if not logger.handlers:
    logging.basicConfig(
        level=logging.INFO,
        format="[%(asctime)s] %(levelname)s in %(module)s: %(message)s"
    )

# ---------------------------------------------------------------------------
# Blueprint + service singletons
# ---------------------------------------------------------------------------
chat_bp = Blueprint("chat_bp", __name__)

kb_service = KnowledgeBaseService()
ai_service = AIService()

# Maximum number of history messages (user+assistant turns) to include in AI context.
MAX_HISTORY_MESSAGES = 8


# ---------------------------------------------------------------------------
# Helper: convert frontend history to AI messages format
# ---------------------------------------------------------------------------
def convert_history(chat_history, current_message):
    """
    Convert the frontend history format to the AI provider's messages format.

    Frontend sends:
        [{"role": "user"|"bot", "text": "..."}, ...]

    This function:
    1. Converts "bot" -> "assistant", "user" -> "user"
    2. Drops the last user message if it duplicates current_message
    3. Limits to MAX_HISTORY_MESSAGES entries
    """
    converted = []
    if not isinstance(chat_history, list):
        return converted

    for entry in chat_history:
        if not isinstance(entry, dict):
            continue
        role = entry.get("role", "user")
        text = entry.get("text", "").strip()
        if not text:
            continue
        ai_role = "assistant" if role == "bot" else "user"
        converted.append({"role": ai_role, "content": text})

    # The frontend may include the current user message in history.
    # Remove it from history so it is not duplicated when sent to AI.
    if converted and converted[-1]["role"] == "user":
        if converted[-1]["content"].strip() == current_message.strip():
            converted = converted[:-1]
            logger.debug("Removed duplicate current message from history tail.")

    # Limit to the most recent MAX_HISTORY_MESSAGES messages
    if len(converted) > MAX_HISTORY_MESSAGES:
        converted = converted[-MAX_HISTORY_MESSAGES:]
        logger.debug(f"History trimmed to last {MAX_HISTORY_MESSAGES} messages.")

    return converted


# ---------------------------------------------------------------------------
# Helper: build full AI messages payload (RAG-style)
# ---------------------------------------------------------------------------
def build_ai_messages(user_message, history_messages, kb_context=None):
    """
    Construct the messages list to send to the AI provider.

    When KB context exists:
        SYSTEM: ALGOMATE_SYSTEM_PROMPT
        USER: Knowledge Base Context: ...
        [history messages]
        USER: CURRENT USER QUESTION: [user_message]

    When no KB context:
        SYSTEM: ALGOMATE_SYSTEM_PROMPT
        [history messages]
        USER: [user_message]
    """
    messages = [
        {
            "role": "system",
            "content": ALGOMATE_SYSTEM_PROMPT
        }
    ]

    if kb_context:
        messages.append({
            "role": "user",
            "content": f"Knowledge Base Context:\n---\n{kb_context}\n---"
        })
        if history_messages:
            messages.extend(history_messages)
        messages.append({
            "role": "user",
            "content": f"CURRENT USER QUESTION:\n{user_message}"
        })
    else:
        if history_messages:
            messages.extend(history_messages)
        messages.append({
            "role": "user",
            "content": user_message
        })

    return messages


# ---------------------------------------------------------------------------
# /chat endpoint
# ---------------------------------------------------------------------------
@chat_bp.route("/chat", methods=["POST"])
def chat():
    start_time = time.time()
    ip_addr = request.remote_addr or "127.0.0.1"

    try:
        # ------------------------------------------------------------------
        # STEP 1: Parse and validate request
        # ------------------------------------------------------------------
        data = request.get_json(silent=True) or {}
        user_message = data.get("message", "").strip()
        chat_history = data.get("history", [])

        logger.info(
            f"[/chat] POST from {ip_addr} | "
            f"Query: '{user_message[:60]}' | "
            f"History: {len(chat_history)} msgs"
        )

        if not user_message:
            logger.warning(f"[/chat] Empty message from {ip_addr}")
            return jsonify({
                "response": "Please enter a question or message to get started.",
                "source": "validation_error",
                "execution_ms": 0
            }), 200

        # ------------------------------------------------------------------
        # STEP 2: Convert conversation history
        # ------------------------------------------------------------------
        history_messages = convert_history(chat_history, user_message)
        logger.debug(f"Converted history: {len(history_messages)} messages after dedup/trim.")

        # ------------------------------------------------------------------
        # STEP 3: Search knowledge base for relevant context
        # ------------------------------------------------------------------
        kb_context = kb_service.get_context(user_message)

        if kb_context:
            logger.info(f"[/chat] KB context retrieved ({len(kb_context)} chars). Using RAG pipeline.")
            source = "knowledge_base_ai"
        else:
            logger.info("[/chat] No KB context found. AI will answer from general knowledge.")
            source = "ai_model"

        # ------------------------------------------------------------------
        # STEP 4: Check AI provider configuration
        # ------------------------------------------------------------------
        if not ai_service.is_configured():
            elapsed = round((time.time() - start_time) * 1000, 2)
            logger.warning("[/chat] AI provider is not configured.")

            if kb_context:
                fallback_response = (
                    "AlgoMate AI is temporarily unavailable, but here is "
                    "relevant information from the AlgoMate Knowledge Base:\n\n"
                    f"{kb_context}"
                )
            else:
                fallback_response = "AlgoMate AI is temporarily unavailable. Please try again later."

            return jsonify({
                "response": fallback_response,
                "source": "error_fallback",
                "execution_ms": elapsed
            }), 200

        # ------------------------------------------------------------------
        # STEP 5: Build AI messages payload (RAG-style)
        # ------------------------------------------------------------------
        ai_messages = build_ai_messages(user_message, history_messages, kb_context)
        logger.debug(f"AI messages built: {len(ai_messages)} total messages.")

        # ------------------------------------------------------------------
        # STEP 6: Call AI provider
        # ------------------------------------------------------------------
        try:
            ai_response = ai_service.get_chat_response(ai_messages)
            elapsed = round((time.time() - start_time) * 1000, 2)
            logger.info(
                f"[/chat] AI SUCCESS | source={source} | "
                f"query='{user_message[:40]}' | {elapsed}ms"
            )
            return jsonify({
                "response": ai_response,
                "source": source,
                "execution_ms": elapsed
            }), 200

        except Exception as ai_err:
            elapsed = round((time.time() - start_time) * 1000, 2)
            logger.error(f"[/chat] AI provider failure: {str(ai_err)} | {elapsed}ms")

            if kb_context:
                fallback_response = (
                    "AlgoMate AI is temporarily unavailable, but here is "
                    "relevant information from the AlgoMate Knowledge Base:\n\n"
                    f"{kb_context}"
                )
            else:
                fallback_response = "AlgoMate AI is temporarily unavailable. Please try again later."

            return jsonify({
                "response": fallback_response,
                "source": "error_fallback",
                "execution_ms": elapsed
            }), 200

    except Exception as fatal_e:
        elapsed = round((time.time() - start_time) * 1000, 2)
        logger.error(f"[/chat] Fatal exception: {str(fatal_e)}")
        traceback.print_exc()
        return jsonify({
            "response": "AlgoMate AI is temporarily unavailable. Please try again later.",
            "source": "error_fallback",
            "execution_ms": elapsed
        }), 200

