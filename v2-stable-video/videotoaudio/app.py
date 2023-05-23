from flask import Flask, request,jsonify
from flask_cors import CORS
import os
import subprocess
import mimetypes


app = Flask(__name__)
CORS(app)
@app.route("/")
def hello():
	return "Hello Geeks!! from Google Colab"

@app.route('/upload', methods=['POST'])
def upload():
    video_file = request.files.get('video')
    if video_file:
        video_filename = video_file.filename
        video_save_path = os.path.join('uploads', video_filename)
        video_file.save(video_save_path) 
        audio_save_path = os.path.join('uploads', os.path.splitext(video_filename)[0] + '.mp3')
        subprocess.call(['ffmpeg', '-i', video_save_path, '-vn', '-acodec', 'libmp3lame', audio_save_path])
        emotion( video_file)
     
def emotion(video_file):
    return jsonify({'emotions': "Happy"})
if __name__ == "__main__":
    app.run(debug=True)
