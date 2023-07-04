const int BUTTON_PIN = 6; 
int outPorts[] = {11, 10, 9, 8};
unsigned long timer;
int nbrStep = 0;
int temp = 0;

void setup() {
  // myStepper.setSpeed(60);
  for (int i = 0; i < 4; i++) {
    pinMode(outPorts[i], OUTPUT);
  }
  pinMode(13, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  timer = millis();
  Serial.begin(9600);
}

void loop() {
  if(digitalRead(BUTTON_PIN) == HIGH){
    moveSteps(true, 256, 2);
    Serial.write("{motor:1}");
    nbrStep++;
    timer = millis();
  }

  if (millis() - timer > 10000) {
    tone(13,1, 200); // allume le buzzer actif arduino
    Serial.write("{buzzer:1}");
    timer = millis();
  }

  unsigned int AnalogValue;
  AnalogValue = analogRead(A0);

  if(AnalogValue > 600){
    moveSteps(false, nbrStep * 256, 2);
  }
}

// MOVE ROND
void moveSteps(bool dir, int steps, byte ms) {
  for (int i = 0; i < steps; i++) {
    moveOneStep(dir); // Rotate a step
    delay(ms);        // Control the speed
  }
}

void moveOneStep(bool dir) {
  // Define a variable, use four low bit to indicate the state of port
  static byte out = 0x01;
  // Decide the shift direction according to the rotation direction
  if (dir) {  // ring shift left
    out != 0x08 ? out = out << 1 : out = 0x01;
  }
  else {      // ring shift right
    out != 0x01 ? out = out >> 1 : out = 0x08;
  }
  // Output singal to each port
  for (int i = 0; i < 4; i++) {
    digitalWrite(outPorts[i], (out & (0x01 << i)) ? HIGH : LOW);
  }
}
  


