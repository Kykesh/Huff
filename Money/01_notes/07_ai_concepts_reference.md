# 20 AI Concepts — Reference Card

Compact reference. Use this when a term in the rest of the kit isn't obvious.

## Part 1: How AI works (the foundation)

**1. Neural Networks** — Layered pipeline. Input → hidden layers (with adjustable "weights") → output. Training = adjusting billions of weights until output is accurate. GPT-4: ~1.8 trillion parameters.

**2. Tokenization** — Text broken into pieces (tokens). Not always whole words. "playing" = "play" + "ing." Rule: 1 token ≈ 0.75 words. 1000 tokens ≈ 750 words.

**3. Embeddings** — Each token converted to a vector (numbers). Embedding represents meaning. "Doctor" and "Nurse" sit close in vector space. The math: "King" - "Man" + "Woman" ≈ "Queen." Powers semantic search, recommendations, RAG.

**4. Attention** — Each word looks at every other word in the sentence and decides what matters. Why "Apple" in "ate an Apple" vs "Apple stock" gets different meaning. Pre-attention models read left-to-right. Attention lets them see the whole sentence at once.

**5. Transformers** — The architecture. Tokens → Embeddings → Stacked attention layers → Output. Processes everything in parallel using attention. GPT, Claude, Gemini, Llama, Mistral — all transformers.

## Part 2: How LLMs work

**6. LLMs (Large Language Models)** — Transformers trained on trillions of tokens. Training task: predict the next token. From that simple task at scale, emerged: grammar, reasoning, code, translation, math. "Large" = hundreds of billions of parameters.

**7. Context Window** — Maximum tokens the model can "see" at once (your message + history + response). Claude 3.5: 200K. Gemini 1.5 Pro: 1M. Catch: models read beginning + end more reliably than middle ("Lost in the Middle" problem).

**8. Temperature** — Creativity dial. Temp 0: most predictable. Temp 1: more variety. Temp 2+: incoherent. Low for code/facts. High for brainstorming.

**9. Hallucination** — AI predicts most probable next token. No truth-checking. So it confidently invents fake citations, fake API functions, fake history. Fix: never trust facts without verification. Use RAG to ground.

**10. Prompt Engineering** — How you ask changes everything. Bad: "Explain APIs." Good: "Explain how REST APIs handle authentication. Give a code example. Assume I'm a junior dev." Tricks: context, role, examples, specific output format, break into steps.

## Part 3: How models improve

**11. Transfer Learning** — Take a model trained on a huge general task, adapt it to specific use. Don't start from zero. Build on top.

**12. Fine-Tuning** — Continue training a pretrained model on smaller focused dataset. Medical model fine-tuned on clinical notes. Legal on contracts. Updates billions of params — expensive.

**13. RLHF (Reinforcement Learning from Human Feedback)** — Show model prompt → it generates multiple responses → humans rank them → model learns human preference. What makes ChatGPT/Claude feel helpful and safe rather than just fluent text generators.

**14. LoRA (Low-Rank Adaptation)** — Keep original model frozen. Add tiny trainable layers on top. Fine-tune on consumer GPU. Why open-source AI exploded.

**15. Quantization** — Reduce precision of each weight. 32-bit → 4-bit = 8x smaller. Quality drop often surprisingly small. Why you can run LLaMA on a MacBook.

## Part 4: How real systems are built

**16. RAG (Retrieval-Augmented Generation)** — Lets models look things up. User asks → system searches knowledge base → relevant docs passed to model as context → model answers from real info. Closed-book exam vs open-book. Every serious AI product uses RAG.

**17. Vector Databases** — Store embeddings. When question comes in, also embed it, find closest vectors. Returns semantically similar docs even if exact keywords don't match. Tools: Pinecone, Qdrant, Weaviate, pgvector.

**18. AI Agents** — LLM responds to messages. Agent does things. Think → Act → Observe → Repeat. Agents use tools: web search, code, files, APIs, email, databases. The brain is the model. The hands are the tools.

**19. Chain of Thought (CoT)** — Don't ask for the answer. Ask the model to think step by step. Identify the formula → plug in numbers → calculate. Far more reliable for math, logic, multi-step. Why prompts like "think step by step" actually work.

**20. Diffusion Models** — How AI generates images. Model learns to REVERSE noise. Training: start with image → add noise step by step until pure static → train model to reverse. Generation: start with noise → model removes step by step, guided by text prompt → image emerges. Sora, Runway, Stable Diffusion.

---

## The gap that matters

Most people use AI. Almost nobody understands how it actually works.

The gap between "uses ChatGPT daily" and "understands how the model is making decisions" is the gap between average and 10x. The 20 concepts above close that gap completely. Memorize them. Reference this card when reading the rest of the kit.
