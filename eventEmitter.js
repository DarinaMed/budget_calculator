// module.exports = {
//     EventEmiter
// };

export default class EventEmiter {
    constructor() {
        this._events = {};
    }

    removeEventListener(eventName, removedCallback) {
        if (!this._events[eventName]) {
            return ;
        }

        this._events[eventName] = this._events[eventName]
            .filter(callback => callback !== removedCallback);
    }

    addEventListener(eventName, callback) {
        if (!this._events[eventName]) {
            this._events[eventName] = [];
        }

        this._events[eventName].push(callback);
    }

    dispatch(eventName) {
        if (!this._events[eventName]) {
            return ;
        }

        this._events[eventName].forEach(
            callback => callback.call(this, { target: this })
        );
    }
}
