var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  migrate: 'safe', // don't drop on app restart in development mode
  attributes: {
    // username  : { type: 'string', unique: true }, // Do we need username?
    email: { type: 'email',  unique: true, required: true },
    name: {type: 'string', required: true},
    photo: {type: 'string', url: true, required: true},
    passports : { collection: 'Passport', via: 'user' },
    isAdmin: {type: 'boolean', required: true}
  }
};

module.exports = User;
