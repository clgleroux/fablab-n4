#include "Stepper.h"

const int stepsPerRevolution = 200;

Stepper myStepper(stepsPerRevolution, 8, 9, 10, 11);

void setup() {
  pinMode(12, INPUT);
  myStepper.setSpeed(60);
}

void loop() {

  int a = digitalRead(12);
  int b =1;
  if (a==b) {
     myStepper.step(500);
     delay(2000);
  }
}