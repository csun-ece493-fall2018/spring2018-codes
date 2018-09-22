/*
 * California State University Northridge
 * ECE 493 Senior Design
 * Project: Ultrasonic radar
 * Participants: Hambartzum Gamburian, Giovanni Alonzo, Saba Janamian, Hamed Seyedroudbari, Andrew Zaragoza, Xiaoao Feng
 * Advisor: Dr. Shahnam Mirzaei
 * Code Description: P5js applicaiton to draw a radar graph in the browser
 * Author: Saba Janamian
 * Version: 1.0
 * Date: 3/7/2018
 */

var fade_angle = 60; 
var current_angle = 0.0;
var current_distance = 0.0;
var initial_reading = 0; 
var distance_between_sensor_1_2 = 10;

var number_of_circles = 5;
var number_of_lines = 8;
var distance_unit = "cm";
var max_distance = 200; 
var input4;
object_array = [];


var host = 'localhost:8888';
var socket; // the websocket
var sensorValue = 0; // the

function CircleClass(xx, yy, fc, aa, dd) {
  this.x = xx;
  this.y = yy;
  this.frameCount = fc;
  this.angle = aa;
  this.distance = dd;
  
  this.draw = function() {
    strokeWeight(5);
    stroke(235,244,247,95);
    fill(235,244,247,95);
    ellipse( this.x, this.y, 3, 3 );
    strokeWeight(0.5);
    line(0,0,this.x,this.y);
  }
} 

function setup(){ 
  createCanvas (window.innerWidth, window.innerHeight);
  pixelDensity(1);
  smooth();
  draw_control_box(window.innerWidth, window.innerHeight);
  socket = new WebSocket('ws://' + host+'/ws');
  // socket connection listener:
  socket.onopen = sendIntro;
  // socket message listener:
  socket.onmessage = readMessage;
 }

function draw(){ 
  var radius = get_radius();
  draw_window();
  set_up_radar_graphic();
  draw_circle(number_of_circles, radius);
  draw_line(number_of_lines, radius);
  draw_angle_text(number_of_lines, radius);
  draw_distance_text(number_of_circles, radius, max_distance, distance_unit);
  draw_radar_arrow(radius);

  //current_distance = getRndInteger(10, max_distance);
  draw_object(current_angle, current_distance, radius, max_distance);
 for(var i=0; i < object_array.length; i++){
  if (abs(current_angle-object_array[i].angle) > fade_angle){
    object_array.splice(i,1);
  }else {
  object_array[i].draw();            
  }
}

}

function sendIntro() {
  // convert the message object to a string and send it:
  //socket.send("Hello");
}

function readMessage(event) {

  var msg = JSON.parse(event.data);
  console.log(event);
  serialEventHandler(msg.value);
}


function serialEventHandler(myPort) { // starts reading data from the Serial Port

  var index1=0;
  var index2=0;
  var index3=0;

  var data = myPort;
    
  var count = data.split(",").length - 1;
  
  if (initial_reading == 0){
    initial_reading = 1;
  } else if(count == 3) {
  data = data.split(",");
  
  var angle1 = data[0];
  var distance1 = data[1];
  var angle2 = data[2];
  var distance2 = data[3].slice(0,-1);

  console.log(angle1, distance1, angle2, distance2);
  // calculate the distance 
  var s = ((distance1) + (distance2) + distance_between_sensor_1_2)/2;
  var area = sqrt(s*(s-distance1)*(s-distance2)*(s-distance_between_sensor_1_2));
  current_distance = 2*area/distance_between_sensor_1_2;
  console.log(current_distance);
  current_angle = angle1;
  
  }
}

function set_up_radar_graphic(){
  translate(width/2,height/2); // Move the coordinate to the center of the window.
}

function get_radius() {
  var radius = 0;
  if (width <= height) {
    radius = (width/2)*0.85;
  } else {
    radius = (height/2)*0.85;
  }
  return radius;
}

function draw_window(){
  push();
  // simulating motion blur and slow fade of the moving line
  fill(98,245,31);
  noStroke();
  fill(0,4); 
  rect(0, 0, width, height);
  pop();
}

function draw_circle(number_of_circles, radius) {
  push();
  noFill();
  strokeWeight(2);
  stroke(98,245,31); // green color
  ellipseMode(RADIUS);  // Set ellipseMode to RADIUS
  var circle_step = 100 / number_of_circles;
  var temp_circle_step = 0.00;
  ellipse(0, 0, radius*0.001, radius*0.001);
  for (var i=0; i < number_of_circles; i++){
    temp_circle_step = temp_circle_step+circle_step;
    ellipse(0, 0, radius*(temp_circle_step/100), radius*(temp_circle_step/100));
  }
  pop();
}

function draw_line(number_of_lines, radius){
  push();
  stroke(98,245,31); // green color
  var line_step = 360 / number_of_lines;
  var temp_line_step = 0.00;
  for (var i=0; i < number_of_lines; i++){
    line(0,0,(radius)*cos(radians(temp_line_step)),-(radius)*sin(radians(temp_line_step)));
    temp_line_step = temp_line_step+line_step;
  }
  pop();
}

function draw_angle_text(number_of_text, radius) { // draws the texts on the screen
  textSize(25);
  fill(98,245,60);
  
  var text_step = 360 / number_of_text;
  var temp_text_step = 0.00;

  temp_text_step = 0.00;
  for (var i=0; i < number_of_text; i++){
    if(cos(radians(temp_text_step)) > 0){
     text(temp_text_step+"°",(radius)*cos(radians(temp_text_step))*1.05,-(radius)*sin(radians(temp_text_step))*1.1);
    }else {
     text(temp_text_step+"°",(radius)*cos(radians(temp_text_step))*1.3,-(radius)*sin(radians(temp_text_step))*1.1);
    }
    temp_text_step = round_int(temp_text_step+text_step,1);
}
}


function draw_distance_text(number_of_text, radius, max_distance, distance_unit) { // draws the texts on the screen
  
  textSize(15);
  fill(98,245,60);
  var text_step = 100 / number_of_text;
  var temp_text_step = 0.00;
  var text_step_for_draw = max_distance / number_of_text;
  var temp_text_step_for_draw = 0.0;
  temp_text_step = 0.00;
  for (var i=0; i < number_of_text; i++){
    temp_text_step = temp_text_step+text_step;
    temp_text_step_for_draw = round_int(temp_text_step_for_draw + text_step_for_draw, 1);
    
    push();
    translate(radius*(temp_text_step/100)*1.02,height*0.02);
    rotate(-radians(-45));
    text(temp_text_step_for_draw+" "+distance_unit,0,0);
    pop();
  }
  
}

function draw_radar_arrow(radius){
  push();
  strokeWeight(15);
  stroke(30,250,60);
  line(0,0,(radius*0.98)*cos(radians(current_angle)),-(radius*0.98)*sin(radians(current_angle))); // draws the line according to the angle
  pop();
}

function draw_object(angle, distance, radius, max_distance) {
  push();

  var px_distance = distance*radius/ max_distance; // distance from the sensor to the object in pixels
  console.log(distance, radius, max_distance, px_distance);
  object_array.push(new CircleClass( px_distance*cos(radians(angle)), px_distance*sin(-radians(angle )), frameCount, angle, distance ) );
  pop();
}

// DOM elements functions
function draw_control_box(w,h){
  label1 = createSpan('System Control');
  label1.position(25, 25);
  label1.style('color', '#FFFFFF');
  label1.style('font-size', '1.75em');
  input_box_size = '40px';
  //////////////////////////
  var control_div = createDiv('');
  control_div.position(20,75);
  control_div.style('border','1px solid #FFFFFF');
  control_div.style('width','13em');
  control_div.style('height', (h*.8)+'px');
  control_div.style('padding', '1em');
  //////////////////////////
  input2 = createInput();
  input2.position(35, 85);
  input2.style('width', input_box_size);
  input2.input(update_circle_number);
  input2.value(number_of_circles)

  label2 = createSpan('Distance divison');
  label2.position(input2.x+input2.width+10, input2.y+2);
  label2.style('color', '#FFFFFF');
  //////////////////////////
  input3 = createInput();
  input3.position(35, 125);
  input3.style('width', input_box_size);
  input3.input(update_line_number);
  input3.value(number_of_lines)

  label3 = createSpan('Angle divison');
  label3.position(input3.x+input3.width+10, input3.y+2);
  label3.style('color', '#FFFFFF');
  //////////////////////////
  input4 = createInput();
  input4.position(35, 165);
  input4.style('width', input_box_size);
  input4.input(update_max_distance);
  input4.value(max_distance)

  label4 = createSpan('Range (cm)');
  label4.position(input4.x+input4.width+10, input4.y+2);
  label4.style('color', '#FFFFFF');


}

function update_circle_number(){
number_of_circles = this.value();
}

function update_line_number(){
number_of_lines = this.value();
}

function update_max_distance(){
  max_distance = this.value();
}

// Helper functions
function round_int(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}