import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { protectedRoute } from '../API';

const Private = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await protectedRoute();
            console.log("Auth check result:", isAuthenticated); // Debug
            
            if (!isAuthenticated) {
                alert("No estás autenticado. Redirigiendo al login...");
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
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">🎉 ¡Área Privada!</h3>
                            <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleLogout}
                            >
                                🚪 Cerrar Sesión
                            </button>
                        </div>
                        <div className="card-body">
                            <div className="alert alert-success">
                                <h4>✅ ¡Acceso concedido!</h4>
                                <p>Has accedido exitosamente al contenido protegido.</p>
                            </div>
                            
                            <div className="mb-4">
                                <h5>Información de sesión:</h5>
                                <p><strong>Token:</strong> {sessionStorage.getItem('token') ? '✅ Presente' : '❌ No encontrado'}</p>
                                <small className="text-muted">
                                    Token: {sessionStorage.getItem('token')?.substring(0, 20)}...
                                </small>
                            </div>
                            
                            <div className="alert alert-info">
                                <h6>🔒 Características de seguridad:</h6>
                                <ul className="mb-0">
                                    <li>Autenticación JWT implementada</li>
                                    <li>Validación automática de tokens</li>
                                    <li>Protección de rutas privadas</li>
                                    <li>Logout seguro</li>
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