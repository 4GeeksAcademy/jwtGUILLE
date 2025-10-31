const backendURL = import.meta.env.VITE_BACKEND_URL || "https://weary-spider-q7xqj5g5g4grf67xj-3001.app.github.dev";

console.log("Backend URL:", backendURL); // Debug

export const newUser = async (userData) => {
    try {
        console.log("Enviando registro:", userData); // Debug
        const response = await fetch(`${backendURL}/register`, {
            method: "POST",
            body: JSON.stringify({ 
                "email": userData.email, 
                "password": userData.password 
            }),
            headers: { 
                "Content-Type": "application/json" 
            }
        });
        
        const data = await response.json();
        console.log("Respuesta registro:", data); // Debug
        
        if (!response.ok) {
            throw new Error(data.msg || "Error en el registro");
        }
        
        return data;
    } catch (error) {
        console.error("Error registrando usuario", error);
        throw error;
    }
}

export const loginUser = async (userData, navigate) => {
    try {
        console.log("Enviando login:", userData); // Debug
        const response = await fetch(`${backendURL}/login`, {
            method: "POST",
            body: JSON.stringify({ 
                "email": userData.email, 
                "password": userData.password 
            }),
            headers: { 
                "Content-Type": "application/json" 
            }
        });
        
        const data = await response.json();
        console.log("Respuesta login:", data); // Debug
        
        if (!response.ok) {
            throw new Error(data.msg || "Error en el login");
        }
        
        const token = data.token;
        sessionStorage.setItem("token", token);
        console.log("Token guardado:", token); // Debug
        
        navigate("/private");
        return data;
    } catch (error) {
        console.error("Login Error", error);
        alert(error.message || "Login fallido");
        throw error;
    }
}

export const protectedRoute = async () => {
    try {
        const token = sessionStorage.getItem("token");
        console.log("Token para protected:", token); // Debug
        
        if (!token) {
            return false;
        }
        
        const response = await fetch(`${backendURL}/protected`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        const data = await response.json();
        console.log("Respuesta protected:", data); // Debug
        
        return response.ok;
    } catch (error) {
        console.error("Error de acceso a la ruta protegida", error);
        return false;
    }
}

// Función de prueba para verificar conexión
export const testConnection = async () => {
    try {
        const response = await fetch(`${backendURL}/test`);
        const data = await response.json();
        console.log("Test connection:", data);
        return data;
    } catch (error) {
        console.error("Test connection failed:", error);
        return null;
    }
}