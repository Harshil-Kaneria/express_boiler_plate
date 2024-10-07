const validateInputs = (data) => Joi.object({}).validate(data)

module.exports = () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)

        let user_data = req.user

        delete user_data.id
        delete user_data.uuid
        delete user_data.verification_token
        delete user_data.isVerified
        delete user_data.isDeleted
        
        helpers.response('OK',true,'User login successfully',user_data)
    }catch(error){
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}