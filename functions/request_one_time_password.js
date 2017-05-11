const admin = require('firebase-admin');

module.exports = function(req, res) {
  const body = JSON.parse(req.body);

  // Check if phone property exists
  if (!body.phone) {
    return res.status(442).send({ error: 'You must provide a phone number'});
  }
  
  // Get rid of non-digit characters in phone number
  const phone = String(body.phone).replace(/[^\d]/g, '');

  // Find the user model
  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.random() * 8999 + 1000));
    })
    .catch((err) => {
      res.status(422).send({ error: err });
    })
}
