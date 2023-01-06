export default class DateFormater {
    constructor(dateObj = null) {
        if(dateObj)
            this.date = dateObj;
        this.date = new Date();
    }
    // Returns YY-MM-DD hh:mm:ss string
    regularFormat() {
        return this.date.toLocaleDateString('lt-LT') + " " + this.date.toLocaleTimeString('lt-LT');
    }
}