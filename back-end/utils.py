import replicate
import dotenv

dotenv.load_dotenv()


# extract json from a given string
def extractJSON(text: str, start='{', end='}'):
    start_index = text.find(start)
    end_index = text.find(end)

    res = text[start_index:end_index+1]
    return res


# makes request to the model with the given prompt
def make_request(prompt: str):
    if not prompt:
        return None

    # model used meta/llama-2-70b-chat, search it on replicate
    # here the request is made to the selected replicate model
    iterator = replicate.run(
        "meta/llama-2-70b-chat:2d19859030ff705a87c746f7e96eea03aefb71f166725aee39692f1476566d48",
        input={
            "debug": False,
            "top_p": 1,
            "prompt": prompt,
            "temperature": 0.5,
            "system_prompt": "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
            "max_new_tokens": 500,
            "min_new_tokens": -1
        }
    )

    # extracting the chunks of text and putting it inside the output variable.
    output = ""
    for text in iterator:
        output += text

    return output
