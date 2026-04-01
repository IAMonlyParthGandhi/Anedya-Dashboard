const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requirePermission } = require('../middleware/rbac');
const {
  getDevices,
  getDeviceData,
  getDeviceStatus,
  getHistoricalData,
  controlRelay
} = require('../controllers/deviceController');

const router = express.Router();

router.use(authenticate);

router.get('/', requirePermission('view_dashboard'), getDevices);
router.get('/:id/data', requirePermission('view_dashboard'), getDeviceData);
router.get('/:id/status', requirePermission('view_dashboard'), getDeviceStatus);
router.get('/:id/history', requirePermission('view_analytics'), getHistoricalData);
router.post('/:id/relay', requirePermission('control_devices'), controlRelay);

module.exports = router;
