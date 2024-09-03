const approvalTable = require('../model/approver');
const userTable = require('../model/user');
const { Op } = require('sequelize');
const { getFirebaseAdmin } = require('../service/firebase');
const responseFormat = require('../util/response_format');
const { Sequelize } = require('../util/sqlz');
const response_format = require('../util/response_format');

const approvalRequestCount = async (req, res) => {
    try {

        const outlet = req.params.outlet;
        const approvalData = await approvalTable.findAll({
            where: {
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

const requestApproval = async (req, res) => {
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
            where: {
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

        if (userApprove.length < 1) {
            res.send(responseFormat(false, null, 'Tidak ada user spv/ kapten yang login'));
            return;
        }

        userApprove.forEach((item) => {
            tokenList.push(item.token)
        });

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
            .then((response) => {
                //  console.log('BERHASIL '+response);
            })
            .catch((err) => {
                console.log('GAGAL ' + err)
            })
        refreshApproval(outlet);
        res.send(responseFormat(true, null));
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const getApprovalRequest = async (req, res) => {
    try {
        const outlet = req.query.outlet;

        const approvalData = await approvalTable.findAll({
            where: {
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

const confirmApproval = async (req, res) => {
    try {
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;
        const approver = req.body.user;

        const updateState = await approvalTable.update({
            state: 2,
            approver: approver
        },
            {
                where: {
                    outlet: outlet,
                    state: 1,
                    id_approval: id_approval
                },
                raw: true
            });
        if (updateState[0] == 0) {
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }
        const approvalRequest = await approvalTable.findOne({
            where: {
                outlet: outlet,
                id_approval: id_approval
            },
            raw: true
        });

        const userData = await userTable.findOne({
            where: {
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
            .then((response) => {
                //do nothing
            })
            .catch((err) => {
                console.log('Gagal mengirim sinyal ' + err.message);
            });
        refreshApproval(outlet);
        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        res.send(responseFormat(false, null, err.message))
    }
}

const rejectApproval = async (req, res) => {
    try {
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;
        const approver = req.body.user;

        const updateState = await approvalTable.update({
            state: 3,
            approver: approver
        },
            {
                where: {
                    outlet: outlet,
                    state: 1,
                    id_approval: id_approval
                },
                raw: true
            });

        if (updateState[0] == 0) {
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }

        const approvalRequest = await approvalTable.findOne({
            where: {
                outlet: outlet,
                id_approval: id_approval
            },
            raw: true
        });

        const userData = await userTable.findOne({
            where: {
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
            .then((response) => {
                //do nothing
            })
            .catch((err) => {
                console.log('Gagal mengirim sinyal ' + err.message);
            });

        refreshApproval(outlet).
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

const cancelApproval = async (req, res) => {
    try {

        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;

        const updateState = await approvalTable.update({
            state: 0,
        },
            {
                where: {
                    outlet: outlet,
                    state: 1,
                    id_approval: id_approval
                },
                raw: true
            });

        if (updateState[0] == 0) {
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }

        refreshApproval(outlet);

        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const finishApproval = async (req, res) => {
    try {
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;

        const updateState = await approvalTable.update({
            state: 4
        },
            {
                where: {
                    outlet: outlet,
                    state: 2,
                    id_approval: id_approval
                },
                raw: true
            });

        if (updateState[0] == 0) {
            res.send(responseFormat(false, null, 'Permintaan tidak ada'));
            return
        }

        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const timeoutApproval = async (req, res) => {
    try {
        const outlet = req.params.outlet;

        const approvalCount = await approvalTable.findOne({
            attributes: [
                [Sequelize.literal('IFNULL(COUNT(*),0)'), 'approval_count']
            ],
            where: {
                outlet: outlet,
                state: 1
            },
            raw: true
        });
        console.log(approvalCount)
        res.send(responseFormat(true, null, 'Berhasil'))
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const refreshApproval = async (outlet) => {
    try {
        let tokenList = [];
        const admin = getFirebaseAdmin();

        const userApprove = await userTable.findAll({
            where: {
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

        if (userApprove.length < 1) {
            return;
        }

        userApprove.forEach((item) => {
            tokenList.push(item.token)
        });

        const message = {
            data: {
                type: "3",
            },
            tokens: tokenList
        };

        admin.messaging().sendMulticast(message)
            .then((response) => {
                //  console.log('BERHASIL '+response);
            })
            .catch((err) => {
                console.log('GAGAL ' + err)
            })
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
        console.log('Fail send approval refresher ' + err.message);
    }
}

const stateApproval = async (req, res) => {
    try {

        const outlet = req.query.outlet;
        const id = req.query.id_approval;


        const approvalRequest = await approvalTable.findOne({
            where: {
                outlet: outlet,
                id_approval: id
            },
            raw: true
        });

        res.send(responseFormat(true, null, `${approvalRequest.state}`));
    } catch (err) {
        res.send(responseFormat(false, null, err.message));
    }
}

const addNote = async (req, res) => {
    try {
        const outlet = req.params.outlet;
        const id_approval = req.params.id_approval;
        const reason = req.body.reason;

        await approvalTable.update(
            {
                reason: reason
            },
            {
                where: {
                    outlet: outlet,
                    state: 1,
                    id_approval: id_approval
                },
                raw: true
            }
        );
        res.send(response_format(true, null, reason));
        refreshApproval(outlet);
        /*
        let tokenList = [];
        const admin = getFirebaseAdmin();
        const userApprove = await userTable.findAll({
            where: {
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

        if (userApprove.length < 1) {
            return;
        }

        userApprove.forEach((item) => {
            tokenList.push(item.token)
        });

        const message = {
            data: {
                type: "4",

            },
            tokens: tokenList
        };

        admin.messaging().sendMulticast(message)
            .then((response) => {
                //  console.log('BERHASIL '+response);
            })
            .catch((err) => {
                console.log('GAGAL ' + err)
            })*/

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
    timeoutApproval,
    stateApproval,
    addNote
}