const APIError = require('./APIError');


const asyncHandler =(api)=>{
    return async (req,res,next)=>{
        try{
            await api(req,res,next);
        }catch(err){
            console.log(`Error: ${err.message}`);

            // handle known err
            if (err instanceof APIError){
                return res.status(err.statusCode).json(err.toJson());
            }

            // handle unknown error
          const error = new APIError(err.message||'Internal server errrrror',err.statusCode||500);
          return res.status(error.statusCode).json(error.toJson());
        }
            
    }
}


module.exports = {
    asyncHandler
};