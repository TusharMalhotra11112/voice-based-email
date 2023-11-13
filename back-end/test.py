from sqlalchemy import create_engine, text, URL
import librosa
import io
import wave
import numpy as np
import scipy.io.wavfile
import soundfile as sf
from scipy.io.wavfile import write


# password_file = open("password.txt", "r")
# password = password_file.readline()

# engine = create_engine(password)


# function to create sample.wav file from the database. 
# def createWavFile():
#     with engine.connect() as conn:
#         result = conn.execute(text("SELECT audio_1 FROM user_data WHERE id = 3;"))

#         data = result.all()
            
#         audioBinary = data[0][0]
#         audio_input = b''
#         d = 
#         # print(audioBinary)
#         # audio, sample_rate = librosa.load(io.BytesIO(audioBinary).read())
#         # file = open("sample.wav", "wb")
#         # file.write(audioBinary)
    
# createWavFile()


def convert_bytearray_to_wav_ndarray(input_bytearray: bytes, sampling_rate=16000):
    bytes_wav = bytes()
    byte_io = io.BytesIO(bytes_wav)
    write(byte_io, sampling_rate, np.frombuffer(input_bytearray, dtype=np.int16))
    output_wav = byte_io.read()
    output, samplerate = sf.read(io.BytesIO(output_wav))
    return output

path = "/home/shobhit/Desktop/cllgwork/voice-based-email/back-end/uploads/audio_1_1699506891.wav"
# path = "/home/shobhit/Desktop/cllgwork/voice-based-email/back-end/uploads/real.wav"
# chunk = 1024

# wf = wave.open(path, 'rb')
# audio_input = b''
# d = wf.readframes(chunk)
# while len(d)>0:
#     d = wf.readframes(chunk)
#     audio_input = audio_input + d

# print(audio_input)

data, samplerate = sf.read(path)
sf.write(path, data, samplerate)



