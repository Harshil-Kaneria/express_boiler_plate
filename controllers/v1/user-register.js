const { User } = require('./../../models')

const validateInputs = (data) => Joi.object({
    username : Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
}).validate(data)

module.exports = async () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)

        let [user, created] = await User.findOrCreate({
            where: { email: value.email,isDeleted: false },
            defaults: value
        });

        if(created || user.dataValues.isVerified==false){
            const data = await user.generateOtp();
            if(data.status) helpers.send_mail.sendMail(user.email,`Verification otp for ${process.env.APP_NAME}`,'otp',{otp:data.otp})
        }
        
        value.uuid = user.dataValues.uuid
        created ? helpers.response('Created',true,'User created successfully',value) : helpers.response('Conflict',false,'User already exist please login',value)
        
    }catch(error){
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}