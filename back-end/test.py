from openai import OpenAI
from dotenv import load_dotenv
import os
from utils import extractJSON
import json
import re

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print(OPENAI_API_KEY)

client = OpenAI(api_key=OPENAI_API_KEY)

prompt = """TOPIC: write an email for front-end developer role in xyz company?
INFORMATION: 
What is the name and title of the receiver of the email?
John Doe, HR Manager.
What is the name of the XYZ company's HR contact person?
John Doe.
What are the specific requirements for the front-end developer role at XYZ company?
3+ years of experience in front-end development, proficiency in HTML, CSS, and JavaScript
What technologies and programming languages are preferred by XYZ company for front-end development?
React, Angular, Vue.js, and Node.js"""

# completion = client.chat.completions.create(
#     model="gpt-3.5-turbo",
#     messages=[
#         {"role": "system",
#             "content": "You are a skilled email writer and you have to write a concise email with given topic and extra data"},
#         {"role": "user", "content": prompt},
#     ]
# )

# output = completion.choices[0].message.content

output = """Subject: Application for Front-End Developer Role at XYZ Company

Dear John Doe,

I hope this email finds you well. I am writing to express my interest in the front-end developer role at XYZ Company as advertised. With over 5 years of experience in front-end development and proficiency in HTML, CSS, and JavaScript, I am confident in my ability to contribute effectively to your team.

I have extensive experience working with React, Angular, Vue.js, and Node.js, which are technologies preferred by XYZ Company for front-end development. I am excited about the opportunity to bring my skills and expertise to your esteemed organization.

I have attached my resume for your review. I am looking forward to the possibility of discussing how my background, skills, and enthusiasms align with the requirements of the front-end developer role at XYZ Company.

Thank you for considering my application. I look forward to your positive response.

Warm regards,

[Your Name]"""

print("RAW OUTPUT: ")
# print(output)

# extract subject from the email
subject = re.search(r"Subject: (.+)", output).group(1)
print(subject)

# extract the body of the email
body = output.replace("Subject: " + subject, "")
print(body)
