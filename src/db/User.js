const userSchema = {
  username: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    required: true
  }
};

module.exports = userSchema;