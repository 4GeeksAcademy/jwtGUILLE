from flask import request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from .models import db, User

def setup_routes(app):
    jwt = JWTManager(app)
    
    @app.route('/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            print("Datos recibidos:", data)  # Debug
            
            if not data or not data.get('email') or not data.get('password'):
                return jsonify({"msg": "Email y contraseña son requeridos"}), 400
            
            # Verificar si el usuario ya existe
            existing_user = User.query.filter_by(email=data['email']).first()
            if existing_user:
                return jsonify({"msg": "El usuario ya existe"}), 400
            
            # Crear nuevo usuario
            new_user = User()
            new_user.email = data['email']
            new_user.set_password(data['password'])
            
            db.session.add(new_user)
            db.session.commit()
            
            return jsonify({"msg": "Usuario creado exitosamente"}), 201
            
        except Exception as e:
            db.session.rollback()
            print("Error:", str(e))  # Debug
            return jsonify({"msg": "Error creando usuario", "error": str(e)}), 500

    @app.route('/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            print("Login data:", data)  # Debug
            
            if not data or not data.get('email') or not data.get('password'):
                return jsonify({"msg": "Email y contraseña son requeridos"}), 400
            
            user = User.query.filter_by(email=data['email']).first()
            
            if not user:
                return jsonify({"msg": "Usuario no encontrado"}), 401
            
            if not user.check_password(data['password']):
                return jsonify({"msg": "Contraseña incorrecta"}), 401
            
            # Crear token de acceso
            access_token = create_access_token(identity=user.id)
            
            return jsonify({
                "msg": "Login exitoso",
                "token": access_token,
                "user": {
                    "id": user.id,
                    "email": user.email
                }
            }), 200
            
        except Exception as e:
            print("Login error:", str(e))  # Debug
            return jsonify({"msg": "Error en el login", "error": str(e)}), 500

    @app.route('/protected', methods=['GET'])
    @jwt_required()
    def protected():
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({"msg": "Usuario no encontrado"}), 404
            
            return jsonify({
                "msg": "Acceso permitido",
                "user": {
                    "id": user.id,
                    "email": user.email
                }
            }), 200
            
        except Exception as e:
            return jsonify({"msg": "Error accediendo a ruta protegida", "error": str(e)}), 500

    @app.route('/test', methods=['GET'])
    def test():
        return jsonify({"message": "Test route working"})