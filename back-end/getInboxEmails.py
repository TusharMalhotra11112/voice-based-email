import email
import imaplib
from email.header import decode_header
from emailSummerization import summarize_email

from bs4 import BeautifulSoup


# function to extract plain text from email body
def extract_plain_text(html_content):
    # Parse the HTML content
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract plain text
    plain_text = soup.get_text(separator=' ', strip=True)
    
    return plain_text

'''
function getEmails is used to get all the emails from the user's email and password.
params:
    user_email: email of the user
    password: email account app password
    limit: number of emails to show
    type: here is a string, it could be either "primary", "promotions", "all", "social"
'''
def getEmails(user_email:str, password:str, limit:int, type:str="primary"):

    mail_server = "imap.gmail.com"

    # Connect to the Gmail IMAP server
    mail = imaplib.IMAP4_SSL(mail_server)

    # Log in to the Gmail account
    mail.login(user_email, password)

    # Select the "inbox" mailbox
    mail.select("inbox")

    if type=="all":
        status, messages = mail.search(None, "ALL")
    elif type=="primary":
        status, messages = mail.search(None, 'X-GM-RAW "category:primary"')
    elif type=="promotions":
        status, messages = mail.search(None, 'X-GM-RAW "category:promotions"')
    elif type=="social":
        status, messages = mail.search(None, 'X-GM-RAW "category:social"')
    else:
        return None
    
    # Get the list of email IDs
    email_ids = messages[0].split()

    # Sort email IDs by date
    email_ids = sorted(email_ids, key=lambda x: int(x))


    # emails to store all the emails in dic form
    emails = []

    # Display only the top 10 emails
    for email_id in email_ids[-limit:]:

        # dic for an email
        email_dic = {}

        # Fetch the email content
        status, msg_data = mail.fetch(email_id, "(RFC822)")
        
        # Extract the email content
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)
        
        # Extract relevant information (e.g., subject, sender, date)
        subject, encoding = decode_header(msg["Subject"])[0]
        if(encoding!=None):
            subject = subject.decode(encoding) if isinstance(subject, bytes) else subject
        
        sender, encoding = decode_header(msg.get("From"))[0]
        sender = sender.decode(encoding) if isinstance(sender, bytes) else sender
        
        date = msg.get("Date")

        # Print or process the extracted information
        email_dic["subject"] = subject
        email_dic["sender"] = sender
        email_dic["date"] = date

        # Get the email body
        if msg.is_multipart():
            # If the email is multipart (contains both text and HTML parts), get the text part
            for part in msg.walk():
                if part.get_content_type() == "text/plain":
                    try:
                        body = part.get_payload(decode=True)
                        email_dic["body"] = summarize_email(extract_plain_text(body.decode("utf-8")))
                        break
                    except:
                        continue
        else:
            try:
                # If the email is not multipart, get the entire body
                body = msg.get_payload(decode=True)
                email_dic["body"] = summarize_email(extract_plain_text(body.decode("utf-8")))
            except:
                continue
        
        emails.append(email_dic)
        
    # Close the connection
    mail.logout()

    return emails