import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import InputText from "../../../components/Input/InputText";
import SelectType from "../../../components/Input/SelectType";
import ErrorText from "../../../components/Typography/ErrorText";
import { showNotification } from "../../common/headerSlice";
import { addNewMachine } from "../machineSlice";
import MacAddressInput from "../../../containers/MacAddressInput";
import axios from "axios";
import {
    CountrySelect,
    StateSelect,
} from 'react-country-state-city';
import "react-country-state-city/dist/react-country-state-city.css";

import currentConfig from "../../../config";
const apiUrl= currentConfig.apiUrl;
const INITIAL_LEAD_OBJ = {
    MachineName: "",
    MacAddress: "",
    Country: "United States",
    State: "",
    StreetAddress: "",
    Model: "",
};

function AddMachineModalBody({ closeModal }) {
    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState("");
    const [machineObj, setMachineObj] = useState(INITIAL_LEAD_OBJ);
    const [countryid, setCountryid] = useState(233);
    const [stateid, setstateid] = useState(0);

    const saveNewMachine = async () => {
        if (machineObj.MachineName === "") return setErrorMessage("Machine Name is required!");
        else if (machineObj.MacAddress === "") return setErrorMessage("Mac Address is required!");
        else if (machineObj.Country === "") return setErrorMessage("Country is required!");
        else if (machineObj.State === "") return setErrorMessage("State is required!");
        else if (machineObj.StreetAddress === "") return setErrorMessage("Street Address is required!");
        else if (machineObj.Model === "") return setErrorMessage("Machine Type is required!");
        else {
            try {
                const response = await axios.post(`${apiUrl}/machines`, machineObj);

                if (response.status === 200) {
                    dispatch(addNewMachine({ newMachineObj: response.data }));
                    dispatch(showNotification({ message: "New Machine Added!", status: 1 }));
                    closeModal();
                } else {
                    console.error('Failed to add a new machine:', response.data);
                    setErrorMessage("Failed to add a new machine. Please try again.");
                }
            } catch (error) {
                console.error('Error adding a new machine:', error);
                setErrorMessage("Failed to add a new machine. Please try again.");
            }
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        setMachineObj({ ...machineObj, [updateType]: value });
    };

    const handleCountryChange = (e) => {
        setCountryid(e.id);
        setMachineObj({ ...machineObj, Country: e.name });
    };

    const handleStateChange = (e) => {
        setstateid(e.id);
        setMachineObj({ ...machineObj, State: e.name });
    };

    return (
        <>
            <InputText type="text" defaultValue={machineObj.MachineName} updateType="MachineName" containerStyle="mt-4" labelTitle="Machine Name" updateFormValue={updateFormValue} />
            <MacAddressInput
                value={machineObj.MacAddress}
                onChange={(formattedMac) => updateFormValue({ updateType: 'MacAddress', value: formattedMac })}
                containerStyle="mt-4"
                labelTitle="Mac Address"
            />
            <h6>Country</h6>
            <CountrySelect
                value={machineObj.Country}
                onChange={handleCountryChange}
                placeHolder="United States"
                containerStyle="mt-4"
                labelTitle="Country"
            />
            <h6>State</h6>
            <StateSelect
                value={machineObj.State}
                countryid={countryid}
                onChange={handleStateChange}
                placeHolder="Select State"
                containerStyle="mt-4"
                labelTitle="State"
            />
            <InputText
                type="text"
                defaultValue={machineObj.StreetAddress}
                updateType="StreetAddress"
                containerStyle="mt-4"
                labelTitle="Street Address"
                updateFormValue={updateFormValue}
            />

            <SelectType type="text" defaultValue={machineObj.Model} updateType="Model" containerStyle="mt-4" labelTitle="Model of Machine" updateFormValue={updateFormValue} options={[
                { label: "Select Model", value: "" },
                { label: "Type A", value: "Type A" },
                { label: "Type B", value: "Type B" },
            ]} />
            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewMachine()}>Save</button>
            </div>
        </>
    );
}

export default AddMachineModalBody;
