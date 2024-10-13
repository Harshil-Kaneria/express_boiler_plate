const { User } = require('./../../models')

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

module.exports = async () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)

        let user_data = req.user

        let user = await User.findOne({
            attributes: ['uuid','username','email','password','isVerified'],
            where: { id:user_data.id }
        });
        if (!user)  return helpers.response('Not Found', false, 'User not found', {});

        const isPasswordValid = await user.validatePassword(value.password);
        if (!isPasswordValid) return helpers.response('Unauthorized', false, 'Invalid password', {});

        await User.update({ password:value.new_password }, {
            where: { id: user_data.id }
        });
        
        helpers.response('OK',true,'Password updated successfully',{})
    }catch(error){
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}