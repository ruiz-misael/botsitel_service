import jwt from "jsonwebtoken";

/**
 * Middleware de autenticación con JWT
 */
const authenticateJWT = (req, res, next) => {
  const SECRET_KEY = process.env.SECRET_KEY;

  // Obtener el header de autorización
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Acceso no autorizado" });
  }

  // Validar formato del header: "Bearer <token>"
  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Formato de token no válido" });
  }

  // Verificar el JWT
  jwt.verify(token, SECRET_KEY, (err, usuario) => {
    if (err) {
      console.error("Error en la verificación del JWT:", err.message);
      const message =
        err.name === "TokenExpiredError"
          ? "Token expirado"
          : "JWT inválido";
      return res.status(401).json({ error: message });
    }

    // Almacenar la información del usuario en la solicitud
    req.usuario = usuario;
    next();
  });
};

export default authenticateJWT;
