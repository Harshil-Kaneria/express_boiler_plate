const whitelist = []; // For all urls
// const whitelist = ['http://example1.com', 'http://example2.com']; // For specific urls

module.exports = {
  origin: function (origin, callback) {
    if (whitelist.length === 0 || whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
