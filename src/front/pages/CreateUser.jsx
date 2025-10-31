import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { newUser } from '../API';

const CreateUser = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await newUser(formData);
            alert("Usuario registrado exitosamente. Por favor inicia sesión.");
            navigate('/login');
        } catch (error) {
            alert(error.message || "Error en el registro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Registro</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="ejemplo@correo.com"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Mínimo 6 caracteres"
                                        minLength="6"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Registrando...' : 'Registrarse'}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;