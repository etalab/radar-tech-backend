// Filter user from the users array by username and password
const user = await UserModel.find(userData);
if (user !== undefined && user.length === 0) {
    // Generate an access token
    const accessToken = jwt.sign(
      userData, 
      process.env.ACCESS_TOKEN_SECRET,
      {
        algorithm: process.env.ACCESS_TOKEN_ALGORITHM
      });

    // Create a new user
    let newUser = new UserModel({ username, role, accessToken });
    newUser.save(function(err, doc) {
      if (err) {
          return new Error('An error occured inserting a new user : ', err)
      }
      // Return access token
      return `Access Token ${accessToken}`;
    });
    
} else {
  return new Error('User already exists');
}