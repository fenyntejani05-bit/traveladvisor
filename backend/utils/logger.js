const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

// Helper to mask sensitive fields in objects/messages (passwords, tokens, keys)
const maskSensitiveData = (data) => {
  if (typeof data !== 'object' || data === null) {
    if (typeof data === 'string') {
      // Simple regex masking for potential password/secret strings in queries
      return data.replace(/(password|token|secret|jwt)\s*=\s*['"][^'"]+['"]/gi, '$1=***');
    }
    return data;
  }

  const masked = { ...data };
  const sensitiveKeys = ['password', 'token', 'secret', 'jwt', 'authorization', 'cookie'];

  for (const key of Object.keys(masked)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      masked[key] = '***';
    } else if (typeof masked[key] === 'object') {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }
  return masked;
};

const formatMessage = (level, message, meta) => {
  const cleanMeta = meta ? maskSensitiveData(meta) : null;
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message: typeof message === 'string' ? maskSensitiveData(message) : message,
    ...(cleanMeta ? { meta: cleanMeta } : {})
  });
};

const writeLog = (level, message, meta) => {
  const formatted = formatMessage(level, message, meta);
  
  // Console output
  if (process.env.NODE_ENV !== 'test') {
    if (level === 'ERROR') {
      console.error(`🔴 [${level}] ${message}`, meta || '');
    } else {
      console.log(`ℹ️ [${level}] ${message}`, meta || '');
    }
  }

  // File output
  try {
    fs.appendFileSync(combinedLogPath, formatted + '\n');
    if (level === 'ERROR') {
      fs.appendFileSync(errorLogPath, formatted + '\n');
    }
  } catch (err) {
    console.error('Failed to write to log files:', err.message);
  }
};

const logger = {
  info: (message, meta) => writeLog('INFO', message, meta),
  error: (message, meta) => writeLog('ERROR', message, meta),
  warn: (message, meta) => writeLog('WARN', message, meta),
};

module.exports = logger;
