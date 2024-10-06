const validateInputs = (data) => Joi.object({

}).validate(data)

module.exports = () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)
        
            helpers.response('OK',true,'User login successfully',req.user)
    }catch(error){
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}