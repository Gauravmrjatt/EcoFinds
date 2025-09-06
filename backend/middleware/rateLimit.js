// Rate limiting middleware to prevent abuse
const rateLimit = (options) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  };

  const opts = { ...defaultOptions, ...options };
  const ipRequests = new Map();

  // Clean up old requests periodically
  setInterval(() => {
    const now = Date.now();
    for (const [ip, requests] of ipRequests.entries()) {
      const validRequests = requests.filter(time => now - time < opts.windowMs);
      if (validRequests.length === 0) {
        ipRequests.delete(ip);
      } else {
        ipRequests.set(ip, validRequests);
      }
    }
  }, opts.windowMs);

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    
    // Get existing requests for this IP
    const requests = ipRequests.get(ip) || [];
    const now = Date.now();
    
    // Filter out requests outside of the current window
    const validRequests = requests.filter(time => now - time < opts.windowMs);
    
    if (validRequests.length >= opts.max) {
      return res.status(429).json({
        success: false,
        message: opts.message
      });
    }
    
    // Add current request timestamp
    validRequests.push(now);
    ipRequests.set(ip, validRequests);
    
    next();
  };
};

module.exports = rateLimit;