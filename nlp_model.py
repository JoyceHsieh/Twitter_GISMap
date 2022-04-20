#Load model
from keras.models import load_model
model = load_model("nlpmodel.h5")
print ('Model loaded')


import numpy as np 
import pandas as pd

import nltk
nltk.download('punkt')
nltk.download('stopwords')

from nltk.corpus import stopwords

df = pd.read_csv('train_text.txt',header=0, parse_dates=[0], index_col=0, squeeze=True)

from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

train_texts = df

tokenizer = Tokenizer(15212,lower=True,oov_token='UNK')

tokenizer.fit_on_texts(train_texts)

print('Found %d unique words.' % len(tokenizer.word_index))

# texts_to_sequences: Transforms each text in texts to a sequence of integers. 
# It basically takes each word in the text and replaces it with its corresponding integer value from the word_index dictionary.

train_texts_sequences = tokenizer.texts_to_sequences(train_texts)

# pad_sequences: Ensure that all sequences in a list have the same length. 
train_texts_pad_sequences = pad_sequences(train_texts_sequences, maxlen=80, padding='post') 


from nltk.tokenize import word_tokenize
emotions = {'sadness': 0, 'joy': 1, 'surprise': 2, 'love': 3, 'anger': 4, 'fear': 5}

def get_key(value):
    for key,val in emotions.items():
          if (val==value):
            return key

def remove_stopwords(sentence):
    text_tokens = word_tokenize(sentence)
    tokens_without_sw = [word for word in text_tokens if not word in stopwords.words('english')]
    return (" ").join(tokens_without_sw)
        
def predict(sentence):
    sentence = remove_stopwords(sentence.lower())
    print(sentence)
    sentence_lst=[]
    sentence_lst.append(sentence)
    sentence_seq=tokenizer.texts_to_sequences(sentence_lst)
    sentence_padded=pad_sequences(sentence_seq,maxlen=80,padding='post')
    certaintyprediction = model.predict(sentence_padded)[0]
    anlysisidic= {}
    for key,val in emotions.items():
          print(key + ': ' + str(round(certaintyprediction[val]*100, 2)) + ' %')
          anlysisidic[key]= str(round(certaintyprediction[val]*100, 2))
    bestpredictionindex = np.argmax(certaintyprediction)
    certainty = str(round(certaintyprediction[bestpredictionindex]*100, 2))
    print('\nI am '+ certainty + ' % sure the emotion is ' + get_key(bestpredictionindex) + '.')
    anlysisidic['result']= f'I am {certainty} % sure the emotion is {get_key(bestpredictionindex)}.'
    print(anlysisidic)
    return anlysisidic