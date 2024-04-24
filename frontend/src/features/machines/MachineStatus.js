import React, {useEffect, useState} from "react";
import {mqtt5, auth, iot} from "aws-iot-device-sdk-v2";
import {once} from "events";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

import currentConfig from "../../config";
import {toUtf8} from "@aws-sdk/util-utf8-browser";
// @ts-ignore
import jquery from "jquery";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";

const {v4: uuidv4} = require('uuid');

const $: JQueryStatic = jquery;
//get AWS_REGION, AWS_COGNITO_IDENTITY_POOL_ID, AWS_IOT_ENDPOINT from .env file
const AWS_REGION = currentConfig.REACT_APP_AWS_REGION;
const AWS_COGNITO_IDENTITY_POOL_ID = currentConfig.REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID;
const AWS_IOT_ENDPOINT = currentConfig.REACT_APP_AWS_IOT_ENDPOINT;


/**
 * AWSCognitoCredentialOptions. The credentials options used to create AWSCongnitoCredentialProvider.
 */
interface AWSCognitoCredentialOptions {
    IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
    Region: AWS_REGION
}


class MyAWSCognitoCredentialsProvider extends auth.CredentialsProvider {
    identityId: string;
    options: AWSCognitoCredentialOptions;
    cachedCredentials: fromCognitoIdentityPool;

    constructor(options: AWSCognitoCredentialOptions, expire_interval_in_ms?: number) {
        super();
        this.options = options;

        setInterval(async () => {
            await this.refreshCredentials();
        }, expire_interval_in_ms ?? 3600 * 1000);
    }

    getCredentials(): auth.AWSCredentials {
        return {
            aws_access_id: this.cachedCredentials?.accessKeyId ?? "",
            aws_secret_key: this.cachedCredentials?.secretAccessKey ?? "",
            aws_sts_token: this.cachedCredentials?.sessionToken,
            aws_region: this.options.Region
        }
    }

    async refreshCredentials() {
        console.log('Fetching Cognito credentials');
        this.cachedCredentials = await fromCognitoIdentityPool({
            // Required. The unique identifier for the identity pool from which an identity should be
            // retrieved or generated.
            identityPoolId: this.options.IdentityPoolId,
            region: this.options.Region,
            clientConfig: {region: this.options.Region},
        })();
    }
}

function createClient(provider: MyAWSCognitoCredentialsProvider): mqtt5.Mqtt5Client {

    let wsConfig: iot.WebsocketSigv4Config = {
        credentialsProvider: provider,
        region: AWS_REGION
    }

    let builder: iot.AwsIotMqtt5ClientConfigBuilder = iot.AwsIotMqtt5ClientConfigBuilder.newWebsocketMqttBuilderWithSigv4Auth(
        AWS_IOT_ENDPOINT,
        wsConfig
    )

    let client: mqtt5.Mqtt5Client = new mqtt5.Mqtt5Client(builder.build());

    client.on('error', (error) => {
        console.log("Error event: " + error.toString());
    });

    client.on("messageReceived", (eventData: mqtt5.MessageReceivedEvent): void => {
        console.log("Message Received event: " + JSON.stringify(eventData.message));
        if (eventData.message.payload) {

            console.log("  with payload: " + toUtf8(Buffer.from(eventData.message.payload)));
        }
    });

    client.on('attemptingConnect', (eventData: mqtt5.AttemptingConnectEvent) => {
        console.log("Attempting Connect event");
    });

    client.on('connectionSuccess', (eventData: mqtt5.ConnectionSuccessEvent) => {
        console.log("Connection Success event");
        console.log("Connack: " + JSON.stringify(eventData.connack));
        console.log("Settings: " + JSON.stringify(eventData.settings));
    });

    client.on('connectionFailure', (eventData: mqtt5.ConnectionFailureEvent) => {
        console.log("Connection failure event: " + eventData.error.toString());
    });

    client.on('disconnection', (eventData: mqtt5.DisconnectionEvent) => {
        console.log("Disconnection event: " + eventData.error.toString());
        if (eventData.disconnect !== undefined) {
            console.log('Disconnect packet: ' + JSON.stringify(eventData.disconnect));
        }
    });

    client.on('stopped', (eventData: mqtt5.StoppedEvent) => {
        console.log("Stopped event");
    });

    return client;
}


function MachineStatus({MacAddressMqtt5}) {

    let client: mqtt5.Mqtt5Client;
    const checkConnectivityTopic = "esp32/sub/" + MacAddressMqtt5;
    const connectivityFeedbackTopic = "esp32/pub/" + MacAddressMqtt5;


    const [isLoading, setIsLoading] = useState(false);
    const [isConnectionTested, setIsConnectionTested] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }


    async function checkConnectivity() {
        const provider = new MyAWSCognitoCredentialsProvider({
            IdentityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
            Region: AWS_REGION
        });
        /** Make sure the credential provider fetched before setup the connection */
        await provider.refreshCredentials();

        client = createClient(provider);

        const attemptingConnect = once(client, "attemptingConnect");
        const connectionSuccess = once(client, "connectionSuccess");

        client.start();

        await attemptingConnect;
        await connectionSuccess;

        const suback = await client.subscribe({
            subscriptions: [
                {qos: mqtt5.QoS.AtLeastOnce, topicFilter: connectivityFeedbackTopic},
            ]
        });
        console.log('Suback result: ' + JSON.stringify(suback));
        setIsLoading(true);
        const TestID = uuidv4();
        // Correct the structure of theMessage
        const message = {
            TestConnection: TestID,
        };
        try {
            const publishResult = await client.publish({

                qos: mqtt5.QoS.AtLeastOnce,
                topicName: checkConnectivityTopic,
                payload: JSON.stringify(message),

            });
            console.log("MacAddressMqtt5 esta: ");
            console.log(MacAddressMqtt5);
            console.log("message: ");
            console.log(message);
            console.log('Connection Test Published: ' + JSON.stringify(publishResult));
            //set a delay of 2000 ms to wait for the response
            setTimeout(() => {

                setIsLoading(false);
            }, 1000); // Adjust the delay time as needed
            client.on('messageReceived', (eventData) => {
                const message = JSON.parse(toUtf8(Buffer.from(eventData.message.payload)));
                if (message.TestConnection === TestID) {
                    setIsConnected(true);
                }
            });

            //setIsConnectionTested(true);
        } catch (error) {
            console.log('Error publishing Connection Test event: ' + error.toString());
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // Call checkConnectivity when the component mounts
        checkConnectivity().then(r => console.log("checkConnectivity() executed"));
    }, []);

    return (
        <div>
            {isLoading ? (

                <span className="badge animate-pulse"></span>


            ) : isConnected ? (
                <span className="badge badge-success"></span>
                // <span style={{color: 'green'}}>Connected</span>
                ) : (
                <span className="badge badge-error"></span>
                // <span style={{color: 'red'}}>Disconnected</span>
    )
}
</div>
)
    ;
}

export default MachineStatus;
