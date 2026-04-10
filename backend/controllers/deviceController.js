// backend/controllers/deviceController.js
const anedya = require('../services/anedyaService');

const handleAnedyaError = (res, error) => {
  console.error('[Anedya Error]', error.message);
  return res.status(500).json({
    message: error.message || 'Anedya Platform Error',
    reasonCode: error.reasonCode || 'UNKNOWN'
  });
};

const getDevices = async (req, res, next) => {
  try {
    const devices = await anedya.getDevices();
    return res.status(200).json(devices);
  } catch (error) {
    return handleAnedyaError(res, error);
  }
};

const getDeviceData = async (req, res, next) => {
  try {
    const data = await anedya.getDeviceData(req.params.id);
    return res.status(200).json(data);
  } catch (error) {
    return handleAnedyaError(res, error);
  }
};

const getDeviceStatus = async (req, res, next) => {
  try {
    const status = await anedya.getDeviceStatus(req.params.id);
    return res.status(200).json(status);
  } catch (error) {
    return handleAnedyaError(res, error);
  }
};

const getHistoricalData = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.query;
    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'startTime and endTime are required' });
    }
    const data = await anedya.getHistory(req.params.id, startTime, endTime);
    return res.status(200).json(data);
  } catch (error) {
    return handleAnedyaError(res, error);
  }
};

const controlRelay = async (req, res, next) => {
  try {
    if (typeof req.body.state !== 'boolean') {
      return res.status(422).json({ message: 'Invalid state parameter' });
    }
    const result = await anedya.controlRelay(req.params.id, req.body.state);
    return res.status(200).json({
      success: true,
      state: req.body.state,
      deviceId: req.params.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return handleAnedyaError(res, error);
  }
};

const getAnedyaToken = async (req, res) => {
  try {
    const roleName = req.user.roleName;
    const nodeId = process.env.ANEDYA_NODE_ID;

    const tokenData = await anedya.generateAccessToken(roleName, nodeId);
    return res.status(200).json({
      success: true,
      token: tokenData.token,
      expiresAt: tokenData.expiresAt,
      role: roleName
    });
  } catch (err) {
    return handleAnedyaError(res, err);
  }
};

module.exports = {
  getDevices,
  getDeviceData,
  getDeviceStatus,
  getHistoricalData,
  controlRelay,
  getAnedyaToken
};