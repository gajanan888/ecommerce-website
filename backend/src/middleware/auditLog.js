const AuditLog = require('../models/AuditLog');

const auditLog = (action, entity) => {
  return async (req, res, next) => {
    // Capture original send
    const originalSend = res.send;

    res.send = function (data) {
      // Only log if request was successful (status < 400)
      if (res.statusCode < 400) {
        const changes = {
          method: req.method,
          body: req.body,
          params: req.params,
        };

        AuditLog.create({
          admin: req.user?.id,
          action,
          entity,
          entityId: req.params.id || req.body.id,
          changes,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        }).catch((err) => console.error('Audit log error:', err));
      }

      // Call original send
      return originalSend.call(this, data);
    };

    next();
  };
};

module.exports = auditLog;
