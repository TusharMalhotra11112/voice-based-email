import nltk
from nltk.corpus import stopwords
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.probability import FreqDist
from nltk.tokenize.treebank import TreebankWordDetokenizer

# nltk.download('punkt')
# nltk.download('stopwords')
def preprocess_text(text):
    # Tokenize the text into sentences and words
    sentences = sent_tokenize(text)
    words = word_tokenize(text)

    # Remove stop words
    stop_words = set(stopwords.words('english'))
    filtered_words = [word.lower() for word in words if word.isalnum() and word.lower() not in stop_words]

    return sentences, filtered_words

def summarize_email(email_body, num_sentences=3):
    sentences, filtered_words = preprocess_text(email_body)

    # Calculate word frequencies
    word_frequencies = FreqDist(filtered_words)

    # Calculate sentence scores based on word frequencies
    sentence_scores = {}
    for sentence in sentences:
        for word, freq in word_frequencies.items():
            if word.lower() in sentence.lower():
                if sentence in sentence_scores:
                    sentence_scores[sentence] += freq
                else:
                    sentence_scores[sentence] = freq

    # Get the top 'num_sentences' sentences as the summary
    summary_sentences = sorted(sentence_scores, key=sentence_scores.get, reverse=True)[:num_sentences]

    # Detokenize the summary sentences
    summary = TreebankWordDetokenizer().detokenize(summary_sentences)

    return summary

# Example usage:
email_body = """
Dear Manager,

I trust this email finds you well. I am writing to request a one-week leave of absence from work, starting from November 17, 2023. The reason for my request is that my sister is getting married, and I would like to take this time to be with my family and participate in the joyous occasion.

I understand the importance of my responsibilities at work and assure you that I will make every effort to complete any pending tasks before my departure. I will also ensure a smooth handover of my duties to [colleague's name or team] to minimize any impact on ongoing projects.

During my absence, I will be reachable in case of any urgent matters that may require my attention. I will provide my contact information to the team and will promptly respond to emails or calls related to critical issues.

I appreciate your understanding and support in granting me this time off to celebrate this significant event with my family. I am committed to ensuring that my absence will not adversely affect the team's productivity, and I will do my best to wrap up any loose ends before leaving.

If there are any specific procedures or forms that need to be completed for this leave request, please let me know, and I will take care of them promptly.

Thank you for considering my request, and I look forward to your guidance on the next steps.

Best regards,

Sameer
analyst
[Your Contact Information]
"""

summary = summarize_email(email_body)
print(summary)