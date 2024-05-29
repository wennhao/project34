#include <SoftwareSerial.h>
#include <Adafruit_Thermal.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Keypad.h>

#define TX_PIN 10
#define RX_PIN 11

SoftwareSerial printer_connection(RX_PIN, TX_PIN);
Adafruit_Thermal printer(&printer_connection);

// Dispenser pinout
const int M50ENA_PIN = 12;
const int M50IN1_PIN = 49;
const int M50IN2_PIN = 47;
const int M20ENA_PIN = 45;
const int M20IN1_PIN = 43;
const int M20IN2_PIN = 41;
const int M10ENA_PIN = 35;
const int M10IN1_PIN = 39;
const int M10IN2_PIN = 37;
const int M5ENA_PIN = 38;
const int M5IN1_PIN = 33;
const int M5IN2_PIN = 31;

#define SS_PIN 9
#define RST_PIN 8

MFRC522 mfrc522(SS_PIN, RST_PIN);  // Create MFRC522 instance

// Keypad setup
const int ROW_NUM = 4;
const int COLUMN_NUM = 4;
char keys[ROW_NUM][COLUMN_NUM] = {
  { '1', '2', '3', 'A' },
  { '4', '5', '6', 'B' },
  { '7', '8', '9', 'C' },
  { '*', '0', '#', 'D' }
};
byte pin_rows[ROW_NUM] = { 36, 34, 32, 30 };
byte pin_column[COLUMN_NUM] = { 28, 26, 24, 22 };
Keypad customKeypad = Keypad(makeKeymap(keys), pin_rows, pin_column, ROW_NUM, COLUMN_NUM);

// Button pins
const int buttonPin1 = 2;
const int buttonPin2 = 3;
const int buttonPin3 = 4;
const int buttonPin4 = 5;
const int buttonPin5 = 6;
const int buttonPin6 = 7;

int buttonState1 = 0, buttonState2 = 0, buttonState3 = 0, buttonState4 = 0, buttonState5 = 0, buttonState6 = 0;
int lastButtonState1 = 0, lastButtonState2 = 0, lastButtonState3 = 0, lastButtonState4 = 0, lastButtonState5 = 0, lastButtonState6 = 0;
unsigned long lastDebounceTime1 = 0, lastDebounceTime2 = 0, lastDebounceTime3 = 0, lastDebounceTime4 = 0, lastDebounceTime5 = 0, lastDebounceTime6 = 0;
unsigned long debounceDelay = 50;  // Debounce time in milliseconds

bool shouldPrintReceipt = false;
String receiptData = "";

void setup() {
  printer_connection.begin(19200);
  printer_connection.write(27);
  printer_connection.write(64);
  printer.begin();
  Serial.begin(9600);  // Initiate a serial communication
  SPI.begin();         // Initiate SPI bus
  mfrc522.PCD_Init();  // Initiate MFRC522
  Serial.println();

  // Dispenser pins
  pinMode(M50ENA_PIN, OUTPUT);
  pinMode(M50IN1_PIN, OUTPUT);
  pinMode(M50IN2_PIN, OUTPUT);
  pinMode(M20ENA_PIN, OUTPUT);
  pinMode(M20IN1_PIN, OUTPUT);
  pinMode(M20IN2_PIN, OUTPUT);
  pinMode(M10ENA_PIN, OUTPUT);
  pinMode(M10IN1_PIN, OUTPUT);
  pinMode(M10IN2_PIN, OUTPUT);
  pinMode(M5ENA_PIN, OUTPUT);
  pinMode(M5IN1_PIN, OUTPUT);
  pinMode(M5IN2_PIN, OUTPUT);

  analogWrite(M50ENA_PIN, 130);
  analogWrite(M20ENA_PIN, 130);
  analogWrite(M10ENA_PIN, 130);
  analogWrite(M5ENA_PIN, 200);

  digitalWrite(M50IN1_PIN, LOW);
  digitalWrite(M50IN2_PIN, LOW);
  digitalWrite(M20IN1_PIN, LOW);
  digitalWrite(M20IN2_PIN, LOW);
  digitalWrite(M10IN1_PIN, LOW);
  digitalWrite(M10IN2_PIN, LOW);
  digitalWrite(M5IN1_PIN, LOW);
  digitalWrite(M5IN2_PIN, LOW);

  // Setup button pins with internal pull-up resistors
  pinMode(buttonPin1, INPUT_PULLUP);
  pinMode(buttonPin2, INPUT_PULLUP);
  pinMode(buttonPin3, INPUT_PULLUP);
  pinMode(buttonPin4, INPUT_PULLUP);
  pinMode(buttonPin5, INPUT_PULLUP);
  pinMode(buttonPin6, INPUT_PULLUP);
}

void loop() {
  scanner();
  readKey();

  if (Serial.available() > 0) {
    String data = Serial.readStringUntil('\n');  // Read the data until newline character ('\n')
    Serial.println("Received data: " + data);    // Debugging line to check data received

    if (data.startsWith("amount:")) {
      int amount = data.substring(7).toInt();  // Extract the amount
      opnemen(amount);                         // Call opnemen with the amount
    } else if (data.startsWith("button6Data:")) {
      receiptData = data.substring(12);  // Extract the receipt data
      shouldPrintReceipt = true;         // Set flag to print receipt

      // Split the string to extract the last number
      int lastCommaIndex = receiptData.lastIndexOf(',');
      if (lastCommaIndex > 0) {
        String lastNumberString = receiptData.substring(lastCommaIndex + 1);
        int amount = lastNumberString.toInt();  // Convert the last number to an integer
        opnemen(amount);                        // Call opnemen with the amount
      }
    }
  }


  if (shouldPrintReceipt) {
    printReceipt(receiptData);   // Print the receipt with the data
    shouldPrintReceipt = false;  // Reset the flag
  }

  // Check buttons with debouncing
  if (readAndDebounceButton(buttonPin1, lastButtonState1, lastDebounceTime1, buttonState1)) {
    handleButtonPress(1);
  }
  if (readAndDebounceButton(buttonPin2, lastButtonState2, lastDebounceTime2, buttonState2)) {
    handleButtonPress(2);
  }
  if (readAndDebounceButton(buttonPin3, lastButtonState3, lastDebounceTime3, buttonState3)) {
    handleButtonPress(3);
  }
  if (readAndDebounceButton(buttonPin4, lastButtonState4, lastDebounceTime4, buttonState4)) {
    handleButtonPress(4);
  }
  if (readAndDebounceButton(buttonPin5, lastButtonState5, lastDebounceTime5, buttonState5)) {
    handleButtonPress(5);
  }
  if (readAndDebounceButton(buttonPin6, lastButtonState6, lastDebounceTime6, buttonState6)) {
    handleButtonPress(6);
  }
}

void scanner() {
  // Prepare key - all keys are set to FFFFFFFFFFFFh at chip delivery from the factory.
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  // Some variables we need
  byte block;
  byte len;
  MFRC522::StatusCode status;

  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  Serial.print(F("rfid:"));

  byte buffer1[18];

  block = 4;
  len = 18;

  // GET [Block 4]
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 4, &key, &(mfrc522.uid));  // Line 834 of MFRC522.cpp file
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer1, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  // PRINT FIRST NAME
  for (uint8_t i = 0; i < 8; i++) {
    if (buffer1[i] != 32) {
      Serial.write(buffer1[i]);
    }
  }

  // GET [Block 5]
  byte buffer2[18];
  block = 5;

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 5, &key, &(mfrc522.uid));  // Line 834
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer2, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  // PRINT LAST NAME
  for (uint8_t i = 0; i < 10; i++) {
    Serial.write(buffer2[i]);
  }

  // GET UID [Block 0]
  byte buffer3[18];
  block = 0;

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 0, &key, &(mfrc522.uid));  // Line 834 of MFRC522.cpp file
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer3, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    return;
  }

  // PRINT UID
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (mfrc522.uid.uidByte[i] < 0x10) {
      Serial.print("0");
    }
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  }
  Serial.println();

  delay(1000);  // Change value if you want to read cards faster

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}

bool readAndDebounceButton(int buttonPin, int& lastState, unsigned long& lastDebounceTime, int& buttonState) {
  int reading = digitalRead(buttonPin);
  if (reading != lastState) {
    lastDebounceTime = millis();
  }
  if ((millis() - lastDebounceTime) > debounceDelay) {
    if (reading != buttonState) {
      buttonState = reading;
      lastState = reading;
      return buttonState == LOW;  // LOW because the button is pressed (pull-up resistor)
    }
  }
  lastState = reading;
  return false;
}

void handleButtonPress(int buttonNumber) {
  Serial.print("button");
  Serial.println(buttonNumber);
  delay(1000);  // Example delay, adjust as needed
}

void readKey() {
  char customKey = customKeypad.getKey();

  if (customKey) {
    Serial.println(customKey);
  }
}

void printReceipt(String data) {
  // Split the data into fields using a delimiter, e.g., comma
  int firstSeparatorIndex = data.indexOf(',');
  int secondSeparatorIndex = data.indexOf(',', firstSeparatorIndex + 1);

  String name = data.substring(0, firstSeparatorIndex);
  String balance = data.substring(firstSeparatorIndex + 1, secondSeparatorIndex);
  String amount = data.substring(secondSeparatorIndex + 1);

  printer.setFont('A');
  printer.justify('C');
  printer.setSize('L');
  printer.println("WING");
  printer.setSize('M');
  printer.println("Land");
  printer.setSize('S');
  printer.println(amount);
  printer.justify('C');
  printer.println("--------------------------------");
  printer.justify('L');
  printer.println("Automaat: 1111");
  printer.print("Naam: ");
  printer.println(name);
  printer.print("Datum: ");
  printer.println("19/2/2023   Tijd: 12:40");  // You can update the date and time dynamically
  printer.println("Kaart: xxxxxxxxxxxxxx1234");
  printer.justify('C');
  printer.println("--------------------------------");
  printer.setSize('M');
  printer.print("Totaal: ");
  printer.print(balance);
  printer.setSize('S');
  printer.setFont('B');
  printer.feed();
  printer.println("Transactie: 1234567");  // You can update the transaction ID dynamically
  printer.feed(4);
}

void opnemen(int bedrag) {
  Serial.println("Opnemen called with bedrag: " + String(bedrag));  // Debugging line to check the amount

  while (bedrag > 0) {
    delay(800);
    if (bedrag >= 50) {
      Serial.println("Dispensing 50");
      bedrag -= 50;
      Serial.println("Remaining amount: " + String(bedrag));
      digitalWrite(M50IN1_PIN, HIGH);
      digitalWrite(M50IN2_PIN, LOW);
      delay(290);
      digitalWrite(M50IN1_PIN, LOW);
      digitalWrite(M50IN2_PIN, LOW);
    } else if (bedrag >= 20) {
      Serial.println("Dispensing 20");
      bedrag -= 20;
      Serial.println("Remaining amount: " + String(bedrag));
      digitalWrite(M20IN1_PIN, HIGH);
      digitalWrite(M20IN2_PIN, LOW);
      delay(225);
      digitalWrite(M20IN1_PIN, LOW);
      digitalWrite(M20IN2_PIN, LOW);
    } else if (bedrag >= 10) {
      Serial.println("Dispensing 10");
      bedrag -= 10;
      Serial.println("Remaining amount: " + String(bedrag));
      digitalWrite(M10IN1_PIN, HIGH);
      digitalWrite(M10IN2_PIN, LOW);
      delay(197);
      digitalWrite(M10IN1_PIN, LOW);
      digitalWrite(M10IN2_PIN, LOW);
    } else if (bedrag >= 5) {
      Serial.println("Dispensing 5");
      bedrag -= 5;
      Serial.println("Remaining amount: " + String(bedrag));
      digitalWrite(M5IN1_PIN, HIGH);
      digitalWrite(M5IN2_PIN, LOW);
      delay(300);
      digitalWrite(M5IN1_PIN, LOW);
      digitalWrite(M5IN2_PIN, LOW);
    }
  }

  if (bedrag == 0) {
    Serial.println("Transaction complete");
  }
}
