class TimeInterval {
    constructor({start = new Date(), end, duration}) {
        this.start = start;
        this.end = end;
        this.duration = duration;
    }

    estimatedEnd(hours = 0, minutes = 0) {
        let result = new Date(this.start);
        result.setHours(result.getHours() + hours);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    }

    closeInterval(end = new Date()) {
        const HOUR_IN_MS = 3600000;
        const MINUTE_IN_MS = 60000;
        const SECOND_IN_MS = 1000;

        console.log(end);
        this.end = end;
        const durationObj = {};
        let durationInMs = this.end - this.start;

        durationObj.h = Math.floor(durationInMs / HOUR_IN_MS);
        durationInMs = durationInMs % HOUR_IN_MS;
        durationObj.m = Math.floor(durationInMs / MINUTE_IN_MS);
        durationInMs = durationInMs % MINUTE_IN_MS;
        durationObj.s = Math.floor(durationInMs / SECOND_IN_MS);

        this.duration = durationObj;
    }
}

module.exports = TimeInterval;