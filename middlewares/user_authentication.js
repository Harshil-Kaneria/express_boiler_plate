const { User } = require('./../models')

const validateUserToken = async () => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return helpers.response('Unauthorized', false, 'Unauthorized for access this route', {});
    }

    const token = authHeader.split(' ')[1];
    try {
        let result = helpers.jwt_token.verifyToken(token)

        if(!result.valid) return helpers.response('Forbidden',false,'Please login again',{})
        const decoded = result.decoded

        let user = await User.findOne({
            where: { uuid:decoded.uuid, email:decoded.email ,isDeleted: false }
        });
        if (!user) return helpers.response('Not Found', false, 'User not found', {});

        user = user.get({ plain: true });
        if (!user.isVerified) return helpers.response('Unauthorized', false, 'User is not verified', {});

        req.user = user;
        next();
    } catch (error) {
        return helpers.response('Internal Server Error',false,'Something went wrong',{})
    }
}

module.exports = { validateUserToken }