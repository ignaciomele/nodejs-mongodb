
const fetchUser = async email => await User.findOne({ email })

module.exports.fetchUser = fetchUser