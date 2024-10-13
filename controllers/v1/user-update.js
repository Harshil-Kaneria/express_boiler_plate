const { User } = require('./../../models')

const validateInputs = (data) => Joi.object({
    username: Joi.string().required()
}).validate(data)

module.exports = async () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)
        
        let user_data = req.user

        await User.update(value, {
            where: { id: user_data.id }
        });
        
        helpers.response('OK',true,'Data updated successfully',value)
    }catch(error){
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}