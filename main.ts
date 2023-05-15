class MotorSynchronization {
    public SPEED_LEFT: number; // Add clamp
    public SPEED_RIGHT: number;

    public MOTOR_LEFT: PCAmotor.Motors;
    public MOTOR_RIGHT: PCAmotor.Motors;

    public SENSOR_LEFT: DigitalPin;
    public SENSOR_RIGHT: DigitalPin;

    private left_negate: boolean;
    private right_negate: boolean;

    private left_pulses: number;
    private right_pulses: number;

    private left_real_speed: number;
    private right_real_speed: number;

    private agression: number;

    private left_ratio: number;
    private right_ratio: number;

    constructor(left_motor: PCAmotor.Motors, right_motor: PCAmotor.Motors, left_sensor: DigitalPin, right_sensor: DigitalPin, debug: boolean = false) {
        this.MOTOR_LEFT = left_motor;
        this.MOTOR_RIGHT = right_motor;

        this.SENSOR_LEFT = left_sensor;
        this.SENSOR_RIGHT = right_sensor;

        this.SPEED_LEFT = 0;
        this.SPEED_RIGHT = 0;

        this.left_negate = false;
        this.right_negate = false;

        this.left_pulses = 0;
        this.right_pulses = 0;

        this.agression = 1;

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

        if (debug) {
            console.log(`LEFT RATIO: ${this.left_ratio}`);
            console.log(`RIGHT RATIO: ${this.right_ratio}`);
            loops.everyInterval(100, () => {
                console.logValue("LEFT ENCODER SPEED", this.left_pulses);
                console.logValue("RIGHT ENCODER SPEED", this.right_pulses);

                console.logValue("REAL LEFT SPEED", this.left_real_speed);
                console.logValue("REAL RIGHT SPEED", this.right_real_speed);
            })
        }

        pins.onPulsed(this.SENSOR_LEFT, PulseValue.High, () => {
            this.left_pulses++;
        });

        pins.onPulsed(this.SENSOR_RIGHT, PulseValue.High, () => {
            this.right_pulses++;
        });

        loops.everyInterval(200, () => {
            let difference = this.right_pulses - this.left_pulses;
            if (difference <= 5 && difference >= -5) {
                return;
            }


            if (difference > 0) {
                if (this.left_negate) {
                    this.left_real_speed -= this.agression;
                } else {
                    this.left_real_speed += this.agression;
                }
            } else {
                if (this.right_negate) {
                    this.right_real_speed += this.agression;
                } else {
                    this.right_real_speed -= this.agression;
                }
            }

            PCAmotor.MotorRun(this.MOTOR_LEFT, this.left_real_speed);
            PCAmotor.MotorRun(this.MOTOR_RIGHT, this.right_real_speed);
        })
    }

    public Settings(agression: number) {
        this.agression = agression;
    }

    public Run(speed_left: number, speed_right: number) {
        this.SPEED_LEFT = Math.clamp(-255, 255, speed_left);
        this.SPEED_RIGHT = Math.clamp(-255, 255, speed_right);
        if (this.SPEED_LEFT < 0) this.left_negate = true;
        if (this.SPEED_RIGHT < 0) this.right_negate = true;
    }
}

const motory = new MotorSynchronization(PCAmotor.Motors.M1, PCAmotor.Motors.M4, DigitalPin.P0, DigitalPin.P1, true);
motory.Run(100, 100);
