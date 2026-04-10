// backend/routes/devices.js

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');
const {
  getDevices,
  getDeviceData,
  getDeviceStatus,
  getHistoricalData,
  controlRelay,
  getAnedyaToken       // new
} = require('../controllers/deviceController');

const router = express.Router();

router.use(authenticate);

// Existing routes — untouched
router.get('/', requirePermission('view_dashboard'), getDevices);
router.get('/:id/data', requirePermission('view_dashboard'), getDeviceData);
router.get('/:id/status', requirePermission('view_dashboard'), getDeviceStatus);
router.get('/:id/history', requirePermission('view_analytics'), getHistoricalData);
router.post('/:id/relay', requirePermission('control_devices'), controlRelay);

// New — frontend calls this after login to get scoped Anedya token
router.post('/token', getAnedyaToken);

module.exports = router;