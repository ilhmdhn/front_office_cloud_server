const approvalTable = require('../model/approver');
const userTable = require('../model/user');
const {Op} = require('sequelize');
const {getFirebaseAdmin} = require('../service/firebase');
const responseFormat = require('../util/response_format');

const approvalRequestCount = async(req, res)=>{
    try {

        const outlet = req.params.outlet;
        const approvalData = await approvalTable.findAll({
            where:{
                outlet: outlet,
                state: 1
            },
            raw: true
        });

        res.send(responseFormat(true, null, `${approvalData.length}`))
    } catch (err) {
        res.send(responseFormat(true, null, err.message))        
    }
}

const requestApproval = async(req, res) =>{
    try {
        const outlet = req.body.outlet;
        const id = req.body.id;
        const user = req.body.user;
        const reception = req.body.reception;
        const room = req.body.room;
        const note = req.body.note;        
        let tokenList = [];

        const admin = getFirebaseAdmin();

        await approvalTable.create({
            outlet: outlet,
            id_approval: id,
            user: user,
            room: room,
            reception: reception,
            note: note,
            state: 1
        });

        const userApprove = await userTable.findAll({
            where:{
                [Op.or]: [
                    { level: 'ACCOUNTING' },
                    { level: 'SUPERVISOR' },
                    { level: 'KAPTEN' },
                  ],
                outlet: outlet,
                login_state: '1'
            },
            raw: true
        });

        userApprove.forEach((item)=>{
            tokenList.push(item.token)
        });
        console.log(tokenList)
        const message = {
            data: {
                type: "2",
                code: "2",
                state: 'true',
                Title: "Permintaan Persetujuan",
                Message: `${user} Meminta Persetujuan ${note}`
            },
            tokens: tokenList
        };

         admin.messaging().sendMulticast(message)
        .then((response)=>{
            //  console.log('BERHASIL '+response);
        })
        .catch((err)=>{
             console.log('GAGAL '+err)
        })
    
        res.send(responseFormat(true, null));
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const getApprovalRequest = async(req, res) =>{
    try {
        const outlet = req.query.outlet;

        const approvalData = await approvalTable.findAll({
            where:{
                outlet: outlet,
                state: 1
            },
            raw: true
        });

        res.send(responseFormat(true, approvalData));
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const confirmApproval = async(req, res) =>{
    try {
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;
        const approver = req.body.user;

        const updateState = await approvalTable.update({
            state: 2,
            approver: approver
        },
        {
            where:{
                outlet: outlet,
                state: 1,
                id_approval: id_approval
            },
            raw: true
        });
        if(updateState[0] == 0){
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }
        const approvalRequest = await approvalTable.findOne({
            where:{
              outlet: outlet,
              id_approval: id_approval
            },
            raw: true
        });

        const userData = await userTable.findOne({
            where:{
                outlet: outlet,
                id: approvalRequest.user
            },
            raw: true
        });

        const admin = getFirebaseAdmin();

        const message = {
            data: {
                type: "1",
                code: id_approval,
                state: 'true',
                Title: "Persetujuan Approval",
                Message: `${approver} menyetujui permintaan ${userData.id}`
            },
            token: userData.token
        };

        admin.messaging().send(message)
        .then((response)=>{
            //do nothing
        })
        .catch((err)=>{
            console.log('Gagal mengirim sinyal '+err.message);
        });
        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        res.send(responseFormat(false, null, err.message))
    }
}

const rejectApproval = async(req, res) =>{
    try {
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;
        const approver = req.body.user;

        const updateState = await approvalTable.update({
            state: 3,
            approver: approver
        },
        {
            where:{
                outlet: outlet,
                state: 1,
                id_approval: id_approval
            },
            raw: true
        });

        if(updateState[0] == 0){
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }
        
        const approvalRequest = await approvalTable.findOne({
            where:{
              outlet: outlet,
              id_approval: id_approval
            },
            raw: true
        });

        const userData = await userTable.findOne({
            where:{
                outlet: outlet,
                id: approvalRequest.user
            },
            raw: true
        });

        const admin = getFirebaseAdmin();

        const message = {
            data: {
                type: "1",
                code: id_approval,
                state: 'false',
                Title: "Permintaan ditolak",
                Message: `${approver} Menolak permintaan ${userData.id}`
            },
            token: userData.token
        };

        admin.messaging().send(message)
        .then((response)=>{
            //do nothing
        })
        .catch((err)=>{
            console.log('Gagal mengirim sinyal '+err.message);
        });
        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        console.log(`
            reject approval error
            err: ${err}
            err.message: ${err.message}
            err.stack: ${err.stack}
        `);
        res.send(responseFormat(false, null, err.message))
    }
}

const cancelApproval = async(req, res)=>{
    try {
        
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;

        const updateState = await approvalTable.update({
            state: 0,
        },
        {
            where:{
                outlet: outlet,
                state: 1,
                id_approval: id_approval
            },
            raw: true
        });

        if(updateState[0] == 0){
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }

        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const finishApproval = async(req, res)=>{
    try {
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;

        const updateState = await approvalTable.update({
            state: 4
        },
        {
            where:{
                outlet: outlet,
                state: 2,
                id_approval: id_approval
            },
            raw: true
        });

        if(updateState[0] == 0){
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }

        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const timeoutApproval = async(req, res)=>{
    try {
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;

        const updateState = await approvalTable.update({
            state: 5
        },
        {
            where:{
                outlet: outlet,
                state: 1,
                id_approval: id_approval
            },
            raw: true
        });

        if(updateState[0] == 0){
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }

        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

module.exports = {
    approvalRequestCount,
    requestApproval,
    getApprovalRequest,
    confirmApproval,
    rejectApproval,
    cancelApproval,
    finishApproval,
    timeoutApproval
}