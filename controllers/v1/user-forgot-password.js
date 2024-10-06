const validateInputs = (data) => Joi.object({
    email: Joi.string().email().required()
}).validate(data)

module.exports = () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)
        
        helpers.response('OK',true,'okay',value)
    }catch(error){
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}