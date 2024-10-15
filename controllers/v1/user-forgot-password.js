const { User } = require('./../../models')

const validateInputs = (data) => Joi.object({
    email: Joi.string().email().required()
}).validate(data)

module.exports = async () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)

        let user = await User.findOne({
            attributes: ['email','uuid'],
            where: { email: value.email , isDeleted: false }
        });
        if (!user)  return helpers.response('Not Found', false, 'User not found', {});

        user = user.get({ plain: true });

        const name = "John Doe";  // Fetch user's name from your database
        const verificationLink = "https://example.com/verify?token=abc123";

        helpers.send_mail.sendMail(user.email,`Verification for this ${process.env.APP_NAME}`,'verification',{ name: name, verificationLink: verificationLink })
        
        helpers.response('OK',true,'okay',value)
    }catch(error){
        console.log("🚀 ~ module.exports= ~ error:", error)
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}