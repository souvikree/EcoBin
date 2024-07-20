const mqtt = require('mqtt');
const Bin = require('./models/bin.model');
const Notification = require('./models/notfication.model');
const Driver = require('./models/driver.model');
const geolib = require('geolib');

const client = mqtt.connect(process.env.MQTT_BROKER_URL);

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('sensor/ultrasonic/distance', (err) => {
        if (!err) {
            console.log('Subscribed to topic: sensor/ultrasonic/distance');
        }
    });
});

client.on('message', async (topic, message) => {
    if (topic === 'sensor/ultrasonic/distance') {
        const distance = parseFloat(message.toString());
        console.log(`Received distance: ${distance}`);

        if (distance > 100) {
            const bin = await Bin.findOneAndUpdate(
                { location: 'Bin Location 1' },
                { status: 'overflowing', lastUpdated: new Date() },
                { new: true, upsert: true }
            );

            const drivers = await Driver.find();
            drivers.forEach(async driver => {
                const driverLocation = {
                    latitude: driver.location.coordinates[1],
                    longitude: driver.location.coordinates[0]
                };

                const binLocation = {
                    latitude: bin.location.coordinates[1],
                    longitude: bin.location.coordinates[0]
                };

                const distanceToBin = geolib.getDistance(driverLocation, binLocation);

                const notification = new Notification({
                    bin: bin._id,
                    driver: driver._id,
                    message: `Bin is full! Please empty it!! The bin is ${distanceToBin} meters away from your location.`
                });
                await notification.save();
                // Send notification to driver (e.g., via email, SMS, etc.)
                //want to send notifiaction in application
            });
        }
    }
});

module.exports = client;
