from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print(OPENAI_API_KEY)

client = OpenAI(api_key=OPENAI_API_KEY)

completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a skilled email writer. Here you do not need to write an email, but ask for suitable questions, which ask for the facts and information you need to write an email like what is the name of the receiver, what is the purpose of the email, etc. Remember the output should a JSON array of questions."},
        {"role": "user", "content": "Write an email for me to send to a client to schedule a meeting."},
    ]
)

print(completion.choices[0].message.content)
