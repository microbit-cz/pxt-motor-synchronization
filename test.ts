let motory = motorsynchronization.create(
PCAmotor.Motors.M0,  // Left motor
PCAmotor.Motors.M1,  // Right motor
DigitalPin.P0,       // Sensor for left motor
DigitalPin.P1,       // Sensor for right motor
20                   // Number of holes in the encoder
)
motory.Run(-20, 20)  // Start the motors
