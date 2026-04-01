const getDevices = async (req, res, next) => {
  try {
    const devices = [
      { id: 'device_001', name: 'Living Room Sensor' },
      { id: 'device_002', name: 'Bedroom Sensor' }
    ];
    return res.status(200).json(devices);
  } catch (error) {
    next(error);
  }
};

const getDeviceData = async (req, res, next) => {
  try {
    const baseTemp = req.params.id === 'device_001' ? 24 : 22;
    const baseHum = req.params.id === 'device_001' ? 62 : 55;
    
    return res.status(200).json({
      temperature: baseTemp + (Math.random() - 0.5),
      humidity: baseHum + (Math.random() - 0.5) * 2,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

const getDeviceStatus = async (req, res, next) => {
  try {
    return res.status(200).json({
      online: true,
      relayState: false,
      lastSeen: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

const getHistoricalData = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.query;
    if (!startTime || !endTime) {
      return res.status(400).json({ message: 'startTime and endTime are required' });
    }

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const step = (end - start) / 47; // 48 points -> 47 intervals

    const data = [];
    for (let i = 0; i < 48; i++) {
      const timestamp = new Date(start + step * i).toISOString();
      data.push({
        timestamp,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const controlRelay = async (req, res, next) => {
  try {
    if (typeof req.body.state !== 'boolean') {
      return res.status(422).json({ message: 'Invalid state parameter' });
    }

    return res.status(200).json({
      success: true,
      state: req.body.state,
      deviceId: req.params.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDevices,
  getDeviceData,
  getDeviceStatus,
  getHistoricalData,
  controlRelay
};
