const backendURL = import.meta.env.VITE_BACKEND_URL;

export const newUser = async (change) => {
    try {
        const response = await fetch(`${backendURL}/register`, {
            method: "POST",
            body: JSON.stringify({ "email": change.email, "password": change.password }),
            headers: { "Content-Type": "application/json" }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error registrando usuario", error)
    }
}

export const loginUser = async (change, navigate) => {
    try {
        const response = await fetch(`${backendURL}/login`, {
            method: "POST",
            body: JSON.stringify({ "email": change.email, "password": change.password }),
            headers: { "Content-Type": "application/json" }
        })
        const data = await response.json()
        
        if (data.token) {
            const token = data.token
            sessionStorage.setItem("token", token)
            navigate("/private")
        } else {
            alert(data.msg || "Login fallido")
        }
    } catch (error) {
        console.error("Login Error", error)
        alert("Login fallido")
    }
}

export const protectedRoute = async () => {
    try {
        const token = sessionStorage.getItem("token")
        const response = await fetch(`${backendURL}/protected`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        
        if (response.ok) {
            return true            
        } else {
            return false
        }
    } catch (error) {
        console.error("Error de acceso a la ruta protegida", error)
        return false
    }
}