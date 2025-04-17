const APIError = require('./APIError');

////// global error handler
const globalErrorHandler= (err,req,res,next)=>{
    console.error(`Error: ${err.message}`) // debugging

    if(err instanceof APIError){
        return res.status(err.statusCode).json(err.toJson());
    }


    // unexpected errors

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Sssssserver Error",
        error: {
            statusCode: err.statusCode || 500,
            timestamp: new Date().toISOString()
        }
    });
}


module.exports = {
    globalErrorHandler
};