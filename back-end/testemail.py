'''
email: shobhitmishra2002@gmail.com
app password: bjdz ejfw lqwb cree 
'''

import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

port = 465
smtp_server = "smtp.gmail.com"

password = "bjdz ejfw lqwb cree"
sender_email = "shobhitmishra2002@gmail.com"
receiver_email = "shobhitmishra2002@gmail.com"

message = MIMEMultipart('alternative')
message["Subject"] = "multiplepart test"
message["From"] = sender_email
message["To"] = receiver_email

text = """
Subject: Hi there


This message if from python.
"""

part = MIMEText(text, "plain")
message.attach(part)

context = ssl.create_default_context()

try:
    server = smtplib.SMTP_SSL(smtp_server, port, context=context)
    server.ehlo()
    server.login(sender_email, password)
    server.sendmail(sender_email, receiver_email, message.as_string())
    print("Done")
except Exception as e:
    print(e)
finally:
    server.quit()
