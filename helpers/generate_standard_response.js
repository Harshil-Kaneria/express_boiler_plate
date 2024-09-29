module.exports = (status,message,data) => {
    return {
        status : status || false,
        message: message || 'Response message not found',
        response : data || {}
    }
}