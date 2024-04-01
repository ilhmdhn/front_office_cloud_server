const express = require("express");
const approvalRoute = express.Router();

const {requestApproval, getApprovalRequest, confirmApproval, rejectApproval, cancelApproval, finishApproval, approvalRequestCount, timeoutApproval} = require('../controller/approval_controller');

approvalRoute.post('/request', requestApproval);
approvalRoute.get('/list', getApprovalRequest);
approvalRoute.get('/total/:outlet', approvalRequestCount);
approvalRoute.put('/confirm/:outlet/:id_approval', confirmApproval);
approvalRoute.put('/reject/:outlet/:id_approval', rejectApproval);
approvalRoute.put('/cancel/:outlet/:id_approval', cancelApproval);
approvalRoute.put('/finish/:outlet/:id_approval', finishApproval);
approvalRoute.put('/timeout/:outlet/:id_approval', timeoutApproval);

module.exports = approvalRoute;