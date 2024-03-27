const approvalTable = require('../model/approver');
const userTable = require('../model/approver');

const requestApproval = async(req, res) =>{
    try {
        const outlet = req.body.outlet;
        const id = req.body.id;
        const user = req.body.user;
        const reception = req.body.reception;
        const note = req.body.note;        

    } catch (err) {
        
    }
}

const confirmApproval = async(req, res) =>{

}

const cancelApproval = async(req, res)=>{
    try {
        
    } catch (err) {
        
    }
}

const finishApproval = async(req, res)=>{
    try {
        
    } catch (err) {
        
    }
}