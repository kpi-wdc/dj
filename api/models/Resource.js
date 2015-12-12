

module.exports = {
  attributes: {
  	path: {
  		type: 'string', 
  		required: true
  	},
    owner: {
      type: 'string', 
      required: true
    },
	data: {
      type: 'binary',
      required: false
    }
  }
};
