from fastapi import FastAPI, File, UploadFile, Form
from typing_extensions import Annotated
import time
from typing import List
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

class TestInput(BaseModel):
    buffer:str

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
    return {"message":"Hello world"}

'''
let formData = new FormData();
      formData.append("email", "hello@gmail.com");
      formData.append("password", "password123");
      formData.append("files", audioBlob, "file1.wav");
      formData.append("files", audioBlob, "file2.wav");
      formData.append("files", audioBlob, "file3.wav");

      fetch("http://localhost:8000/register", {
        method: "POST",
        body: formData,
      })
        .then((data) => data.json())
        .then((res) => console.log(res));
'''


# this controller will upload multiple wav files
@app.post("/register/")
async def upload(email:Annotated[str, Form()], password:Annotated[str, Form()], files: Annotated[List[UploadFile], File(description="Multiple wav files to upload")]):

    # email holds the email, password holds the password value and files holds the array files 
    for file in files:
        data = file.file.read()
        ext = file.filename.split('.')[1]

        targetFileName = "uploads/" + file.filename.split('.')[0] + str(time.time()).split('.')[0] + '.' + ext

        targetFile = open(targetFileName, "wb")
        targetFile.write(data)

    return {"status":"success"}





# This will check whether that email is in the db or not.
@app.post("/validateEmail/")
async def validateEmail(email:Annotated[str, "Email to validate"]):
    
    # Retrieving the record from that eamil.
    # if we get the email record from the db, return succes and three random sentences
    # else return fail and no sentences


    return {'status':"success"}






# This is for the validation of the user
@app.post("/validateUser/")
async def validateUser(files:Annotated[List[UploadFile],File(description="Multiple wav files to upload, for user validation")]):
    return {'status':"success"}
