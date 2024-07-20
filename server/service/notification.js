const sendNotification = (driver, message) => {
    
    console.log(`Sending notification to ${driver.name}: ${message}`);
  };
  
  module.exports = {
    sendNotification,
  };
  