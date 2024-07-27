const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('productAdded', (data) => {
    console.log('Event: ', data.message);
});

eventEmitter.on('productDeleted', (data) => {
    console.log('Event: ', data.message);
});

eventEmitter.on('userSignedUp', (data) => {
    console.log('Event: ', data.message);
});

module.exports = eventEmitter;