const Bin = require('../models/bin.model');

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

module.exports = {
    getBinStatus
};
