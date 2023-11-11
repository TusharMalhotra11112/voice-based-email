'''
email: shobhitmishra2002@gmail.com
app password: bjdz ejfw lqwb cree 
'''

import smtplib, ssl

port = 465
smtp_server = "smtp.gmail.com"

password = "bjdz ejfw lqwb cree"
sender_email = "shobhitmishra2002@gmail.com"
receiver_email = "shobhitmishra2002@gmail.com"

text = """
Subject: Hi there


This message if from python.
"""

context = ssl.create_default_context()

try:
    server = smtplib.SMTP_SSL(smtp_server, port, context=context)
    server.ehlo()
    server.login(sender_email, password)
    print("Done")
    # server.sendmail(sender_email, receiver_email, text)
except Exception as e:
    print(e)
finally:
    server.quit()
