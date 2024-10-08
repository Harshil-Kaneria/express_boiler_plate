const { User } = require('./../../models')

const validateInputs = (data) => Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
}).validate(data)

module.exports = async () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)

        let user = await User.findOne({
            attributes: ['uuid','username','email','password','isVerified'],
            where: { email: value.email , isDeleted: false }
        });
        if (!user)  return helpers.response('Not Found', false, 'User not found', {});

        const isPasswordValid = await user.validatePassword(value.password);
        if (!isPasswordValid) return helpers.response('Unauthorized', false, 'Invalid password', {});
        
        user = user.get({ plain: true });
        if (!user.isVerified) return helpers.response('Unauthorized', false, 'User is not verified', {});
        
        const token = helpers.jwt_token.generateToken({
            uuid:user.uuid,
            email:user.email
        })

        delete user.password
        delete user.isVerified
        helpers.response('OK',true,'User login successfully',{...user,token})
    }catch(error){
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}