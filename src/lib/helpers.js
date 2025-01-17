import bcrypt from 'bcryptjs';

const helpers = {};

// Function to create the hash of the password
helpers.encryptPassword = async (password) => {
  // Secure encryption
  const salt = await bcrypt.genSalt(10);

  // Generating the hash for login
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Function to verify authentication
helpers.matchPassword = (password, savedPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, savedPassword, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export default helpers;