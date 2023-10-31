from fastapi import FastAPI, File, UploadFile, Form
from typing_extensions import Annotated
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils import generate_random_sentence
import os
import time

from voiceRecog import voiceRecognition

from sqlalchemy import create_engine, text, URL


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


@app.get("/")
async def root():
    return {"message": "Hello world"}


# this controller will upload multiple wav files
@app.post("/register/")
async def upload(email: Annotated[str, Form()], password: Annotated[str, Form()], files: Annotated[List[UploadFile], File(description="Multiple wav files to upload")]):

    if(len(files)!=3):
        return {"status":"fail", "message":"Invalid number of files"}

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


    return {"status": "success"}


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
            return {"status":"fail"}

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
                "status":"success",
                "password": data_rows[0][4]
                }
    
    return {"status":"fails"}