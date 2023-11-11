import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

port = 465
smtp_server = "smtp.gmail.com"

'''
function sendEmail is used to send the email.
params: 
    sender_email: sender's email
    sender_email_passwd: sender's email app password
    receiver_email: receiver's email
    subject: subject of the email
    text: text content of the email
'''
def sendEmail(sender_email:str, sender_email_passwd:str, receiver_email:str, subject:str, text:str)->bool:
    
    # making the message structure
    message = MIMEMultipart('alternative')
    message["Subject"] = subject
    message["From"] = sender_email
    message["To"] = receiver_email
    text_content = MIMEText(text, "plain")
    message.attach(text_content)

    context = ssl.create_default_context()

    # status variable to know whether the email has been sent or not.
    has_email_sent = False 

    try:
        server = smtplib.SMTP_SSL(smtp_server, port, context=context)
        server.ehlo()
        server.login(sender_email, sender_email_passwd)
        server.sendmail(sender_email, receiver_email, message.as_string())
        has_email_sent = True
    except Exception as e:
        print(e)
    finally:
        server.quit()

    if(has_email_sent == False):
        return False

    return True
    
