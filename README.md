# Motor Synchronization
[CZ](README_cs.md) | [EN](README.md)

This library is for synchronising motors on micro:bit cars with the magic:bit board and PCA9685. The aim is to make it easier to go straight or turn predictably with micro:bit cars.

This code relies on the detection of holes in an encoder connected to each motor. From these detections and the number of holes there are, angular velocity can be calculated.

<img src="images/encoder.jpg" alt="encoder" style="width: 20%">

The encoder has a specified number of holes, therefore the number of impulses per revolution is twice the amount of holes on the encoder.
From this angular velocity can be calculated. Angular velocity is used for synchronization of the motors.

The library is using [this PCA9685 library](https://github.com/tomaskazda/pxt-magicbit-pca9685), for changing the speed of motors, created for the magic:bit board.

# Limitations

## Fast Reaction times
Since this library adds overhead, thus it's not recommended to use this library when needing fast reaction times from the robot. 

## Compatibility
This library is **only** supporting the PCA9685 with magic:bit. Any other board is unsupported.

# Usage
## Initialization
The library is initialized by calling the create function. The create function takes the following parameters:
- motor1: The first motor to synchronize
- motor2: The second motor to synchronize
- sensor1: The pin where the encoder for the first motor is connected
- sensor2: The pin where the encoder for the second motor is connected
- holes: The number of holes on the encoder
```javascript
let motors = motorsynchronization.create(PCAmotor.Motors.M1, PCAmotor.Motors.M2, DigitalPin.P1, DigitalPin.P2, 20);
```

## Synchronization
The synchronization is done by calling the synchronize function. The synchronize function takes the following parameters:
- speed1: The speed of the first motor (radians per second)
- speed2: The speed of the second motor (radians per second)
```javascript
motors.Run(10, 10);
```

# Troubleshooting
## Robot starts turning unexpectedly
Check the sensors as they may have disconnected or have fell out of their place. If they did correct them and try again.

## Robot does not start moving
Check motor connections, if they are connected. If they are, change the speed of in `Run()` function.
