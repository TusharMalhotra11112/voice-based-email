from fastapi import FastAPI, File, UploadFile, Form
from typing_extensions import Annotated
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from utils import generate_random_sentence

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
        result = conn.execute(text("SELECT id FROM user_data WHERE email_id=:email_id"), [{"email_id":email}])

        # audio check
        audioData = file.file.read() #binary data

        if(len(result.all())==0):
            return {"status":"fail"}
        
        # then we need to work with the audio sample for the final validation.
    
    return {"status":"success"}

# This will check whether that email is in the db or not.
class Email(BaseModel):
    email:Annotated[str, "Email to validate"]

@app.post("/validateEmail/")
async def validateEmail(Email:Email):

    # Retrieving the record from that eamil.
    # if we get the email record from the db, return succes and three random sentences
    # else return fail and no sentences

    with engine.connect() as conn:
        result = conn.execute(text("SELECT id FROM user_data WHERE email_id=:email_id"),[{"email_id":Email.email}])

        if(len(result.all())):
            sentence = generate_random_sentence()

            return {'status':'success', 'sentence':sentence}

    return {'status': "fail"}


# This is for the validation of the user
@app.post("/validateUser/")
async def validateUser(files: Annotated[List[UploadFile], File(description="Multiple wav files to upload, for user validation")]):
    return {'status': "success"}
