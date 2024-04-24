#include "secrets.h"
#include <MQTTClient.h>
#include <ArduinoJson.h>
#include "WiFi.h"
#include <NTPClient.h>
#include <HTTPClient.h> // Include the HTTPClient library
#include <freertos/FreeRTOS.h>
#include <freertos/task.h>
#include <uuid.h>
#include <WiFiUdp.h>
// The MQTT topics that this device should publish/subscribe

//#define TEST_CNX ""
//#define CONFIRM_CNX ""

//simulation buttons
#define b1 34
#define b25 35
#define bc 17
#define led 14
#define TMUX1 13
#define TMUX025 18
//simulation buttons
int coin1 = 0;
int coin2 = 0;
String formattedTime = "";
bool x;
String origin, MAC, AWS_IOT_SUBSCRIBE_TOPIC, AWS_IOT_PUBLISH_TOPIC, AWS_IOT_PUBLISH_PAYMENT_TOPIC;
float amount;
int CoinAcceptor1, CoinAcceptor2;
float total = 0;
int Analag_Input_1, Analog_Input_025;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
WiFiClientSecure net = WiFiClientSecure();
MQTTClient client = MQTTClient(256);
// Message buffer
const int MAX_BUFFER_SIZE = 10; // Adjust as needed
String messageBuffer[MAX_BUFFER_SIZE];
int messageIndex = 0;
bool connectionLost = false; // Flag to track connection status
bool internetAccessLost = false; // Flag to track internet access status



TaskHandle_t publishTask;
TaskHandle_t connectionTask;
SemaphoreHandle_t bufferMutex;

// Define the interval (in milliseconds) to check for internet access
const unsigned long INTERNET_CHECK_INTERVAL = 5000; // Check every 5 seconds

// The last time internet access was checked
unsigned long lastInternetCheckTime = 0;

bool checkInternetAccess() {
  // Check if it's time to check for internet access
  if (millis() - lastInternetCheckTime >= INTERNET_CHECK_INTERVAL) {
    lastInternetCheckTime = millis();

    // Create an HTTPClient object to make an HTTP request
    HTTPClient http;
    http.begin("http://www.google.com"); // Use "http" instead of "https" for simplicity

    int httpCode = http.GET();
    http.end();

    return httpCode == 200; // Return true if the HTTP request succeeded
  }

  // If it's not time to check, assume internet access is available
  return true;
}

void checkConnectivity() {
  if (!client.connected()) {
    // Configure WiFiClientSecure to use the AWS IoT device credentials
    net.setCACert(AWS_CERT_CA);
    net.setCertificate(AWS_CERT_CRT);
    net.setPrivateKey(AWS_CERT_PRIVATE);

    // Connect to the MQTT broker on the AWS endpoint we defined earlier
    client.begin(AWS_IOT_ENDPOINT, 8883, net);

    // Create a message handler
    client.onMessage(messageHandler);

    Serial.print("Connecting to AWS IOT");

    while (!client.connect(THINGNAME)) {
      Serial.print(".");
      delay(100);
    }

    if (!client.connected()) {
      Serial.println("AWS IoT Timeout!");
      return;
    }

    // Subscribe to the topic with QoS 1

    Serial.println("AWS IoT Connected!");
    MAC = WiFi.macAddress();
    AWS_IOT_SUBSCRIBE_TOPIC = "esp32/sub/" + MAC;
    AWS_IOT_PUBLISH_PAYMENT_TOPIC = "esp32/pub/payment";
    AWS_IOT_PUBLISH_TOPIC = "esp32/pub/" + MAC;
    
    Serial.println("AWS_IOT_PUBLISH_TOPIC :" + AWS_IOT_PUBLISH_TOPIC);
    client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC, 1);
    Serial.println("SUBSCRIBED TO: " + AWS_IOT_SUBSCRIBE_TOPIC);
    //client.subscribe(TEST_CNX, 1);
  }
}

void connectAWS() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.println("Connecting to Wi-Fi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Configure NTP client
  timeClient.begin();
  timeClient.setTimeOffset(3600); // Set time zone (in seconds, for UTC+2)

  // Configure WiFiClientSecure to use the AWS IoT device credentials
  net.setCACert(AWS_CERT_CA);
  net.setCertificate(AWS_CERT_CRT);
  net.setPrivateKey(AWS_CERT_PRIVATE);

  // Connect to the MQTT broker on the AWS endpoint we defined earlier
  client.begin(AWS_IOT_ENDPOINT, 8883, net);

  // Create a message handler
  client.onMessage(messageHandler);

  Serial.print("Connecting to AWS IOT");

  while (!client.connect(THINGNAME)) {
    Serial.print(".");
    delay(100);
  }

  if (!client.connected()) {
    Serial.println("AWS IoT Timeout!");
    return;
  }

  // Subscribe to the topic with QoS 1

  Serial.println("AWS IoT Connected!");
  MAC = WiFi.macAddress();
  AWS_IOT_SUBSCRIBE_TOPIC = "esp32/sub/" + MAC;
  AWS_IOT_PUBLISH_PAYMENT_TOPIC = "esp32/pub/payment";
  AWS_IOT_PUBLISH_TOPIC = "esp32/pub/" + MAC;
  Serial.println("AWS_IOT_SUBSCRIBE_TOPIC :" + AWS_IOT_SUBSCRIBE_TOPIC);
  Serial.println("AWS_IOT_PUBLISH_TOPIC :" + AWS_IOT_PUBLISH_TOPIC);
  client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC, 1);
  //client.subscribe(TEST_CNX, 1);

}
void publishMessage(const String& origin, int CoinAcceptor1, int CoinAcceptor2) {
  while (!timeClient.update()) {
    timeClient.forceUpdate();
  }
  Serial.println("msg1");
  unsigned long epochTime = timeClient.getEpochTime();
  time_t timeValue = static_cast<time_t>(epochTime);

  struct tm timeinfo;
  gmtime_r(&timeValue, &timeinfo);

  char formattedTime[20];
  char formattedDate[20];

  strftime(formattedTime, sizeof(formattedTime), "%H:%M:%S", &timeinfo); // Format the time
  strftime(formattedDate, sizeof(formattedDate), "%Y-%m-%d", &timeinfo); // Format the date

  StaticJsonDocument<200> doc;
  doc["time"] = formattedTime; // Use the formatted time
  doc["Date"] = formattedDate; // Use the formatted date
  doc["MacAddress"] = WiFi.macAddress();
  doc["Origin"] = origin;
  doc["CoinAcceptor1"] = CoinAcceptor1;
  doc["CoinAcceptor2"] = CoinAcceptor2;
  char jsonBuffer[512];
  serializeJson(doc, jsonBuffer);
  Serial.println("msg2");
  if (client.connected()) {
    Serial.println("msg3");
    client.publish(AWS_IOT_PUBLISH_PAYMENT_TOPIC, jsonBuffer);
    Serial.println("msg4");
  } else {
    Serial.println("msg3+");
    if (xSemaphoreTake(bufferMutex, portMAX_DELAY) == pdTRUE) {
      messageBuffer[messageIndex] = jsonBuffer;
      messageIndex = (messageIndex + 1) % MAX_BUFFER_SIZE;
      xSemaphoreGive(bufferMutex);
    }
  }
  vTaskDelay(500 / portTICK_PERIOD_MS);
}


void messageHandler(const String &topic, const String &payload) {
  Serial.println("Incoming message on topic: " + topic);
  Serial.println("Payload: " + payload);

  // Parse the JSON payload
  DynamicJsonDocument doc(1024); // Adjust the size as needed
  DeserializationError error = deserializeJson(doc, payload);

  // Check for parsing errors
  if (error) {
    Serial.print("JSON parsing error: ");
    Serial.println(error.c_str());
    return; // Exit the function if there's an error
  }

  // Check if the JSON object contains a "MacAddress" field
  if (doc.containsKey("MacAddress") && doc.containsKey("CoinAcceptor1") && doc.containsKey("CoinAcceptor2")) {
    float PayloadCoinAcceptor1 = doc["CoinAcceptor1"].as<int>();
    float PayloadCoinAcceptor2 = doc["CoinAcceptor2"].as<int>();
    String macAddress = doc["MacAddress"].as<String>();

    for (int i = 0; i < PayloadCoinAcceptor1; i++) {
      triggerCoinAcceptor(TMUX1, coin1);
    }

    for (int i = 0; i < PayloadCoinAcceptor2; i++) {
      triggerCoinAcceptor(TMUX025, coin2);
    }

    coin1 = 0;
    coin2 = 0;


    // Get the ESP32's MAC address
    String esp32MacAddress = WiFi.macAddress();
    checkConnectivity();
    // Compare the received MAC address with the ESP32's MAC address
    if (macAddress.equals(esp32MacAddress)) {
      Serial.println("MAC addresses match.");
      // Simulation_Web_Pay();
      publishMessage("Web", PayloadCoinAcceptor1, PayloadCoinAcceptor2);
      Serial.println("Payment successful!");
      // Perform actions for a successful payment here
    } else {
      Serial.println("MAC addresses do not match. Payment not recognized.");
      // Perform actions for an unrecognized payment here
    }
  }
  if (doc.containsKey("TestConnection")) {
    Serial.println("test cnx msg recieved");
    String UUID_cnx_test = doc["TestConnection"].as<String>();
    StaticJsonDocument<200> responseDoc;
    responseDoc["TestConnection"] = UUID_cnx_test;
    char responseBuffer[512];
    serializeJson(responseDoc, responseBuffer);
    if (client.connected()) {
      // Publish the response message
      client.publish(AWS_IOT_PUBLISH_TOPIC, responseBuffer);
      Serial.println("Test connection successful! Response sent.");
    } else {
      Serial.println("MQTT not connected. Test connection response not sent.");
    }
  }
}

void triggerCoinAcceptor(int pin, int coin) {
  Serial.println("Coin dropped.");
  coin++;
  total += 1;
  digitalWrite(pin, HIGH);
  delay(500);
  digitalWrite(pin, LOW);
  delay(500);
}



void HandleButton() {

  if (Analog_Read_1() && total <= 3.25) {
    delay(200);
    Serial.println("$1 Coin dropped.");
    coin1++;
    total += 1;
  }
  if (Analog_Read_025() && total <= 4) {
    delay(200);
    coin2++;
    Serial.println("$0.25 Coin dropped.");
    total += 0.25;
  }
  if (digitalRead(bc) == true) {
    delay(200);
    coin1 = 0;
    coin2 = 0;
    Serial.println("operation cancelled");
    total = 0;
  }

  if (total == 4.5) {

    Serial.println("Amount reached");
    publishMessage("Machine", coin1, coin2);
    Serial.println("Payment successful!");
    digitalWrite(led, HIGH);
    delay(1000);
    digitalWrite(led, LOW);
    delay(1000);
    coin1 = 0;
    coin2 = 0;
    total = 0;
  }
}
bool Analog_Read_1() {
  Analag_Input_1 = analogRead(b1);
  if (Analag_Input_1 < 3000 && Analag_Input_1 > 2700) {
    while (Analag_Input_1 < 2900) {
      Analag_Input_1 = analogRead(b1);
      delay(20);
    } return true;
  }
  else return false;
}
bool Analog_Read_025() {
  Analog_Input_025 = analogRead(b25);
  if (Analog_Input_025 < 3000 && Analog_Input_025 > 2700) {
    while (Analog_Input_025 < 2900) {
      Analog_Input_025 = analogRead(b25);
      delay(20);
    } return true;
  }
  else return false;
}
void Simulation_Web_Pay() {
  for (int i = 0; i < 4; i++) {
    digitalWrite(TMUX1, HIGH);
    delay(100);
    digitalWrite(TMUX1, LOW);
    delay(1000);
  }
  digitalWrite(TMUX025, HIGH);
  delay(100);
  digitalWrite(TMUX025, LOW);
  delay(1000);
}

void connectionTaskFunction(void *pvParameters) {
  bool previouslyConnected = false;

  while (1) {
    if (connectionLost || !checkInternetAccess()) {
      Serial.println("Connection lost or no internet access. Reconnecting...");
      connectionLost = true; // Set the connectionLost flag

      // Check for internet access
      if (!checkInternetAccess()) {
        Serial.println("Internet access is lost.");
      } else {
        Serial.println("Internet access is available.");
      }

      // Only attempt to reconnect if there was a previous successful connection
      if (previouslyConnected) {
        // Attempt to reconnect to the MQTT broker
        while (!client.connect(THINGNAME)) {
          Serial.print(".");
          delay(1000); // Wait for a second before the next retry
        }

        if (client.connected()) {
          Serial.println("\nReconnected to AWS IoT.");
          connectionLost = false; // Clear the connectionLost flag
          // Once reconnected, subscribe to topics or perform other actions

          // Process messages in the buffer and send them
          for (int i = 0; i < MAX_BUFFER_SIZE; i++) {
            if (xSemaphoreTake(bufferMutex, portMAX_DELAY) == pdTRUE) {
              if (messageBuffer[i].length() > 0) {
                // Publish the message to AWS IoT
                client.publish(AWS_IOT_PUBLISH_TOPIC, messageBuffer[i]);
                Serial.println("Sent message from buffer: " + messageBuffer[i]);
                messageBuffer[i] = ""; // Clear the processed message
              }
              xSemaphoreGive(bufferMutex);
            }
          }

          client.subscribe(AWS_IOT_SUBSCRIBE_TOPIC, 1);
        } else {
          Serial.println("\nFailed to reconnect to AWS IoT. Retrying in 5 seconds...");
          delay(5000); // Wait for 5 seconds before the next retry
        }
      }

      previouslyConnected = false;
    } else {
      // Update the flag when a successful connection is established
      if (client.connected()) {
        previouslyConnected = true;
      }
    }

    vTaskDelay(1000 / portTICK_PERIOD_MS); // Adjust the delay as needed
  }
}
void mqttTask(void *pvParameters) {
  while (1) {
    client.loop(); // Call client.loop() inside the task
    // Other MQTT-related code
    vTaskDelay(100 / portTICK_PERIOD_MS); // Adjust the delay as needed
  }
}



void setup() {
  Serial.begin(9600);
  pinMode(b1, INPUT);
  pinMode(b25, INPUT);
  pinMode(bc, INPUT);
  pinMode(led, OUTPUT);
  pinMode(TMUX1, OUTPUT);
  pinMode(TMUX025, OUTPUT);

  connectAWS();


  //client.subscribe(TEST_CNX, 1);
  // Create a mutex to protect access to messageBuffer
  bufferMutex = xSemaphoreCreateMutex();
  xTaskCreatePinnedToCore(connectionTaskFunction, "ConnectionTask", 16384, NULL, 1, &connectionTask, 0);
  xTaskCreatePinnedToCore(mqttTask, "MqttTask", 16384, NULL, 1, NULL, 0); // Adjust stack size as needed
}

void loop() {
  HandleButton();

}
