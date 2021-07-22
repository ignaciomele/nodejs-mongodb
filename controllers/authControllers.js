const { fetchUser } = require('../services/authServices')

//Controller
const logInUser = async (req, res) => { 
    try {
        const user = await fetchUser(req.body.email) //service
        if (!user) return res.status(404).json({ msj: 'User or password are incorrect.' })
        const { _id, name, email, password } = user
        if (!bcrypt.compareSync(req.body.password, password)) return res.status(403).json({ msj: 'User or password are incorrect.' })
        const jwToken = jwt.sign({
            data: {
                _id,
                name,
                email
            }
        }, config.get('configToken.SEED'), { expiresIn: config.get('configToken.expiration') })
        res.json({
            user: {
                _id,
                name,
                email
            },
            jwToken
        })
    } catch (err) {
        res.status(400).json({ msj: 'Error on server' + err })
    }
}
module.exports.logInUser = logInUser