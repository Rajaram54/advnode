const Buffer = require('safe-buffer').Buffer;
const KeyGrip = require('keygrip');
const keys = require("../../config/keys");

module.exports = (user) => {
    const sessionObject = {
        passport: {
            user: user._id.toString()
        },
    };
    const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');
    const keygrip = new KeyGrip([keys.cookieKey]);
    const sign = keygrip.sign("session=", sessionString);

    return { session: sessionString, sig: sign };
}