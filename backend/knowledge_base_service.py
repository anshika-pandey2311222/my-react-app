import os
import json
import re
import logging

logger = logging.getLogger("AlgoMateLogger")

# Common stopwords to ignore when matching query tokens
_STOPWORDS = {
    "what", "is", "the", "a", "an", "of", "in", "to", "and", "or",
    "how", "does", "do", "explain", "me", "can", "you", "give", "tell",
    "about", "with", "for", "why", "when", "where", "which", "are",
    "my", "i", "it", "its", "this", "that", "these", "those", "was",
    "has", "have", "will", "use", "using", "get", "make", "need",
    "difference", "between", "vs", "versus"
}

# Synonym and acronym expansions for lightweight DSA topic matching
_TOPIC_SYNONYMS = {
    "bfs": ["breadth first search", "breadth-first", "graph", "tree traversal"],
    "dfs": ["depth first search", "depth-first", "graph", "tree traversal"],
    "bst": ["binary search tree", "tree"],
    "array": ["arrays"],
    "arrays": ["array"],
    "stack": ["stacks"],
    "stacks": ["stack"],
    "queue": ["queues"],
    "queues": ["queue"],
    "tree": ["trees", "traversal", "traversals"],
    "trees": ["tree", "traversal", "traversals"],
    "binarysearch": ["binary search", "searching"],
    "linkedlist": ["linked list", "linked"],
    "recursion": ["recursive"],
    "dp": ["dynamic programming", "dynamicprogramming"],
}


class KnowledgeBaseService:
    """
    Lightweight knowledge base retrieval service for AlgoMate.

    The primary public method is `get_context(user_message)` which returns
    relevant raw text from the knowledge base (or None) intended to be
    injected into an AI prompt (RAG-style).

    The legacy `search()` method is preserved for backward compatibility
    and returns None so that answers are always AI-generated.
    """

    def __init__(self, json_path=None):
        if json_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            json_path = os.path.join(base_dir, "data", "knowledge_base.json")
        self.json_path = json_path
        self.kb_data = []
        self.load_data()

    def load_data(self):
        """Load knowledge base entries from JSON file."""
        if os.path.exists(self.json_path):
            try:
                with open(self.json_path, "r", encoding="utf-8") as f:
                    self.kb_data = json.load(f)
                logger.info(f"Knowledge base loaded: {len(self.kb_data)} entries from {self.json_path}")
            except Exception as e:
                logger.error(f"Error loading knowledge base: {e}")
                self.kb_data = []
        else:
            logger.warning(f"Knowledge base file not found at: {self.json_path}")
            self.kb_data = []

    def _normalize(self, text):
        """Lowercase and strip punctuation from text."""
        return re.sub(r'[^\w\s]', '', text.lower()).strip()

    def _meaningful_tokens(self, text):
        """
        Tokenize text and filter out stopwords.
        Returns a set of meaningful keyword tokens.
        """
        tokens = set(self._normalize(text).split())
        return tokens - _STOPWORDS

    def _score_entry(self, entry, query_tokens, query_clean, expanded_tokens):
        """
        Score a single KB entry against the query and expanded synonyms.
        """
        score = 0.0

        # --- Title matching ---
        title_raw = entry.get("title", "")
        title_norm = self._normalize(title_raw)
        title_tokens = self._meaningful_tokens(title_raw)
        title_joined = title_norm.replace(" ", "")

        if title_tokens:
            intersection = query_tokens.intersection(title_tokens)
            if intersection:
                union = query_tokens.union(title_tokens)
                score += (len(intersection) / len(union)) * 0.7
            else:
                exp_intersection = expanded_tokens.intersection(title_tokens)
                if exp_intersection:
                    score += 0.4

        # Bonus: query contains full title or normalized title
        if title_joined and (title_joined in query_clean.replace(" ", "") or title_norm in query_clean):
            score += 0.4

        # --- Keyword matching ---
        keywords = [self._normalize(kw) for kw in entry.get("keywords", [])]
        for kw in keywords:
            if kw and (kw in query_clean or kw in expanded_tokens):
                score += 0.35
            kw_tokens = self._meaningful_tokens(kw)
            if kw_tokens and kw_tokens.intersection(expanded_tokens):
                score += 0.15

        # --- Content snippet matching ---
        content_snippet = self._normalize(entry.get("content", "")[:500])
        content_tokens = set(content_snippet.split())
        hits = query_tokens.intersection(content_tokens)
        if hits:
            score += len(hits) * 0.1

        return score

    def get_context(self, user_message, top_k=2, threshold=0.25):
        """
        Search the knowledge base and return relevant raw context text.

        Returns relevant context string or None if no match found.
        """
        if not self.kb_data or not user_message or not str(user_message).strip():
            return None

        query_clean = self._normalize(user_message)
        query_tokens = self._meaningful_tokens(user_message)

        if not query_tokens:
            logger.debug("No meaningful tokens in query after stopword filtering.")
            return None

        # Expand query tokens with topic synonyms and acronyms
        expanded_tokens = set(query_tokens)
        for token in query_tokens:
            if token in _TOPIC_SYNONYMS:
                for syn in _TOPIC_SYNONYMS[token]:
                    expanded_tokens.update(self._meaningful_tokens(syn))

        # Score every entry
        scored = []
        for entry in self.kb_data:
            s = self._score_entry(entry, query_tokens, query_clean, expanded_tokens)
            if s >= threshold:
                scored.append((s, entry))

        if not scored:
            logger.info(f"KB MISS: no entries above threshold={threshold} for query='{user_message[:60]}'")
            return None

        # Sort by score descending, take top_k
        scored.sort(key=lambda x: x[0], reverse=True)
        top_entries = scored[:top_k]

        # Build context string
        context_parts = []
        for score, entry in top_entries:
            title = entry.get("title", "Unknown")
            category = entry.get("category", "")
            content = entry.get("content", "").strip()

            if len(content) > 800:
                content = content[:800] + "..."

            part = f"Topic: {title}"
            if category:
                part += f" ({category})"
            part += f"\n{content}"
            context_parts.append(part)
            logger.debug(f"KB entry included: '{title}' with score={score:.3f}")

        logger.info(
            f"KB HIT: {len(top_entries)} entries retrieved for query='{user_message[:60]}' "
            f"(top score={top_entries[0][0]:.3f})"
        )
        return "\n\n---\n\n".join(context_parts)

    def search(self, query):
        """
        Legacy method — preserved for backward compatibility.
        Always returns None to ensure all responses are AI-generated.
        """
        return None

