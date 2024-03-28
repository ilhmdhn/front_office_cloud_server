const express = require("express");
const approvalRoute = express.Router();

const {requestApproval, getApprovalRequest, confirmApproval, rejectApproval, cancelApproval, finishApproval} = require('../controller/approval_controller');

approvalRoute.post('/request', requestApproval);
approvalRoute.get('/list', getApprovalRequest);
approvalRoute.put('/confirm/:outlet/:id_approval', confirmApproval);
approvalRoute.put('/reject/:outlet/:id_approval', rejectApproval);
approvalRoute.put('/cancel/:outlet/:id_approval', cancelApproval);
approvalRoute.put('/finish/:outlet/:id_approval', finishApproval);

module.exports = approvalRoute;