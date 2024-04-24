import React, {useEffect, useState} from "react";
import {mqtt5, auth, iot} from "aws-iot-device-sdk-v2";
import {once} from "events";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";

import {toUtf8} from "@aws-sdk/util-utf8-browser";
// @ts-ignore
import jquery from "jquery";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import currentConfig from "../../../config";

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


function Mqtt5({MacAddressMqtt5, customFunction}) {

    let client: mqtt5.Mqtt5Client;
    const paymentTopic = "esp32/sub/" + MacAddressMqtt5;
    const feedbackTopic = "esp32/pub/" + MacAddressMqtt5;
    console.log("paymentTopic: " + paymentTopic);
    console.log("feedbackTopic: " + feedbackTopic);

    // State variables for coin acceptors


    async function CloseConnection() {

        const disconnection = once(client, "disconnection");
        const stopped = once(client, "stopped");

        client.stop();

        await disconnection;
        await stopped;
    }

    const [isLoading, setIsLoading] = useState(false);
    const [isPaid, setIsPaid] = useState(false);

    function timeout(delay: number) {
        return new Promise(res => setTimeout(res, delay));
    }


    async function sendCoinDrop1(theMessage) {
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
                {qos: mqtt5.QoS.AtLeastOnce, topicFilter: feedbackTopic},
            ]
        });
        console.log('Suback result: ' + JSON.stringify(suback));
        setIsLoading(true);
  


        const message = {
            action: theMessage,
            MacAddress: MacAddressMqtt5,
            CoinAcceptor1: 1, // Include Coin Acceptor 1 value in the message
            CoinAcceptor2: 0, // Include Coin Acceptor 2 value in the message
        };
        try {
            const publishResult = await client.publish({

                qos: mqtt5.QoS.AtLeastOnce,
                topicName: paymentTopic,
                payload: JSON.stringify(message),

            });
            console.log("MacAddressMqtt5: ");
            console.log(MacAddressMqtt5.MacAddressMqtt5);
            console.log("message: ");
            console.log(message);
            console.log('Payment Event Published: ' + JSON.stringify(publishResult));
            setIsLoading(false);
            setIsPaid(true);
        } catch (error) {
            console.log('Error publishing payment event: ' + error.toString());
            setIsLoading(false);
        }
    }

    async function sendCoinDrop2(theMessage) {
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
                {qos: mqtt5.QoS.AtLeastOnce, topicFilter: feedbackTopic},
            ]
        });
        console.log('Suback result: ' + JSON.stringify(suback));
        setIsLoading(true);



        const message = {
            action: theMessage,
            MacAddress: MacAddressMqtt5,
            CoinAcceptor1: 0, // Include Coin Acceptor 1 value in the message
            CoinAcceptor2: 1, // Include Coin Acceptor 2 value in the message
        };
        try {
            const publishResult = await client.publish({

                qos: mqtt5.QoS.AtLeastOnce,
                topicName: paymentTopic,
                payload: JSON.stringify(message),

            });
            console.log("MacAddressMqtt5: ");
            console.log(MacAddressMqtt5.MacAddressMqtt5);
            console.log("message: ");
            console.log(message);
            console.log('Payment Event Published: ' + JSON.stringify(publishResult));
            setIsLoading(false);
            setIsPaid(true);
        } catch (error) {
            console.log('Error publishing payment event: ' + error.toString());
            setIsLoading(false);
        }
    }
    
    return (
        <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2">
                {/* Text fields for Coin Acceptor 1 and Coin Acceptor 2 */}
                {/*<label className="mr-1">Coin Acceptor 1</label>
                <input
                    type="number"
                    style={{
                        backgroundColor: "#F3F4F6",
                        borderRadius: "0.375rem",
                        padding: "0.375rem 0.75rem",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        lineHeight: "1.5rem",
                        color: "#1F2937",
                        transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        outline: "none",
                        boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.5)"
                    }}
                    placeholder="Coin Acceptor 1"
                    value={coinAcceptor1}
                    onChange={(e) => setCoinAcceptor1(parseInt(e.target.value) || 0)}
                />*/}
                <button
                    className=" btn btn-lg  btn-success mr-2"
                    onClick={() => {

                        sendCoinDrop1("PaymentSuccess", 1).then((r) => {
                            console.log("PaymentSuccess");
                            console.log(MacAddressMqtt5);
                            timeout(4000).then((r) => {
                                customFunction();
                            });
                        });
                    }}
                    // disabled={isLoading || isPaid || (coinAcceptor1 === 0 && coinAcceptor2 === 0)}
                >

                    <CreditCardIcon className="w-7"/>
                    {isPaid ? "Payment Successful" : "Drop Coin 1"}
                </button>

            </div>
            <div className="col-span-2">
                {/*<label className="mr-2">Coin Acceptor 2</label>
                <input
                    type="number"
                    style={{
                        backgroundColor: "#F3F4F6",
                        borderRadius: "0.375rem",
                        padding: "0.375rem 0.75rem",
                        border: "1px solid #E5E7EB",
                        fontSize: "1rem",
                        lineHeight: "1.5rem",
                        color: "#1F2937",
                        transition: "border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                        outline: "none",
                        boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.5)"
                    }}
                    placeholder="Coin Acceptor 2"
                    value={coinAcceptor2}
                    onChange={(e) => setCoinAcceptor2(parseInt(e.target.value) || 0)}
                />*/}
                <button
                    className=" btn btn-lg  btn-success mr-2"
                    onClick={() => {

                        sendCoinDrop2("PaymentSuccess", 2).then((r) => {
                            console.log("PaymentSuccess");
                            console.log(MacAddressMqtt5);
                            timeout(4000).then((r) => {
                                customFunction();
                            });
                        });
                    }}
                    // disabled={isLoading || isPaid || (coinAcceptor1 === 0 && coinAcceptor2 === 0)}
                >

                    <CreditCardIcon className="w-7"/>
                    {isPaid ? "Payment Successful" : "Drop Coin 2"}
                </button>

            </div>
            <div className="col-span-1">

                {/*<button
                    className=" btn btn-lg  btn-success mr-2"
                    onClick={() => {
                        sendCoinDrop("PaymentSuccess").then((r) => {
                            console.log("PaymentSuccess");
                            console.log(MacAddressMqtt5);
                            timeout(4000).then((r) => {
                                customFunction();
                            });
                        });
                    }}
                    // disabled={isLoading || isPaid || (coinAcceptor1 === 0 && coinAcceptor2 === 0)}
                >

                    <CreditCardIcon className="w-7"/>
                    {isPaid ? "Payment Successful" : "Pay"}
                </button>*/}
            </div>
        </div>
    );
}

export default Mqtt5;
