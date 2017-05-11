const admin = require('firebase-admin');

module.exports = function(req, res) {
  const body = JSON.parse(req.body);

  // Verify that user sent phone number and password
  if (!body.phone || !body.password) {
    return res.status(422).send({ error: 'Phone and code must be provided.' });
  }

  // Format user inputs
  const phone = String(body.phone).replace(/[^\d]/g, '');
  const code = parseInt(code);

  // Fetch user model from Firebase Authentification
  admin.auth().getUser(phone)
    .then(() => {
      // Fetch data model corresponding to user
      const ref = admin.database().ref('users/' + phone)
      ref.on('value', snapshot => {
        const user = snapshot.val();

        // Check if verification code from user request matches with the code in the database
        if (user.code !== code || !user.codeValid) {
          return res.status(422).send({ error: 'Code not valid' });
        }

        // Invalidate verification code inside the database.
        ref.update({ codeValid: false });
      });
    })
    .catch((err) => {
      res.status(422).send({ error: err });
    })
}
