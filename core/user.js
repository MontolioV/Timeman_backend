class User {
    constructor({email, timeIntervals}) {
        this.email = email;
        this.timeIntervals = timeIntervals;
        if (!timeIntervals) {
            this.timeIntervals = [];
        }
    }

}

module.exports = User;