const { User } = require('./../../models')

const validateInputs = (data) => Joi.object({
    public_id: Joi.string().required(),
    otp: Joi.number().integer().min(6).required()
}).validate(data)

module.exports = async () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)
        
        let user = await User.findOne({
            attributes: ['uuid','username','email','password','isVerified','otp'],
            where: { uuid: value.public_id , isDeleted: false }
        });
        if (!user)  return helpers.response('Not Found', false, 'User not found', {});

        user = user.get({ plain: true });
        if (user.isVerified) return helpers.response('Unauthorized', false, 'User is already verified', {});

        const isOTPValid = await user.validateOTP(value.otp);
        if (!isOTPValid) return helpers.response('Unauthorized', false, 'Invalid otp', {});

        await User.update({ isVerified: true,otp:null }, {
            where: { uuid: user.uuid }
        });
            
        delete user.password
        delete user.isVerified
        delete user.otp

        helpers.response('OK',true,'User verified successfully',{user})
    }catch(error){
        console.log("🚀 ~ module.exports= ~ error:", error)
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}