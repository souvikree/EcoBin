const Bin = require('../models/bin.model');
const Driver = require('../models/driver.model');
const { sendNotification } = require('../service/notification');

const getBinStatus = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }
        res.status(200).json(bin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllBins = async (req, res) => {
    try {
      const bins = await Bin.find();
      res.status(200).json(bins);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  const getBinById = async (req, res) => {
    try {
      const bin = await Bin.findById(req.params.id);
      if (!bin) {
        return res.status(404).json({ message: 'Bin not found' });
      }
      res.status(200).json(bin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const notifyDrivers = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        if (bin.notified) {
            return res.status(400).json({ message: 'Drivers already notified' });
        }

        const drivers = await Driver.find();

        drivers.forEach(driver => {
            sendNotification(driver, `Bin at ${bin.location.coordinates} is full.`);
        });

        bin.notified = true;
        await bin.save();

        res.status(200).json({ message: 'Drivers notified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const acceptTask = async (req, res) => {
    try {
        const bin = await Bin.findById(req.params.id);
        if (!bin) {
            return res.status(404).json({ message: 'Bin not found' });
        }

        if (bin.acceptedBy) {
            return res.status(400).json({ message: 'Task already accepted' });
        }

        bin.acceptedBy = req.driver._id;
        await bin.save();

        res.status(200).json({ message: 'Task accepted successfully', bin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
  

module.exports = {
    getBinStatus,
    getAllBins,
    getBinById,
    notifyDrivers,
    acceptTask,
};
