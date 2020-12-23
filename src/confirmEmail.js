const AnswerModel = require("./model.js");

const confirmEmail = async (email) => {
  // update answer
  const condition = { email }
  , update = { confirm_email: true}
  , options = { multi: false };

  await AnswerModel.update(condition, update, options)
  .then(data => {
    console.log('updated data: ', data);
    return 'confirm';
  })
  .catch(e => {
    console.log(e);
    return e;
  });
}

module.exports = confirmEmail;