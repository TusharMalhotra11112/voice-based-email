import librosa
import numpy as np
from fastdtw import fastdtw
import matplotlib.pyplot as plt

def extract_mfcc(audio_file):
    audio, sample_rate = librosa.load(audio_file)
    mfcc = librosa.feature.mfcc(y=audio, sr=sample_rate)
    return mfcc

def dtw_distance(mfcc1, mfcc2):
    _, dist = fastdtw(mfcc1.T, mfcc2.T)
    return dist

def find_overlap(dist, dist1):
    total_overlap = sum(1 for i in dist if i in dist1)
    percentage = (total_overlap / len(dist)) * 100
    return total_overlap, percentage

'''
params:

db_audio_paths = ["path_to_audio1", "path_to_audio2", "path_to_audio3"]
sample_audio_path = path to sample audio for the varification.

Return value:
True (if the voice matches)
False (if the voice does not match)
'''

def voiceRecognition(db_audio_paths, sample_audio_path):
    
    # checking the length of the audio_files 
    if(len(db_audio_paths)!=3):
        return False
    
    # Extracting mfcc from the .wav files
    voiceprints = {
        "user1": extract_mfcc(db_audio_paths[0]),
        "user2": extract_mfcc(db_audio_paths[1]),
        "user3": extract_mfcc(db_audio_paths[2])
    }

    verification_sample = extract_mfcc(sample_audio_path)

    dist = [(x, x) for x in range(70,201)]
    dist1 = dtw_distance(voiceprints["user1"],verification_sample)
    dist2 = dtw_distance(voiceprints["user2"],verification_sample)
    dist3 = dtw_distance(voiceprints["user3"],verification_sample)

    overlap_dist_dist1, percentage_dist_dist1 = find_overlap(dist, dist1)
    overlap_dist_dist2, percentage_dist_dist2 = find_overlap(dist, dist2)
    overlap_dist_dist3, percentage_dist_dist3 = find_overlap(dist, dist3)

    if overlap_dist_dist1 >=10 or overlap_dist_dist2 >=10 or overlap_dist_dist3 >=10:
        return True

    return False
