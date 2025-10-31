from flask import request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from .models import db, User

def setup_routes(app):
    jwt = JWTManager(app)
    
    # Configuración del JWT
    app.config["JWT_SECRET_KEY"] = "super-secret-key-change-in-production"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    
    # RUTA RAIZ PARA VERIFICAR QUE EL BACKEND FUNCIONA
    @app.route('/')
    def home():
        return jsonify({
            "message": "✅ Backend funcionando correctamente", 
            "status": "active",
            "endpoints": {
                "register": "/api/register (POST)",
                "login": "/api/login (POST)", 
                "protected": "/api/protected (GET)"
            }
        })
    
    # RUTA DE PRUEBA PARA LA API
    @app.route('/api/test')
    def test():
        return jsonify({"message": "✅ API funcionando correctamente"})
    
    @app.route('/api/register', methods=['POST'])
    def register():
        try:
            data = request.get_json()
            
            if not data or not data.get('email') or not data.get('password'):
                return jsonify({"msg": "Email y contraseña son requeridos"}), 400
            
            # Verificar si el usuario ya existe
            if User.query.filter_by(email=data['email']).first():
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
            return jsonify({"msg": "Error creando usuario", "error": str(e)}), 500

    @app.route('/api/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
            if not data or not data.get('email') or not data.get('password'):
                return jsonify({"msg": "Email y contraseña son requeridos"}), 400
            
            user = User.query.filter_by(email=data['email']).first()
            
            if not user or not user.check_password(data['password']):
                return jsonify({"msg": "Credenciales inválidas"}), 401
            
            # Crear token de acceso
            access_token = create_access_token(identity=user.id)
            
            return jsonify({
                "msg": "Login exitoso",
                "token": access_token,
                "user": user.serialize()
            }), 200
            
        except Exception as e:
            return jsonify({"msg": "Error en el login", "error": str(e)}), 500

    @app.route('/api/protected', methods=['GET'])
    @jwt_required()
    def protected():
        try:
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({"msg": "Usuario no encontrado"}), 404
            
            return jsonify({
                "msg": "Acceso permitido",
                "user": user.serialize()
            }), 200
            
        except Exception as e:
            return jsonify({"msg": "Error accediendo a ruta protegida", "error": str(e)}), 500