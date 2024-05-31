# PROJECT 3/4 De BANK AUTOMAAT
Dit project is gemaakt door Jorge & Wen Hao
# Contents
Dit project bevat 2 mapjes, backend en frontend. 

Backend bevatten code zoals de API en de Arduino code
We maken gebruik van een Arduino Mega 2560 en een Ubuntu server.

Om de Graphical User Interface(GUI) te runnen gebruiken we de mapje **"frontend"**.

Installatie frontend
===========
> [!IMPORTANT]
> Om de **GUI** te starten moet je de
> volgende stappen goed volgen!

Allereerst moeten we de mapje **"frontend"** openen
```
cd frontend
```

Vervolgens run je de volgende command om de inhoud van de mapje te bekijken.
```
ls
```
Zie je een map genaamd **"node_modules"**? 

### Ja
Run de volgende command
```
npm start
```
Het is je gelukt! Als het goed is staat je GUI op [localhost](http://localhost:3000/)


### Nee of error bij Ja
Run de volgende commands
```
npm init -y
```
```
npm install express
```
```
npm install serialport
```
```
npm install socket.io
```
hierdoor update / maak je de node_modules en package.json map en bestand.

### Het lukt nog steeds niet!!!
Raadpleeg ons op discord \
`catorge`
