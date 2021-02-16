const userModel = {
  id: {
    field: 'id',
    type: dataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    field: 'username',
    unique: true,
    type: dataTypes.STRING,
    allowNull: true
  },
  password: {
    field: 'password',
    type: dataTypes.STRING,
    allowNull: false
  },
  salt: {
    field: 'salt',
    type: dataTypes.STRING,
    allowNull: true
  },
};