import os

os.environ["XDG_CACHE_HOME"] = "/tmp"
os.environ["HF_HOME"] = "/tmp"  # fallback for some HuggingFace-related tools
os.environ["TOKENIZERS_PARALLELISM"] = "false"