const ratingTable = require('../model/transaction/rating');
const memberTable = require('../model/membership/MasterMember');
const responseFormat = require('../util/response_format');
const moment = require('moment')

const insertRating = async(req, res) =>{
    try {

        const inv = req.body.invoice;
        const outlet = req.body.outlet;
        const member = req.body.member;
        const rate = req.body.rate;
        const reason = req.body.reason;
        const microseconds = (moment().valueOf() * 1000).toString();
        
        const memberData = await memberTable.findOne({
            where:{
                MemberID: member
            },
            raw: true
        });
        
        await ratingTable.upsert({
            outlet: outlet,
            invoice: inv,
            token: microseconds,
            customer: `${memberData.FirstName} ${memberData.LastName}`,
            phone: memberData.HP,
            message: 'FROM FO APPS',
            rate: rate,
            reason: reason,
            state: '1'
        });

        res.send(responseFormat(true, null))
    } catch (err) {
        res.status(500).send(responseFormat(false, null ,err.message))
        console.error(`
        insertRating
            err: ${err}
            message: ${err.message}
            stack: ${err.stack}
        `)
    }
}

const ratedCheck = async(req, res) =>{
    try {
        const inv = req.params.invoice;
        const outlet = req.params.outlet;
        
        const isRated = await ratingTable.findOne({
            where:{
                outlet: outlet,
                invoice: inv
            },
            raw: true
        });

        if(isRated){
            res.send(responseFormat(false, null))            
        }else{
            res.send(responseFormat(true, null))
        }
    } catch (err) {
        res.status(500).send(responseFormat(false, null ,err.message))
        console.error(`
        insertRating
            err: ${err}
            message: ${err.message}
            stack: ${err.stack}
        `)
    }
}

module.exports = {
    insertRating,
    ratedCheck
}