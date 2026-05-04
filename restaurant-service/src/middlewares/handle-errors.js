export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: err.message
    });
};

export const notFound = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
};

export const requestLogger = (req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.log(`${req.method} ${req.path}`);
    }
    next();
};