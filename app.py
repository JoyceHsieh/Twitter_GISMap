# Load libraries
from flask import Flask, jsonify
import joblib
from flask_bootstrap import Bootstrap
from flask import render_template, redirect, url_for, request, send_from_directory, flash
import pandas as pd
import os
import requests
import json
import sklearn
import nlp_model
from keras.models import load_model

#Set up Flask
TEMPLATE_DIR = os.path.abspath('templates')
STATIC_DIR = os.path.abspath('static')
# instantiate flask 
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)
app.secret_key="gis_twitter_secret_"
app.config['SESSION_COOKIE_SECURE'] = False
Bootstrap(app)
model = load_model("nlpmodel.h5")
print ('Model loaded')


@app.route('/')
def home():
    return render_template('index.html', title='homepage')



@app.route('/nlpmodel',  methods=['GET', 'POST'])
def nlpmodel():
    if request.method == 'POST':
        loca=request.form['location']
        text=str(request.form['twitter'])
        print(text)
        
        model_prediction = nlp_model.predict(text)
        print(model_prediction)
        # flash(model_prediction)
    
    return render_template('index.html', title='homepage', prediction=model_prediction, show_modal=True)






if __name__ == '__main__':

    app.run(debug=True)
