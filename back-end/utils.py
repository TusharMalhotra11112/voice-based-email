import random

# Generate a random sentence
def generate_random_sentence():
    
    # options array for nouns, verbs, adjectives, adverbs
    nouns = ['cat', 'dog', 'house', 'car', 'tree']
    verbs = ['runs', 'jumps', 'sleeps', 'eats', 'drives']
    adjectives = ['happy', 'quick', 'lazy', 'big', 'red']
    adverbs = ['slowly', 'loudly', 'always', 'soon', 'never']
    
    # selecting random noun, verb, adjective and adverb
    subject = random.choice(nouns)
    verb = random.choice(verbs)
    adjective = random.choice(adjectives)
    adverb = random.choice(adverbs)
    
    # creating senteces
    sentence = f"Please repeat the line 'The {adjective} {subject} {verb} {adverb}'."
    
    return sentence