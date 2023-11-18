from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from typing_extensions import Annotated
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import time
from sqlalchemy import create_engine, text, URL

from voiceRecog import voiceRecognition
from sendEmail import sendEmail



# db_url format: mysql+pymysql://<db_user>:<password>@<host>/<db_name>
password_file = open("password.txt", "r")
password = password_file.readline()

engine = create_engine(password)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# custome HttException handling
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request, exc):
    temp_status_code = 404
    if(exc.status_code):
        temp_status_code = exc.status_code
    
    return JSONResponse(
        status_code=temp_status_code,
        content={"message": str(exc.detail)}
        )
        

@app.get("/")
async def root():
    return {"message": "Hello world"}


# this controller will upload multiple wav files
@app.post("/register/")
async def upload(email: Annotated[str, Form()], password: Annotated[str, Form()], files: Annotated[List[UploadFile], File(description="Multiple wav files to upload")]):

    # Checking the number of files
    if(len(files)!=3):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Invalid number of files.")

    # inserting data in the db
    with engine.connect() as conn:
        conn.execute(text("INSERT INTO user_data (email_id, password, audio_1, audio_2, audio_3) VALUES (:email_id, :password, :audio_1, :audio_2, :audio_3)"), 
        [{
            "email_id": email,
            "password": password,
            "audio_1": files[0].file.read(),
            "audio_2": files[1].file.read(),
            "audio_3": files[2].file.read()
        }])

        conn.commit()


    return {"message": "success"}


# This will do the login with email and a voice sample
@app.post("/login/")
async def login(email: Annotated[str, Form()], file: UploadFile):
    
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id, audio_1, audio_2, audio_3, password FROM user_data WHERE email_id=:email_id"), [{"email_id":email}])

        # checking for the uploads folder
        if(os.path.isdir("uploads")==False):
            print("uploads folder not found...")
            print("Creating uploads folder")
            os.mkdir("uploads") # creating uploads folder

        # getting the first row
        data_rows = result.all()

        # checking whether the data is present or not
        if(len(data_rows)==0):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User record does not exists.")
        
        # array for file names
        file_names = ["sample_audio_", "audio_1_", "audio_2_", "audio_3_"]

        # making the file names unique with time library
        for i in range(len(file_names)):
            file_names[i] = "uploads/" + file_names[i] + str(time.time()).split('.')[0] + ".wav"

        # writing data in each file in the 'uploads' folder
        for i in range(len(file_names)):
            f = open(file_names[i], "wb")
            if(i==0):
                f.write(file.file.read())
            else:
                f.write(data_rows[0][i])

        # then we need to work with the audio sample for the final validation with ML
        if(voiceRecognition(file_names[1:], file_names[0])):
            return {
                "message":"success",
                "password": data_rows[0][4],
                "user_id": data_rows[0][0]
                }
        
        # clearing the audio files
        # for file_name in file_names:
        #     os.remove(file_name)
    
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Authentication fails")


# pydantic model for email
class Email(BaseModel):
    user_id: int
    subject: str
    text: str
    receiver_email:str

# This will send the email
@app.post("/sendEmail/")
async def sendingEmail(email: Email):

    #verify the user
    with engine.connect() as conn:
        result = conn.execute(text("SELECT email_id, password FROM user_data WHERE id = :id"), 
        [{"id": email.user_id}])

        rows = result.all()

        if(len(rows)==0):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User record does not exists.")
        
        sender_email = rows[0][0]
        sender_email_passwd = rows[0][1]

        conn.close()
    
    # sending the email
    has_email_sent = sendEmail(sender_email, sender_email_passwd, email.receiver_email, email.subject, email.text) 

    if(has_email_sent):
        return {"message":"success"}

    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Email has not sent")
