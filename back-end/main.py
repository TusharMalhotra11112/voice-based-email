from fastapi import FastAPI, File, UploadFile, Form
from typing_extensions import Annotated
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine, text, URL


# db_url format: mysql+pymysql://<db_user>:<password>@<host>/<db_name>
engine = create_engine("mysql+pymysql://root:shobhit#2002@localhost:3306/voicebaseddata")

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


# This will check whether that email is in the db or not.
@app.post("/validateEmail/")
async def validateEmail(email: Annotated[str, "Email to validate"]):

    # Retrieving the record from that eamil.
    # if we get the email record from the db, return succes and three random sentences
    # else return fail and no sentences

    return {'status': "success"}


# This is for the validation of the user
@app.post("/validateUser/")
async def validateUser(files: Annotated[List[UploadFile], File(description="Multiple wav files to upload, for user validation")]):
    return {'status': "success"}
