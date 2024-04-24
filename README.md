# Laundry Machine Management System


## Overview

The Laundry Machine Management System is a web-based application for remotely managing laundry machines using MQTT and ESP32 devices installed on each machine. This project leverages AWS services, React.js, Tailwind CSS, and Daisy UI for a seamless user experience.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Development](#development)
- [Documentation](#documentation)
- [License](#license)

## Prerequisites

Before we begin, ensure we have met the following requirements:

- Node.js and npm are installed on the development machine.
- AWS account credentials (Access Key ID and Secret Access Key).
- ESP32 devices installed on the laundry machines.
- MQTT broker (e.g., AWS IoT Core) set up and configured.

## Getting Started

Follow these steps to get the project up and running:

1. Clone the repository:

   ```shell
   git clone git@gitlab.com:inovtech-engineering/laundry-app-and-firmware.git

2. Install project dependencies:

    ```
    npm install
    ```
    
3. Set up the AWS credentials:
    
    ```
    aws configure
    ```

4. Configure the backend and MQTT broker settings (see Configuration).

   Start the development server:

    ```
    npm start
    ```
    
Open the web browser and navigate to http://localhost:3000 to access the front-end.

## Project Structure
The project is organized into the following directories:

- [frontend/](/frontend): Contains the React.js frontend application.
- [backend/](/backend): Houses the backend server and API code.
- [mqtt/](/mqtt): Manages MQTT communication with laundry machines.
- [documentation/](/documentation) : Includes additional project documentation.

## Configuration
To configure the project, we need to set up the following environment variables:

- REACT_APP_AWS_ACCESS_KEY_ID: AWS Access Key ID.\
- REACT_APP_AWS_SECRET_ACCESS_KEY: AWS Secret Access Key.\
- REACT_APP_AWS_REGION: The AWS region where services are hosted.\
- REACT_APP_MQTT_BROKER_ENDPOINT: The endpoint of MQTT broker (e.g., AWS IoT Core).\
- REACT_APP_MQTT_BROKER_PORT: The port of MQTT broker (e.g., AWS IoT Core).\

## Development
During development, we can run the frontend and backend servers independently using the provided npm scripts. Refer to the respective README files in the frontend/ and backend/ directories for more details.

## Documentation
Additional project documentation can be found in the documentation/ directory. This includes API documentation, data models, and other relevant information.

## License
This project is licensed under the MIT License.