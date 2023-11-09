import smtplib

user = "malhotratushar999@gmail.com"
password = "qlnw rfqz qgcy uiyu"

imap_url = 'imap.gmail.com'

server = smtplib.SMTP('smtp.gmail.com',587)
server.starttls()
server.login(user,password)

server.sendmail(user,user,"this email is sent throug python")