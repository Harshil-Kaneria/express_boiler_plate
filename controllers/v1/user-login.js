
// const Joi = require('joi');
// const inputs = {
//     body: {
//         email: Joi.string().email().required(),
//         password: Joi.string().required(),
//     }
// }
module.exports = () => {
    // validate(inputs)

    console.log('asd',req.body)
    let data = {
        name:'harshil aa',
        age:27,
        gender:"male"
    }
    helpers.response('OK',true,'okay',data,"encrypt")
}