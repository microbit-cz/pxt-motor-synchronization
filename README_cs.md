# Motor Synchronization
[CZ](README_cz.md) | [EN](README.md)

Tato knihovna slouží k synchronizaci motorů v micro:bitových autech. Účelem této knihovny je zajistit, aby dva motory byly vzájemně synchronizovány.

<img src="images/motor.jpg" alt="encoder" style="width: 40%">


Rychlost je reprezentována jako úhlová rychlost, protože motory se otáčejí. Úhlová rychlost se měří v radiánech za sekundu.
Rychlost se vypočítá z počtu impulsů za sekundu ze snímače.

<img src="images/encoder.jpg" alt="encoder" style="width: 40%">

Snímač má určitý počet otvorů, proto je počet impulsů za otáčku dvojnásobkem počtu otvorů na snímači.
Z toho lze vypočítat úhlovou rychlost. Úhlová rychlost se používá pro synchronizaci motorů.

Knihovna používá [tuto knihovnu](https://github.com/tomaskazda/pxt-magicbit-pca9685), pro změnu rychlosti motorů, vytvořenou pro desku magic:bit.

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