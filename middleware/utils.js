

function validateRequest(checks) {
  return (req,res,next) => {
    const missing = [];
  
    for (const [location, keys] of Object.entries(checks)) {
      const source = req[location];
      keys.forEach(key => {
        if (source === undefined || !(key in source)) {
          missing.push(`${key}`);
        }
      });
    }
    
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required parameter(s): ${missing.join(", ")}`
      });
    }
    return next();
  }
}


export { validateRequest }