from flask import Flask

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/demo')
def demo():
    return 'This is a demo route.'

if __name__ == '__main__':
    app.run(debug=True)