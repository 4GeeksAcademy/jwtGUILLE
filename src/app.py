from flask import Flask, jsonify
from flask_cors import CORS
from api.models import db
from api.routes import setup_routes

def create_app():
    app = Flask(__name__)
    
    # Configuración de la base de datos
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///project.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = 'tu-clave-secreta-aqui'
    
    # Inicializar extensiones
    db.init_app(app)
    CORS(app)  # Esto permite requests desde React
    
    # Configurar rutas
    setup_routes(app)
    
    # Crear tablas en la base de datos
    with app.app_context():
        db.create_all()
    
    # Ruta de health check
    @app.route('/health')
    def health():
        return jsonify({"status": "healthy", "service": "backend"})
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3001, debug=True)