const admin = require('firebase-admin');

module.exports = function(req, res) {
  const body = JSON.parse(req.body);

  // Check if phone property exists
  if (!body.phone) {
    return res.status(442).send({ error: 'You must provide a phone number'});
  }

  // Get rid of non-digit characters in "phone" property
  const phone = String(body.phone).replace(/[^\d]/g, '');

  // Find the user model
  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.random() * 8999 + 1000));

      // Send text message of random code to user
      twilio.messages.create({
        body: `Your code is ${code}.`,
        to: phone,
        from: '+16303608073'
      }, (err) => {
        if (err) { return res.status(422).send(err); }

        // Create a user in db with phone number as unique identifier
        // If code is successfully sent, send "success" message to client
        admin.database().ref('users/' + phone)
          .update({ code: code, codeValid: true }, () => {
            res.send({ success: true });
          });
      });
    })
    .catch((err) => {
      res.status(422).send({ error: err });
    })
}
