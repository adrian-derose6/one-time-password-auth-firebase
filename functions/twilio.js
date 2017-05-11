const twilio = require('twilio');

const accountSid = 'ACef58d73e0261486db8f27c3be259bc0a';
const authToken = 'adbabc9c847aed84119f532b2783bdcb';

module.exports = new twilio.Twilio(accountSid, authToken);
