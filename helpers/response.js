const { getStatusCode } = require("http-status-codes");

module.exports = (status_code,status,message,data,type="encrypt") => {
    res.status(getStatusCode(status_code)).send(helpers.crypto(helpers.generate_standard_response(status,message,data),type));
}