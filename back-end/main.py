from fastapi import FastAPI, File, UploadFile, Form
from typing_extensions import Annotated
import time
from typing import List

app = FastAPI()

@app.get("/")
async def root():
    return {"message":"Hello world"}

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