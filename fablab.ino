#include "Stepper.h"

const int stepsPerRevolution = 200;
const int BUTTON_PIN = 6; 
Stepper myStepper(stepsPerRevolution, 8, 9, 10, 11);
unsigned long timer;

void setup() {
  myStepper.setSpeed(60);
  pinMode(13, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  timer = millis();
   Serial.begin(9600);

}

void loop() {
  int nbrStep;
  if(digitalRead(BUTTON_PIN) == HIGH){
    myStepper.step(stepsPerRevolution);
    Serial.write("{motor:1}");
    nbrStep ++;
    timer = millis();
    }

    if (millis() - timer > 100000) {
    tone(13,1, 200); // allume le buzzer actif arduino
    Serial.write("{buzzer: 1}");
    timer = millis();
    }
  unsigned int AnalogValue;
  AnalogValue = analogRead(A0);

  if(AnalogValue > 1015){
    myStepper(-(stepsPerRevolution*nbrStep));
    }
}
  


