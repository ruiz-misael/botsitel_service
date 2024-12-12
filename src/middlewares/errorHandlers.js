// middlewares/errorHandlers.js

// Manejo de rutas no encontradas
export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  };
  
  // Manejo de errores generales
  export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
  
    // Logging del error en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ErrorHandler] ${err.message}`);
      if (err.stack) console.error(err.stack);
    }
  
    // Respuesta estandarizada para errores
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Solo incluir stack en desarrollo
    });
  };
  