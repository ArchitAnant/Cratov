import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"  # optional, for tokenizer parallelism
os.environ["TRANSFORMERS_CACHE"] = "/tmp"  # optional if using HuggingFace-style transformers
os.environ["HF_HOME"] = "/tmp"  # for tokenizers
os.environ["OPENAI_CACHE_DIR"] = "/tmp"  # redirects OpenAI cache
os.environ["XDG_CACHE_HOME"] = "/tmp"