// backend/services/anedyaService.js
'use strict';

const axios = require('axios');

const BASE_URL = process.env.ANEDYA_API_URL || 'https://api.ap-in-1.anedya.io/v1';
const API_KEY = process.env.ANEDYA_API_KEY;
const NODE_ID = process.env.ANEDYA_NODE_ID;

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRMED CORRECT from diagnostic tests:
//   variable names use the EXACT identifier set in Anedya console (capital first)
//   Your console shows: "Temperature" and "Humidity"
// ─────────────────────────────────────────────────────────────────────────────
const VAR_TEMP = 'Temperature';
const VAR_HUM = 'Humidity';

// ── Axios client ──────────────────────────────────────────────────────────────
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

client.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status ?? 'NETWORK';
    const path = error.config?.url ?? 'unknown';
    const reason = error.response?.data?.reasonCode ?? '';
    process.stderr.write(`[anedya] ${status} ${path} ${reason}\n`);
    throw error;
  }
);

const generateReqId = () => Math.random().toString(36).slice(2, 10);

// ─────────────────────────────────────────────────────────────────────────────
// 1. GET DEVICES (node list)
//    Confirmed working in Test 1 of original diagnostic
// ─────────────────────────────────────────────────────────────────────────────
const getDevices = async () => {
  const { data } = await client.post('/node/list', {
    reqId: generateReqId()
  });

  if (!data.success) {
    const err = new Error(data.error || 'Failed to list nodes');
    err.reasonCode = data.reasonCode;
    throw err;
  }

  return (data.nodes || []).map(node => ({
    id: node.nodeid || node.id,
    name: node.nodeName || node.name || `Node ${(node.nodeid || node.id || '').slice(0, 8)}`
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. GET LATEST VALUE FOR ONE VARIABLE
//    CONFIRMED: nodes array + variable = exact console name (capital)
//    Returns: { success, data: { value, timestamp } or {}, variable: "..." }
// ─────────────────────────────────────────────────────────────────────────────
const getLatestVariable = async (variableName) => {
  const { data } = await client.post('/data/latest', {
    nodes: [NODE_ID],
    variable: variableName   // "Temperature" or "Humidity" — exact console name
  });

  if (!data.success) {
    const err = new Error(data.error || 'Failed to get latest data');
    err.reasonCode = data.reasonCode;
    throw err;
  }

  // data.data is {} when no data submitted yet (device not connected)
  const entry = data.data;
  if (!entry || typeof entry !== 'object' || Object.keys(entry).length === 0) {
    return null; // No data yet — device hasn't submitted anything
  }

  return {
    value: entry.value,
    timestamp: entry.timestamp
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. GET LATEST TEMP + HUMIDITY TOGETHER
// ─────────────────────────────────────────────────────────────────────────────
const getDeviceData = async (nodeId) => {
  const [tempResult, humResult] = await Promise.allSettled([
    getLatestVariable(VAR_TEMP),
    getLatestVariable(VAR_HUM)
  ]);

  const temp = tempResult.status === 'fulfilled' ? tempResult.value : null;
  const hum = humResult.status === 'fulfilled' ? humResult.value : null;

  return {
    temperature: temp?.value ?? null,
    humidity: hum?.value ?? null,
    timestamp: temp?.timestamp || hum?.timestamp || null
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. DEVICE ONLINE/OFFLINE STATUS via Heartbeat
//    CONFIRMED: /heartbeat/status works, returns "" when no heartbeat yet
//    When device is active, will return { online: true/false, ... }
// ─────────────────────────────────────────────────────────────────────────────
const getDeviceStatus = async (nodeId) => {
  // Get relay state from ValueStore (already confirmed working)
  const relayState = await getRelayState(nodeId).catch(() => 'UNKNOWN');

  try {
    const { data } = await client.post('/heartbeat/status', {
      nodeid: nodeId,
      threshold: 120   // seconds — device online if heartbeat in last 2 min
    });

    // Heartbeat returns "" (empty string) when no heartbeat received yet
    if (!data || data === '' || typeof data !== 'object') {
      return { online: false, relayState, lastSeen: null };
    }

    return {
      online: data.online ?? false,
      relayState,
      lastSeen: data.lastSeen || null
    };

  } catch (heartbeatErr) {
    // Fallback: use latest data timestamp to infer online status
    const tempData = await getLatestVariable(VAR_TEMP).catch(() => null);
    const ts = tempData?.timestamp;
    let online = false;

    if (ts) {
      const lastSeenMs = typeof ts === 'number' ? ts : new Date(ts).getTime();
      online = (Date.now() - lastSeenMs) < 2 * 60 * 1000;
    }

    return {
      online,
      relayState,
      lastSeen: ts ? new Date(typeof ts === 'number' ? ts : ts).toISOString() : null
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. HISTORICAL DATA
//    CONFIRMED FIX: use capitalized variable name + nodes array
//    Timestamps: Unix ms (same pattern as latest endpoint)
// ─────────────────────────────────────────────────────────────────────────────
const getHistoricalVariable = async (variableName, from, to) => {
  const { data } = await client.post('/data/getData', {
    nodes: [NODE_ID],
    variable: variableName,       // "Temperature" or "Humidity"
    starttime: Number(from),       // Unix ms
    endtime: Number(to),         // Unix ms
    limit: 500,
    order: 'asc'
  });

  if (!data.success) {
    const err = new Error(data.error || 'Failed to get historical data');
    err.reasonCode = data.reasonCode;
    throw err;
  }

  // Response shape: data.data = array of { value, timestamp }
  return Array.isArray(data.data) ? data.data : [];
};

const getHistory = async (nodeId, from, to) => {
  const [tempHistory, humHistory] = await Promise.allSettled([
    getHistoricalVariable(VAR_TEMP, from, to),
    getHistoricalVariable(VAR_HUM, from, to)
  ]);

  const tempEntries = tempHistory.status === 'fulfilled' ? tempHistory.value : [];
  const humEntries = humHistory.status === 'fulfilled' ? humHistory.value : [];

  // Merge by timestamp into unified array for charting
  const byTimestamp = new Map();

  for (const entry of tempEntries) {
    const key = String(entry.timestamp);
    const existing = byTimestamp.get(key) || { timestamp: entry.timestamp };
    existing.temperature = entry.value;
    byTimestamp.set(key, existing);
  }

  for (const entry of humEntries) {
    const key = String(entry.timestamp);
    const existing = byTimestamp.get(key) || { timestamp: entry.timestamp };
    existing.humidity = entry.value;
    byTimestamp.set(key, existing);
  }

  return Array.from(byTimestamp.values()).map(item => ({
    timestamp: item.timestamp,
    temperature: item.temperature ?? null,
    humidity: item.humidity ?? null
  }));
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. SEND COMMAND TO DEVICE
//    CONFIRMED: nodeid + command + data + type:"string"
//               expiry = Date.now() + duration_in_ms  (Unix ms timestamp)
// ─────────────────────────────────────────────────────────────────────────────
const sendCommand = async (nodeId, commandName, payload) => {
  const { data } = await client.post('/commands/send', {
    nodeid: nodeId,
    command: commandName,
    data: typeof payload === 'string' ? payload : JSON.stringify(payload),
    type: 'string',
    expiry: Date.now() + (60 * 60 * 1000)   // 1 hour from now, in Unix ms
  });

  if (!data.success) {
    const err = new Error(data.error || 'Failed to send command');
    err.reasonCode = data.reasonCode;
    throw err;
  }

  return { success: true, commandId: data.commandId || null };
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. RELAY CONTROL
//    Sends command + syncs state to ValueStore
// ─────────────────────────────────────────────────────────────────────────────
const controlRelay = async (nodeId, state) => {
  const stateStr = state ? 'ON' : 'OFF';

  const result = await sendCommand(nodeId, 'relay', stateStr);

  // Persist to ValueStore (non-fatal if it fails)
  await setRelayState(nodeId, stateStr).catch(vsErr => {
    process.stderr.write(`[anedya] ValueStore sync failed: ${vsErr.message}\n`);
  });

  return { success: result.success, state: stateStr };
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. VALUESTORE — GET RELAY STATE
//    CONFIRMED: namespace + key → response.value
//    Returns "OFF" as default if key doesn't exist yet
// ─────────────────────────────────────────────────────────────────────────────
const getRelayState = async (nodeId) => {
  try {
    const { data } = await client.post('/valuestore/getValue', {
      namespace: { scope: 'node', id: nodeId },
      key: 'relay_state'
    });

    if (!data.success) return 'OFF';
    return data.value || 'OFF';

  } catch (err) {
    // 404 = key not found yet — default to OFF
    if (err.response?.status === 404) return 'OFF';
    throw err;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. VALUESTORE — SET RELAY STATE
//    CONFIRMED: namespace + key + value + type:"string"  (NOT "datatype")
// ─────────────────────────────────────────────────────────────────────────────
const setRelayState = async (nodeId, stateStr) => {
  const { data } = await client.post('/valuestore/setValue', {
    namespace: { scope: 'node', id: nodeId },
    key: 'relay_state',
    value: stateStr,
    type: 'string'   // CONFIRMED: "type" not "datatype"
  });

  if (!data.success) {
    const err = new Error(data.error || 'Failed to set relay state');
    err.reasonCode = data.reasonCode;
    throw err;
  }

  return true;
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. GENERATE SCOPED ACCESS TOKEN
//     Maps your roleName → Anedya access policy
// ─────────────────────────────────────────────────────────────────────────────
const generateAccessToken = async (roleName, nodeId) => {
  const roleLower = (roleName || '').toLowerCase();

  const policies = {
    viewer: {
      resources: { nodes: [nodeId], variables: [] },
      allow: [
        'data::getlatest',
        'data::gethistorical',
        'data::getsnapshot'
      ]
    },
    operator: {
      resources: { nodes: [nodeId], variables: [] },
      allow: [
        'data::getlatest',
        'data::gethistorical',
        'data::getsnapshot',
        'cmd::sendcommand',
        'cmd::listcommands',
        'cmd::getstatus',
        'vs::getvalue'
      ]
    },
    admin: {
      resources: { nodes: [nodeId], variables: [] },
      allow: [
        'data::getlatest',
        'data::gethistorical',
        'data::getsnapshot',
        'cmd::sendcommand',
        'cmd::listcommands',
        'cmd::getstatus',
        'cmd::invalidate',
        'vs::getvalue',
        'vs::setvalue',
        'vs::scankeys',
        'vs::deletekeys'
      ]
    }
  };

  const policy = policies[roleLower] || policies['viewer'];

  const { data } = await client.post('/access/tokens/create', {
    reqId: generateReqId(),
    expiry: Date.now() + (24 * 60 * 60 * 1000), // 24h in Unix ms
    accesspolicy: policy
  });

  if (!data.success) {
    const err = new Error(data.error || 'Failed to generate access token');
    err.reasonCode = data.reasonCode;
    throw err;
  }

  return { token: data.token, expiresAt: data.expiresAt || null };
};

// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  getDevices,
  getDeviceData,
  getDeviceStatus,
  getHistory,
  controlRelay,
  getRelayState,
  generateAccessToken
};