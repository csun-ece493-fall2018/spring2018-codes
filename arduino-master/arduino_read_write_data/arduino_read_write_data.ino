/**
 * California State University Northridge
 * ECE 493 Senior Design
 * Project: Ultrasonic radar
 * Participants: Hambartzum Gamburian, Giovanni Alonzo, Saba Janamian, Hamed Seyedroudbari, Andrew Zaragoza, Xiaoao Feng
 * Advisor: Dr. Shahnam Mirzaei
 * Code Description: Arduino code to read data from the ultrasonic sensor and send out the result over a serial port
 * Author: Saba Janamian
 * Version: 1.0
 * Date: 3/7/2018
 **/
// Includes the Servo library
#include <Servo.h>

// Defines Tirg and Echo pins of the Ultrasonic Sensor
#define ECHOPIN1 11
#define TRIGPIN1 10
#define ECHOPIN2 9
#define TRIGPIN2 8


// Variables for the duration and the distance
long distance1;
long distance2;
Servo myServo; // Creates a servo object for controlling the servo motor

void setup() {
  pinMode(TRIGPIN1, OUTPUT); // Sets the trigPin as an Output
  pinMode(ECHOPIN1, INPUT); // Sets the echoPin1 as an Input
  pinMode(TRIGPIN2, OUTPUT); // Sets the trigPin as an Output
  pinMode(ECHOPIN2, INPUT); // Sets the echoPin2 as an Input
  Serial.begin(9600);
  myServo.attach(12); // Defines on which pin is the servo motor attached
}
void loop() {
  // rotates the servo motor from 15 to 165 degrees
  for(int i=15; i < 165 ;i++){  
  myServo.write(i);
  delay(30);
  distance1 = calculateDistance(TRIGPIN1, ECHOPIN1);// Calls a function for calculating the distance measured by the Ultrasonic sensor for each degree
  distance2 = calculateDistance(TRIGPIN2, ECHOPIN2);
  Serial.print(i); // Sends the current degree into the Serial Port
  Serial.print(","); // Sends addition character right next to the previous value needed later in the Processing IDE for indexing

  Serial.print(distance1); // Sends the distance value into the Serial Port
  Serial.print(",");
  
  Serial.print(i);
  Serial.print(","); // Sends addition character right next to the previous value needed later in the Processing IDE for indexing
  
  Serial.print(distance2); // Sends the distance value into the Serial Port
  Serial.print("~"); // Sends addition character right next to the previous value needed later in the Processing IDE for indexing
  }
  
  // Repeats the previous lines from 165 to 15 degrees
  for(int i=165;i>15;i--){  
  myServo.write(i);
  delay(30);
  distance1 = calculateDistance(TRIGPIN1, ECHOPIN1);// Calls a function for calculating the distance measured by the Ultrasonic sensor for each degree
  distance2 = calculateDistance(TRIGPIN2, ECHOPIN2);
  Serial.print(i); // Sends the current degree into the Serial Port
  Serial.print(","); // Sends addition character right next to the previous value needed later in the Processing IDE for indexing

  Serial.print(distance1); // Sends the distance value into the Serial Port
  Serial.print(",");
  
  Serial.print(i);
  Serial.print(","); // Sends addition character right next to the previous value needed later in the Processing IDE for indexing
  
  Serial.print(distance2); // Sends the distance value into the Serial Port
  Serial.print("~"); // Sends addition character right next to the previous value needed later in the Processing IDE for indexing
  }
}
// Function for calculating the distance measured by the Ultrasonic sensor
int calculateDistance(int triger_pin, int echo_pin){ 
  
  digitalWrite(triger_pin, LOW); 
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(triger_pin, HIGH); 
  delayMicroseconds(10);
  digitalWrite(triger_pin, LOW);
  
  long duration_temp = pulseIn(echo_pin, HIGH); // Reads the echoPin1, returns the sound wave travel time in microseconds
  
  long distance_temp = duration_temp*0.034/2;
  return distance_temp;
}
