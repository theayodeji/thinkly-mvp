// src/lib/events/eventBus.js
import EventEmitter from 'events';

const eventBus = new EventEmitter();

// (Optional) Increase max listeners if you expect many
// eventBus.setMaxListeners(50);

export default eventBus;
