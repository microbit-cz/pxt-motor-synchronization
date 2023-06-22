# Motor Synchronization
[EN](README.md) | [CZ](README_cs.md)

Tato knihovna slouží k synchronizaci motorů v micro:bitových autech. Účelem této knihovny je zajistit, aby dva motory byly vzájemně synchronizovány.

<img src="images/motor.jpg" alt="encoder" style="width: 40%">


Rychlost je reprezentována jako úhlová rychlost, protože motory se otáčejí. Úhlová rychlost se měří v radiánech za sekundu.
Rychlost se vypočítá z počtu impulsů za sekundu ze snímače.

<img src="images/encoder.jpg" alt="encoder" style="width: 40%">

Snímač má určitý počet otvorů, proto je počet impulsů za otáčku dvojnásobkem počtu otvorů na snímači.
Z toho lze vypočítat úhlovou rychlost. Úhlová rychlost se používá pro synchronizaci motorů.

Knihovna používá [tuto knihovnu](https://github.com/tomaskazda/pxt-magicbit-pca9685), pro změnu rychlosti motorů, vytvořenou pro desku magic:bit.

# Začínáme
Chcete-li začít používat tuto knihovnu, musíte ji nejprve zkalibrovat pomocí motorů. Toto je potřeba provést vždy po výměně motorů.
```typescript
let motors = motorsynchronization.create(
    PCAmotor.Motors.M2, // Levý motor
    PCAmotor.Motors.M3, // Pravý motor
    DigitalPin.P12, // Senzor pro levý motor
    DigitalPin.P8, // Senzor pro pravý motor
    20 // Počet otvorů v enkodéru
);
motors.Calibrate();
```

Metoda Calibrate vypíše do konzole maximální rychlost motorů. Tato hodnota se musí nastavit jako maximální rychlost pro fungování metody Run.

```typescript
let motors = motorsynchronization.create(
    PCAmotor.Motors.M2, // Levý motor
    PCAmotor.Motors.M3, // Pravý motor
    DigitalPin.P12, // Senzor pro levý motor
    DigitalPin.P8, // Senzor pro pravý motor
    20 // Počet otvorů v enkodéru
);
//motors.SetDebug(true);
//motors.Calibrate();
motors.SetMaxSpeed(19);
motors.Run(200, 200);
```

V tomto příkladu se nastavuje maximální rychlost na 19 rad/s. Po inicializaci můžete zapnout ladění pomocí SetDebug nastaveného na true.

## Pokročilé

Úhlovou rychlost můžete také nastavit okamžitě bez nutnosti kalibrace.

```typescript
let motors = motorsynchronization.create(
    PCAmotor.Motors.M2, // Levý motor
    PCAmotor.Motors.M3, // Pravý motor
    DigitalPin.P12, // Senzor pro levý motor
    DigitalPin.P8, // Senzor pro pravý motor
    20 // Počet otvorů v enkodéru
);
//motors.SetDebug(true);
motors.RunAngular(10, 10);
```

# Omezení

## Rychlá reakční doba
Protože tato knihovna zvyšuje režii, nedoporučuje se ji používat, pokud potřebujete rychlé reakční časy robota. 

## Kompatibilita
Tato knihovna **podporuje pouze** PCA9865 s magic:biy. Jakákoli jiná deska je podporována

# Použití
## Inicializace
Knihovna se inicializuje voláním funkce create. Funkce create přijímá následující parametry:
- motor1: První motor, který se má synchronizovat
- motor2: Druhý motor, který se má synchronizovat
- sensor1: Vývod, ke kterému je připojen snímač prvního motoru.
- sensor2: Vývod, ke kterému je připojen snímač druhého motoru.
- holes: Počet otvorů na snímači
```javascript
let motors = motorsynchronization.create(PCAmotor.Motors.M1, PCAmotor.Motors.M2, DigitalPin.P1, DigitalPin.P2, 20);
```

## Synchronizace
Synchronizace se provádí voláním funkce synchronize. Funkce synchronize přijímá následující parametry:
- speed1: Rychlost prvního motoru v radiánech za sekundu.
- speed2: Rychlost druhého motoru v radiánech za sekundu.
```javascript
motors.Run(10, 10);
```

# Řešení problémů
## Robot se začne neočekávaně otáčet
Zkontrolujte snímače, protože se mohly odpojit nebo vypadnout z místa. Pokud se tak stalo, opravte je a zkuste to znovu.

## Robot se nezačne pohybovat
Zkontrolujte připojení motoru, jestli je připojen. Pokud ano, změňte rychlost ve funkci `Run()`.