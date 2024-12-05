const express = require('express');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.get('/unapproved-users', adminController.getUnapprovedUsers);

router.put('/approve-user', adminController.approveUser);

module.exports = router;