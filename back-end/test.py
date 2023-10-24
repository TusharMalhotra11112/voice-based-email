from sqlalchemy import create_engine, text, URL


password_file = open("password.txt", "r")
password = password_file.readline()

engine = create_engine(password)


# function to create sample.wav file from the database. 
def createWavFile():
    with engine.connect() as conn:
        result = conn.execute(text("SELECT audio_1 FROM user_data WHERE id = 2;"))

        data = result.all()

        if(len(data)):
            audioBinary = data[0][0]
            file = open("sample.wav", "wb")
            file.write(audioBinary)
        else:
            print("No data found")
    
createWavFile()