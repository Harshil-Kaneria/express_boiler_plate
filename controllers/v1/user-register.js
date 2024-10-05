const { User } = require('./../../models')

const validateInputs = (data) => {
    const schema = Joi.object({
        username : Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
}

module.exports = async () => {
    try{
        const { error, value } = validateInputs(req.body)
        if(error) return helpers.response('Bad Request',false,'Please provide proper params',error.details)

        const [user, created] = await User.findOrCreate({
            where: { email: value.email,isDeleted: false },
            defaults: value
        });
        
        created ? helpers.response('Created',true,'User created successfully',value) : helpers.response('Conflict',false,'User already exist please login',value)
        
    }catch(error){
        helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}