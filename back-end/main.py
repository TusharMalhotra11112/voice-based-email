from fastapi import FastAPI, File, UploadFile
from typing_extensions import Annotated
import time
from typing import List

app = FastAPI()

@app.get("/")
async def root():
    return {"message":"Hello world"}

# this controller will upload multiple wav files
@app.post("/upload/")
async def upload(files: Annotated[List[UploadFile], File(description="Multiple wav files to upload")]):

    storedFileNames: List[str] = []

    for file in files:
        data = file.file.read()
        ext = file.filename[-4:]

        targetFileName = "uploads/" + file.filename[0:-4] + str(time.time()).split('.')[0] + ext

        targetFile = open(targetFileName, "wb")
        targetFile.write(data)

        storedFileNames.append(file.filename)

    return {"uploadedFiles": storedFileNames}