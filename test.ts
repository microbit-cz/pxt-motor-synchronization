let motors = motorsynchronization.create(
    PCAmotor.Motors.M2,  // Left motor
    PCAmotor.Motors.M3,  // Right motor
    DigitalPin.P12,       // Sensor for left motor
    DigitalPin.P8,       // Sensor for right motor
    20                   // Number of holes in the encoder
);
//motors.Calibrate();
motors.SetDebug(true);
motors.SetMaxSpeed(19);
motors.Run(400, 200);