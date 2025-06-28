import os
from openai import AzureOpenAI
from dotenv import load_dotenv

load_dotenv()
class OpenAIChat:
    def __init__(self):
        self.subscription_key = os.getenv("SUB_KEY")
        self.endpoint = "https://archi-m7gaksfs-eastus2.cognitiveservices.azure.com/"
        self.model_name = "gpt-4.1"
        self.deployment = "gpt-4.1"
        self.api_version = "2024-12-01-preview"
        self.client = AzureOpenAI(
            api_version=self.api_version,
            azure_endpoint=self.endpoint,
            api_key=self.subscription_key,
        )
    
    def chat_completion(self, road_context, max_completion_tokens=1000, temperature=1.0, top_p=1.0, frequency_penalty=0.0, presence_penalty=0.0):
        response = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": """You are a helpful assistant to generate road related reports in India based on the provided data.
                        Firstly you well report the Read Features point wise straight like a key value pair.
                        Elaborate each subpoint in Road Assessment Data with 2 lines.
                        Then, provide a detailed analysis of the Demographic Data.
                        Finally, summarize the entire report in a concise manner.""",
                    },
                    {
                        "role": "user",
                        "content": road_context,
                    }
                ],
                max_completion_tokens=max_completion_tokens,
                temperature=temperature,
                top_p=top_p,
                frequency_penalty=frequency_penalty,
                presence_penalty=presence_penalty,
                model=self.deployment
            )
        return response.choices[0].message.content





# openai_chat = OpenAIChat()
# response = openai_chat.chat_completion(road_context)
# print(response)