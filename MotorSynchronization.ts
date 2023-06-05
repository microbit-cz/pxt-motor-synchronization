
/**
 * Library for synchronizing motors
 */
//% weight=5 color=#3399ff icon="\uf013"
namespace motorsynchronization {
    export class MotorSynchronization {
        public SPEED_LEFT: number;
        public SPEED_RIGHT: number;

        public MOTOR_LEFT: PCAmotor.Motors;
        public MOTOR_RIGHT: PCAmotor.Motors;

        public SENSOR_LEFT: DigitalPin;
        public SENSOR_RIGHT: DigitalPin;

        public ENCODER_HOLES: number;

        private left_negate: boolean;
        private right_negate: boolean;

        private left_pulses: number;
        private right_pulses: number;

        private left_angular_speed: AngularSpeedCalc;
        private right_angular_speed: AngularSpeedCalc;

        private left_real_speed: number;
        private right_real_speed: number;

        private aggression: number;

        private left_ratio: number;
        private right_ratio: number;

        private start_time: number;

        private left_ang_speed: number;
        private right_ang_speed: number;

        constructor(left_motor: PCAmotor.Motors, right_motor: PCAmotor.Motors, left_sensor: DigitalPin, right_sensor: DigitalPin, holes: number, debug: boolean = false) {
            this.MOTOR_LEFT = left_motor;
            this.MOTOR_RIGHT = right_motor;

            this.SENSOR_LEFT = left_sensor;
            this.SENSOR_RIGHT = right_sensor;

            this.SPEED_LEFT = 0;
            this.SPEED_RIGHT = 0;

            this.ENCODER_HOLES = holes*2;

            this.left_negate = false;
            this.right_negate = false;

            this.left_pulses = 0;
            this.right_pulses = 0;

            this.left_angular_speed = new AngularSpeedCalc(holes);
            this.right_angular_speed = new AngularSpeedCalc(holes);

            this.aggression = 1;

            this.left_real_speed = 0;
            this.right_real_speed = 0;

            let factor: number;
            let higherValue: number;

            if (Math.abs(this.SPEED_RIGHT) > Math.abs(this.SPEED_LEFT)) {
                factor = 1 / this.SPEED_LEFT;
                higherValue = this.SPEED_LEFT;
            } else {
                factor = 1 / this.SPEED_RIGHT;
                higherValue = this.SPEED_RIGHT;
            }

            this.left_ratio = higherValue * factor;
            this.right_ratio = this.SPEED_LEFT * factor;

            // if (debug) {
            //     console.log(`LEFT RATIO: ${this.left_ratio}`);
            //     console.log(`RIGHT RATIO: ${this.right_ratio}`);
            //     loops.everyInterval(50, () => {
            //         console.logValue("LEFT ENCODER SPEED", this.left_pulses);
            //         console.logValue("RIGHT ENCODER SPEED", this.right_pulses);

            //         console.logValue("REAL LEFT SPEED", this.left_real_speed);
            //         console.logValue("REAL RIGHT SPEED", this.right_real_speed);

            //         console.logValue("LEFT ANGULAR SPEED", this.left_angular_speed);
            //         console.logValue("RIGHT ANGULAR SPEED", this.right_angular_speed);
            //     });
            // }

            pins.onPulsed(this.SENSOR_LEFT, PulseValue.High, () => {
                this.left_pulses++;
            });

            pins.onPulsed(this.SENSOR_RIGHT, PulseValue.High, () => {
                this.right_pulses++;
            });

            pins.onPulsed(this.SENSOR_LEFT, PulseValue.Low, () => {
                this.left_pulses++;
            });

            pins.onPulsed(this.SENSOR_RIGHT, PulseValue.Low, () => {
                this.right_pulses++;
            });

            loops.everyInterval(300, () => {
                this.left_ang_speed = this.left_angular_speed.calcAngularSpeed(this.left_pulses);
                this.right_ang_speed = this.right_angular_speed.calcAngularSpeed(this.right_pulses);
            });

            loops.everyInterval(150, () => {
                // Calculate angular speed
                // const partAngular = this.ENCODER_HOLES * (control.millis() / 1000 - this.start_time);
                // this.left_angular_speed = Math.roundWithPrecision((2 * Math.PI * this.left_pulses.le) / partAngular, 3);
                // this.right_angular_speed = Math.roundWithPrecision((2 * Math.PI * this.right_pulses) / partAngular, 3);

                // const left_diff = this.left_angular_speed - this.SPEED_LEFT;
                // const right_diff = this.right_angular_speed - this.SPEED_RIGHT;

                // if (left_diff > 0.5 || left_diff < 0.5) {
                //     if (left_diff > 0) {
                //         if (this.left_negate) this.left_real_speed += this.aggression;
                //         else this.left_real_speed -= this.aggression;
                //     } else {
                //         this.left_real_speed += this.aggression;
                //     }
                // }

                // if (right_diff > 0.5 || right_diff < 0.5) {
                //     if (right_diff > 0) {
                //         this.right_real_speed -= this.aggression;
                //     } else {
                //         this.right_real_speed += this.aggression;
                //     }
                // }
                // if (this.left_ang_speed === 0 && this.left_ang_speed === 0) return;

                let left_diff = this.SPEED_LEFT - this.left_ang_speed;
                let right_diff = this.SPEED_RIGHT - this.right_ang_speed;

                console.logValue("left angular value", this.left_ang_speed);
                console.logValue("right angular value", this.right_ang_speed);

                console.logValue("left diff", left_diff);
                console.logValue("right diff", right_diff);

                if ((left_diff > 2 || left_diff < -2) && this.left_ang_speed !== 0) {
                    if (this.left_ang_speed > this.SPEED_LEFT) {
                        if (this.left_negate) {
                            this.left_real_speed+=this.aggression;
                        } else {
                            this.left_real_speed -= this.aggression;
                        }
                    } else {
                        if (this.left_negate) {
                            this.left_real_speed -= this.aggression;
                        } else {
                            this.left_real_speed += this.aggression;
                        }
                    }
                }

                if ((right_diff > 2 || right_diff < -2) && this.right_ang_speed !== 0) {
                    if (this.right_ang_speed > this.SPEED_RIGHT) {
                        if (this.right_negate) {
                            this.right_real_speed+=this.aggression;
                        } else {
                            this.right_real_speed-=this.aggression;
                        }
                    } else {
                        if (this.right_negate) {
                            this.right_real_speed-=this.aggression;
                        } else {
                            this.right_real_speed+=this.aggression;
                        }
                    }
                }

                console.logValue("left speed", this.left_real_speed);
                console.logValue("right speed", this.right_real_speed);

                PCAmotor.MotorRun(this.MOTOR_LEFT, this.left_real_speed);
                PCAmotor.MotorRun(this.MOTOR_RIGHT, this.right_real_speed);
            });
        }

        /**
         * Tune the settings for best results
         * @param aggression number of speed that should be changed when correcting motors
         */
        //% blockId="motorsynchronization_settings" block="%motorsynchronization|set aggression to %aggression|aggression"
        //% motorsynchronization.defl=motorsynchronization
        //% blockGap=6
        //% weight=30
        //% parts="motorsynchronization" advanced=true
        public Settings(aggression: number) {
            this.aggression = aggression;
        }

        /**
         * Runs the motors at certain angular velocity
         * @param speed_left Angular velocity for the left motor
         * @param speed_right Angular velocity for the right motor
         */
        //% blockId="motorsynchronization_run" block="%motorsynchronization|run left motor at %speed_left|rad/s and right motor at %speed_right|rad/s"
        //% motorsynchronization.defl=motorsynchronization
        //% blockGap=6
        //% weight=90
        //% parts="motorsynchronization"
        public Run(speed_left: number, speed_right: number) {
            this.start_time = control.millis() / 1000;
            this.SPEED_LEFT = Math.clamp(-255, 255, speed_left);
            this.SPEED_RIGHT = Math.clamp(-255, 255, speed_right);
            this.left_real_speed = this.SPEED_LEFT*1.5;
            this.right_real_speed = this.SPEED_RIGHT*1.5;
            this.SPEED_LEFT = Math.abs(this.SPEED_LEFT);
            this.SPEED_RIGHT = Math.abs(this.SPEED_RIGHT);
            if (speed_left < 0) this.left_negate = true;
            if (speed_right < 0) this.right_negate = true;
        }
    }

    /**
     * Class for calculating the angular speed
     */
    class AngularSpeedCalc {
        private prev_count: number;
        private prev_time: number;
        private count: number;

        constructor(count: number) {
            this.prev_count = 0;
            this.prev_time = control.millis();
            this.count = count;
        }

        public calcAngularSpeed(current_count: number): number {
            const curr_time = control.millis();
            const delta_time = (curr_time - this.prev_time) / 1000;
            const delta_count = current_count - this.prev_count;

            this.prev_count = current_count;
            this.prev_time = curr_time;

            const delta_angle = (delta_count / this.count) * 2 * Math.PI;
            const angularSpeed = delta_angle / delta_time;
            return Math.roundWithPrecision(angularSpeed, 3);
        }
    }

    /**
     * Create a new instance of MotorSynchronization
     * @param left_motor Left motor of the vehicle
     * @param right_motor Right motor of the vehicle
     * @param left_sensor Sensor attached to an encoder connected to the left motor
     * @param right_sensor Sensor attached to an encoder connected to the right motor
     * @param holes Number of holes in the encoder
     * @param debug Log values into the console for debugging
     */
    //% blockId="motorsynchronization_create" block="Synchronization of %left_motor|motor and %right_motor|motor, with %left_sensor|sensor and %right_sensor|sensor and encoder with %holes|holes"
    //% weight=90 blockGap=6
    //% parts="motorsynchronization"
    export function create(left_motor: PCAmotor.Motors, right_motor: PCAmotor.Motors, left_sensor: DigitalPin, right_sensor: DigitalPin, holes: number, debug?: boolean): MotorSynchronization {
        const motors = new MotorSynchronization(left_motor, right_motor, left_sensor, right_sensor, holes, debug);
        return motors;
    }
}
