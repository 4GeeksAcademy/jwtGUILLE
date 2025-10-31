import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { protectedRoute } from '../API';

const Private = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await protectedRoute();
            
            if (!isAuthenticated) {
                alert('Debes iniciar sesión para acceder a esta página');
                navigate('/login');
            } else {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p className="mt-2">Verificando autenticación...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">🔐 Área Privada</h3>
                            <button 
                                className="btn btn-light btn-sm"
                                onClick={handleLogout}
                            >
                                🚪 Cerrar Sesión
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-success">
                                <h4>✅ ¡Acceso concedido!</h4>
                                <p className="mb-0">Has accedido exitosamente al área protegida.</p>
                            </div>
                            
                            <div className="mt-4">
                                <h5>Información de la sesión:</h5>
                                <div className="alert alert-info">
                                    <strong>Token JWT:</strong> 
                                    <br />
                                    <small>{sessionStorage.getItem('token')?.substring(0, 50)}...</small>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <h5>Características implementadas:</h5>
                                <ul>
                                    <li>✅ Autenticación JWT</li>
                                    <li>✅ Protección de rutas</li>
                                    <li>✅ Manejo de sesiones</li>
                                    <li>✅ Validación de tokens</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Private;