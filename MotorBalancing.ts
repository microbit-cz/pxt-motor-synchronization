class MotorBalancing {
    static readonly UPDATE_INTERVAL = 1000;
    static readonly AVG_LENGTH = 10;
    static readonly SPEED_THRESHOLD = 20;

    speedLeft: number;
    speedRight: number;
    holesLeft: number;
    holesRight: number;
    leftSum: number[];
    rightSum: number[];
    leftMotor: PCAmotor.Motors;
    rightMotor: PCAmotor.Motors;

    constructor(leftMotor: PCAmotor.Motors, rightMotor: PCAmotor.Motors, leftSensor: DigitalPin, rightSensor: DigitalPin) {
        this.leftMotor = leftMotor;
        this.rightMotor = rightMotor;
        this.holesLeft = 0;
        this.holesRight = 0;
        this.leftSum = [];
        this.rightSum = [];
        pins.setEvents(leftSensor, PinEventType.Edge);
        pins.setEvents(rightSensor, PinEventType.Edge);
        pins.onPulsed(leftSensor, PulseValue.High, () => {
            this.holesLeft++;
        });
        pins.onPulsed(rightSensor, PulseValue.High, () => {
            this.holesRight++;
        });
        control.inBackground(() => {
            basic.forever(() => {
                PCAmotor.MotorRun(PCAmotor.Motors.M4, this.speedLeft);
                PCAmotor.MotorRun(PCAmotor.Motors.M3, this.speedRight);
            });
        });
    }

    private getAverage(arr: number[]): number {
        if (arr.length === 0) return 0;
        const sum = arr.reduce((total, current) => total + current, 0);
        return sum / arr.length;
    }

    public setSpeed(leftSpeed: number, rightSpeed: number) {
        this.speedLeft = leftSpeed;
        this.speedRight = rightSpeed;
        if (this.speedRight == 0) {
            loops.everyInterval(MotorBalancing.UPDATE_INTERVAL, () => {
                console.logValue("speedLeft 111", this.speedLeft + " " + this.holesLeft);
                console.logValue("speedRight 111", this.speedRight + " " + this.holesRight);

                if (this.speedLeft >= MotorBalancing.SPEED_THRESHOLD) {
                    this.leftSum.push(this.holesLeft);
                }
                if (this.leftSum.length > MotorBalancing.AVG_LENGTH) {
                    this.leftSum.shift();
                }
                let leftAvg = this.getAverage(this.leftSum) + 0.2;
                console.logValue("leftAvg", leftAvg);

                if (this.holesLeft > leftAvg) {
                    if (this.speedLeft >= 0) {
                        this.speedLeft--;
                    } else {
                        this.speedLeft++;
                    }
                } else if (this.holesLeft < leftAvg) {
                    if (this.speedLeft >= 0) {
                        this.speedLeft++;
                    } else {
                        this.speedLeft--;
                    }
                }

                this.holesLeft = 0;
                this.holesRight = 0;
            });
        }
        else if (this.speedLeft == 0) {
            loops.everyInterval(MotorBalancing.UPDATE_INTERVAL, () => {
                console.logValue("speedLeft 222", this.speedLeft + " " + this.holesLeft);
                console.logValue("speedRight 222", this.speedRight + " " + this.holesRight);

                if (this.speedRight >= MotorBalancing.SPEED_THRESHOLD) {
                    this.rightSum.push(this.holesRight);
                }
                if (this.rightSum.length > MotorBalancing.AVG_LENGTH) {
                    this.rightSum.shift();
                }
                let rightAvg = this.getAverage(this.rightSum) + 0.2;
                console.logValue("rightAvg", rightAvg);

                if (this.holesRight > rightAvg) {
                    if (this.speedRight >= 0) {
                        this.speedRight--;
                    } else {
                        this.speedRight++;
                    }
                } else if (this.holesRight < rightAvg) {
                    if (this.speedRight >= 0) {
                        this.speedRight++;
                    } else {
                        this.speedRight--;
                    }
                }

                this.holesLeft = 0;
                this.holesRight = 0;
            });
        }
        else if (this.speedLeft == this.speedRight) {
            loops.everyInterval(MotorBalancing.UPDATE_INTERVAL, () => {
                console.logValue("speedLeft 333", this.speedLeft + " " + this.holesLeft);
                console.logValue("speedRight 333", this.speedRight + " " + this.holesRight);

                if (this.speedLeft >= MotorBalancing.SPEED_THRESHOLD)
                    this.leftSum.push(this.holesLeft);
                if (this.speedRight >= MotorBalancing.SPEED_THRESHOLD)
                    this.rightSum.push(this.holesRight);
                if (this.leftSum.length > MotorBalancing.AVG_LENGTH) {
                    this.leftSum.shift();
                    this.rightSum.shift();
                }
                let leftAvg = this.getAverage(this.leftSum);
                let rightAvg = this.getAverage(this.rightSum);
                console.logValue("leftAvg", leftAvg);
                console.logValue("rightAvg", rightAvg);

                if (leftAvg > rightAvg) {
                    if (this.holesLeft > leftAvg) {
                        this.speedLeft--;
                        console.log("speedLeft--; 1 1");
                    } else {
                        this.speedRight++;
                        console.log("speedRight++; 1 2");
                    }
                } else if (leftAvg < rightAvg) {
                    if (this.holesRight > rightAvg) {
                        this.speedRight--;
                        console.log("speedRight--; 2 1");
                    } else {
                        this.speedLeft++;
                        console.log("speedLeft++; 2 2");
                    }
                }

                this.holesLeft = 0;
                this.holesRight = 0;
            });
        } else {
            let initAvgLeft: number[] = [];
            let initAvgRight: number[] = [];
            loops.everyInterval(MotorBalancing.UPDATE_INTERVAL, () => {
                console.logValue("speedLeft 444", this.speedLeft + " " + this.holesLeft);
                console.logValue("speedRight 444", this.speedRight + " " + this.holesRight);

                if (initAvgLeft.length < MotorBalancing.AVG_LENGTH * 2) {
                    initAvgLeft.push(this.holesLeft);
                    initAvgRight.push(this.holesRight);
                }

                if (this.speedLeft >= MotorBalancing.SPEED_THRESHOLD)
                    this.leftSum.push(this.holesLeft);
                if (this.speedRight >= MotorBalancing.SPEED_THRESHOLD)
                    this.rightSum.push(this.holesRight);
                if (this.leftSum.length > MotorBalancing.AVG_LENGTH) {
                    this.leftSum.shift();
                    this.rightSum.shift();
                }
                let leftAvg = this.getAverage(this.leftSum);
                let rightAvg = this.getAverage(this.rightSum);
                console.logValue("leftAvg", leftAvg);
                console.logValue("rightAvg", rightAvg);
                let ratio = this.getAverage(initAvgLeft) / this.getAverage(initAvgRight);
                if (leftAvg > rightAvg * ratio) {
                    if (this.holesLeft > leftAvg) {
                        this.speedLeft--;
                        console.log("speedLeft--; 1 1");
                    } else {
                        this.speedRight++;
                        console.log("speedRight++; 1 2");
                    }
                } else if (leftAvg < rightAvg * ratio) {
                    if (this.holesRight > rightAvg) {
                        this.speedRight--;
                        console.log("speedRight--; 2 1");
                    } else {
                        this.speedLeft++;
                        console.log("speedLeft++; 2 2");
                    }
                }

                this.holesLeft = 0;
                this.holesRight = 0;
            });
        }
    }
}