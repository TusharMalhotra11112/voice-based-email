import json
import re


def extractJSON(text: str, start='{', end='}'):
    start_index = text.find(start)
    end_index = text.find(end)

    res = text[start_index:end_index+1]
    return res


text = """
{
"subject": "Application for Full Stack Developer Role",
"body": "Dear Hiring Manager, \n I am writing to express my interest in the Full Stack Developer role at your company. With my strong passion for web development and my skills in both front-end and back-end development, I believe I would be a great fit for this position. \n\nI have extensive experience in HTML, CSS, JavaScript, and various frameworks such as React and Angular. Additionally, I have a solid understanding of backend technologies including Node.js, Express, and MongoDB. I am confident that my skills and experience align with the requirements of this role. \n\nI have attached my resume for your review. I would appreciate the opportunity to discuss my qualifications further and how I can contribute to your team. Thank you for your time and consideration. \n\nSincerely, \n[Your Name]",
"question": [
"What is your greatest strength as a full stack developer?",
"Can you give an example of a project you worked on that showcases your full stack skills?",
"How do you stay up-to-date with the latest technologies and trends in full stack development?"
]
}
"""


text = text.replace("\n", "")
text = text.replace("\n\n", "")
match = extractJSON(text)
print(match)

output = json.loads(match)

print(output)
