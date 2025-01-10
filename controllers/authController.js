const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

// exports.userLogin = async (request, response) => {
//   try {
//   } catch (error) {}
//   const { email, password } = request.body;

//   const user = await User.findOne({ username });
//   const passwordCorrect =
//     user === null ? false : await bcrypt.compare(password, user.passwordHash);

//   if (!(user && passwordCorrect)) {
//     return response.status(401).json({
//       error: 'invalid username or password',
//     });
//   }

//   const userForToken = {
//     username: user.username,
//     id: user._id,
//   };

//   const token = jwt.sign(userForToken, process.env.SECRET, {
//     expiresIn: 60 * 60,
//   });

//   response
//     .status(200)
//     .send({ token, username: user.username, name: user.name });
// };

exports.userRegister = async (request, response) => {
  try {
    const { email, username, password } = request.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return response.status(400).json({
        error: 'email already in use',
      });
    }

    const user = new User({ email, username, password });

    await user.save();

    response.status(201).json({ message: 'user created' });
  } catch (error) {
    console.error(error);
  }
};
