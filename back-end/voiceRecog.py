import librosa
import numpy as np
from fastdtw import fastdtw
import matplotlib.pyplot as plt
from typing import List

def extract_mfcc(audio_file):
    audio, sample_rate = librosa.load(audio_file)
    mfcc = librosa.feature.mfcc(y=audio, sr=sample_rate)
    return mfcc

def dtw_distance(mfcc1, mfcc2):
    _, dist = fastdtw(mfcc1.T, mfcc2.T)
    return dist

def plot_dtw(dist, color, label):
    plt.plot([0, 200], [0, 200], color="purple")
    for i in dist:
        plt.plot(i[0], i[1], marker='o', color=color, alpha=0.3, label=label)

def plot_ref(ref, color, label, line_width=2.0, vertical_shift=3):
    for i in ref:
        plt.plot(i[0], i[1] - vertical_shift, marker='o', color=color, alpha=0.3, label=label)
    for i in ref:
        plt.plot(i[0], i[1] + vertical_shift, marker='o', color=color, alpha=0.3, label=label)

def find_overlap(dist, ref_dist):
    total_overlap = sum(1 for i in dist if i in ref_dist)
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
    threshold = 1000

    ref1 = [(x, x - 2) for x in range(70, 201)] + [(x, x - 1) for x in range(70, 201)]  # Adjusted coordinates for ref1
    ref2 = [(x, x + 2) for x in range(70, 201)] + [(x, x + 1) for x in range(70, 201)]  # Adjusted coordinates for ref2

    dist = [(x, x) for x in range(70, 201)] + ref1 + ref2
    dist1 = dtw_distance(voiceprints["user1"],verification_sample)
    dist2 = dtw_distance(voiceprints["user2"],verification_sample)
    dist3 = dtw_distance(voiceprints["user3"],verification_sample)

    overlap_dist_dist1, percentage_dist_dist1 = find_overlap(dist, dist1)
    overlap_dist_dist2, percentage_dist_dist2 = find_overlap(dist, dist2)
    overlap_dist_dist3, percentage_dist_dist3 = find_overlap(dist, dist3)

    if overlap_dist_dist1 >=10 or overlap_dist_dist2 >=10 or overlap_dist_dist3 >=10:
        return True

    return False
