const bcrypt = require('bcryptjs');
const { User } = require('../../../models');

module.exports = async (req, res) => {
    const id = req.accountId;
    const account = await User.findOne({ where: { id }});
    if (!req.body.password) {
        res.json('Password is required')
    } else {
        if(!await bcrypt.compare(req.body.password, account.password)) {
            res.json('Password is invalid')
        } else if (!req.body.newPassword){
            delete req.body.password;
            await account.update(req.body);
            account.password = 'secret';
            res.json(account)
        } else {
            req.body.password = await bcrypt.hash(req.body.newPassword, 10);
            account.update(req.body);
            res.json('Password updated successfully')
        }
    }
}
