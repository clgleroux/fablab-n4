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
  Serial.print("Time: ");
   Serial.println(timer);
}

void loop() {    
  if(digitalRead(BUTTON_PIN) == HIGH){
    myStepper.step(200);  // nombre de pas
    delay(200);
    timer = millis();
  }
  else if(digitalRead(BUTTON_PIN) == LOW){
    myStepper.step(0); 
    if (millis() - timer > 10000) {
    tone(13,500, 200); // allume le buzzer actif arduino
    }

  }


}