const userTable = require('../model/user');
const responseFormat = require('../util/response_format');
const sqlz = require('../util/sqlz');

const insertUserLogin = async(req, res) =>{
    try{
        const outlet = req.body.outlet;
        const user_id = req.body.user_id;
        const user_level = req.body.user_level;
        const token = req.body.token;
        const device = req.body.device;

        await userTable.upsert({
            outlet: outlet,
            id: user_id,
            level: user_level,
            token: token,
            device: device,
            login_state: 1,
            last_login: sqlz.literal('now()')
        });
        res.send(responseFormat(true, null))
    }catch(err){
        res.status(500).send(responseFormat(false, null, err.message))
    }
}

module.exports = {
    insertUserLogin
}