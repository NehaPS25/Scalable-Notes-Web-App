from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# CORS config to allow frontend
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})

# Config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI') or 'sqlite:///db.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') or 'dev-secret'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)

# Initialize
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# ---------------- Models ----------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def to_dict(self):
        return {"id": self.id, "name": self.name, "email": self.email}

class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def to_dict(self):
        return {"id": self.id, "title": self.title, "body": self.body, "owner_id": self.owner_id}

# ---------------- Auth Routes ----------------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json(force=True) or {}
    name = str(data.get('name') or "").strip()
    email = str(data.get('email') or "").strip().lower()
    password = str(data.get('password') or "")

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400
    if len(password) < 6:
        return jsonify({"msg": "Password must be >=6 chars"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "User already exists"}), 409

    pw_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    user = User(name=name, email=email, password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user": user.to_dict()}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json(force=True) or {}
    email = str(data.get('email') or "").strip().lower()
    password = str(data.get('password') or "")

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=user.id)
    return jsonify({"access_token": token, "user": user.to_dict()})


# ---------------- Notes CRUD ----------------
@app.route('/api/notes', methods=['POST', 'GET'])
@jwt_required()
def notes():
    user_id = get_jwt_identity()

    # CREATE note
    if request.method == 'POST':
        data = request.get_json(force=True) or {}
        title = str(data.get('title') or "").strip()
        body = str(data.get('body') or "").strip()

        if not title:
            return jsonify({"msg": "Title required"}), 400

        note = Note(title=title, body=body, owner_id=user_id)
        db.session.add(note)
        db.session.commit()
        return jsonify(note.to_dict()), 201

    # GET notes (optional search)
    q = str(request.args.get('q') or "").strip()
    query = Note.query.filter_by(owner_id=user_id)
    if q:
        query = query.filter((Note.title.ilike(f'%{q}%')) | (Note.body.ilike(f'%{q}%')))
    notes_list = [n.to_dict() for n in query.order_by(Note.updated_at.desc()).all()]
    return jsonify(notes_list)

@app.route('/api/notes/<int:note_id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def note_detail(note_id):
    user_id = get_jwt_identity()
    note = Note.query.filter_by(id=note_id, owner_id=user_id).first()
    if not note:
        return jsonify({"msg": "Note not found"}), 404

    # GET single note
    if request.method == 'GET':
        return jsonify(note.to_dict())

    # UPDATE note
    if request.method == 'PUT':
        data = request.get_json(force=True) or {}
        title = str(data.get('title') or note.title).strip()
        body = str(data.get('body') or note.body).strip()

        if not title:
            return jsonify({"msg": "Title required"}), 400

        note.title = title
        note.body = body
        db.session.commit()
        return jsonify(note.to_dict())

    # DELETE note
    if request.method == 'DELETE':
        db.session.delete(note)
        db.session.commit()
        return jsonify({"msg": "deleted"})

# ---------------- Health ----------------
@app.route('/api/health')
def health():
    return jsonify({"status": "ok"})


# ---------------- Main ----------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
app.py
app.py
app.py
