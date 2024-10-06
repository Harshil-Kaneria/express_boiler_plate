const validateInputs = (data) => Joi.object({
    password: Joi.string().min(6).required(),
    new_password: Joi.string().min(6).required().custom((value, helpers) => {
        const { password } = helpers.state.ancestors[0];
        if (value === password) {
            return helpers.error('any.invalid');
        }
        return value;
    }),
    confirm_password: Joi.string().min(6).required().valid(Joi.ref('new_password')),
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