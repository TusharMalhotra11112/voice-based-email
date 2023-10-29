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


voiceprints = {
    "user1": extract_mfcc("sam1.wav"),
    "user2": extract_mfcc("sam2.wav"),
    "user3": extract_mfcc("sam3.wav")
}
verification_sample = extract_mfcc("tushar1.wav")

dist = [(x, x) for x in range(70,201)]
dist1 = dtw_distance(voiceprints["user1"],verification_sample)
dist2 = dtw_distance(voiceprints["user2"],verification_sample)
dist3 = dtw_distance(voiceprints["user3"],verification_sample)

# print(nparr)
# plt.plot(nparr)
# plt.show()
# nparr = np.transpose(nparr)
# print(dist)


# plt.ylim(0,200)
# plt.xlim(0,200)
# plt.plot([0,200],[0,200],color="purple")

# for i in dist1:
#       plt.plot(i[0],i[1],marker='o',color="red",alpha=0.3)
# for i in dist2:
#       plt.plot(i[0],i[1],marker='o',color="blue",alpha=0.3)
# for i in dist3:
#       plt.plot(i[0],i[1],marker='o',color="green",alpha=0.3)


overlap_dist_dist1, percentage_dist_dist1 = find_overlap(dist, dist1)
overlap_dist_dist2, percentage_dist_dist2 = find_overlap(dist, dist2)
overlap_dist_dist3, percentage_dist_dist3 = find_overlap(dist, dist3)

print("Overlap between dist and dist1:")
print("Total Overlapping Coordinates:", overlap_dist_dist1)
print("Percentage of Overlap:", percentage_dist_dist1, "%")

print("Overlap between dist and dist2:")
print("Total Overlapping Coordinates:", overlap_dist_dist2)
print("Percentage of Overlap:", percentage_dist_dist2, "%")

print("Overlap between dist and dist3:")
print("Total Overlapping Coordinates:", overlap_dist_dist3)
print("Percentage of Overlap:", percentage_dist_dist3, "%")


if overlap_dist_dist1 >=10 or overlap_dist_dist2 >=10 or overlap_dist_dist3 >=10:
    print("matched")
else:
    print("not matched")
