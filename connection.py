import serial

mySerial = serial.Serial(port="/dev/cu.usbserial-110", baudrate=9600, timeout= 20);

while True:
    message = mySerial.readline()
    print(message.strip())
    
mySerial.close()