import { useState } from "react"
import { useDispatch } from "react-redux"
import InputText from '../../../components/Input/InputText'
import SelectType from "../../../components/Input/SelectType"; // Importez InputValue
import ErrorText from '../../../components/Typography/ErrorText'
import { showNotification } from "../../common/headerSlice"
import { addNewAccount } from "../AccountSlice"
import MacAddressInput from '../../../containers/MacAddressInput';
import axios from 'axios'
import CryptoJS from 'crypto-js';


import currentConfig from "../../../config";
const apiUrl = currentConfig.apiUrl;
let Password = "";
let ConfirmPassword = "";
const INITIAL_Account_OBJ = {
    Username: "",
    BirthDate: "",
    PhoneNumber: "",
    Email: "",
    PasswordHash: ""
}

function AddAccountModelBody({ closeModal }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [accountObj, setAccountObj] = useState(INITIAL_Account_OBJ)
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")




    const saveNewAccount = async () => {
        if (accountObj.Username === "") return setErrorMessage("Account Name is required!")
        else if (accountObj.BirthDate === "") return setErrorMessage("Birth Date is required!")
        else if (accountObj.PhoneNum === "") return setErrorMessage("Phone Number is required!");
        else if (accountObj.Email === "") return setErrorMessage("Email is required!");
        else if (Password === "") return setErrorMessage("Password is required!");
        else if (Password !== ConfirmPassword) return setErrorMessage("Passwords do not match!"); // Check password confirmation
        else {
            try {
                accountObj.PasswordHash = CryptoJS.AES.encrypt(Password, 'inovtech').toString();

                const response = await axios.post(`${apiUrl}/users`, accountObj);

                if (response.status === 200) {
                    dispatch(addNewAccount({ newaccountObj: response.data }));
                    dispatch(showNotification({ message: "New account Added!", status: 1 }));
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
    }


    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage("");
        console.log("updateType is:", updateType);

        console.log("UPDATED AccountName:", value);
        setAccountObj({ ...accountObj, [updateType]: value });

        console.log(`${updateType}: ${value}`);
        // console.log("AccountName:", value);
    }

    const updatePassword = ({ updateType, value }) => {
        setErrorMessage("");
        console.log("updateType is:", updateType);

        console.log("UPDATED Password:", value);
        setPassword(value); // Update the Password variable
    }

    const updateConfirmPassword = ({ updateType, value }) => {
        setErrorMessage("");
        console.log("updateType is:", updateType);

        console.log("UPDATED ConfirmPassword:", value);
        setConfirmPassword(value); // Update the ConfirmPassword variable
    }


    return (
        <>

            <InputText type="text" defaultValue={accountObj.Username} updateType="Username" containerStyle="mt-4" labelTitle="User Name" updateFormValue={updateFormValue} />
            <InputText type="text" defaultValue={accountObj.BirthDate} updateType="BirthDate" containerStyle="mt-4" labelTitle=" Birth Date" updateFormValue={updateFormValue} />
            <InputText type="text" defaultValue={accountObj.PhoneNumber} updateType="PhoneNumber" containerStyle="mt-4" labelTitle=" Phone Number" updateFormValue={updateFormValue} />
            <InputText type="text" defaultValue={accountObj.Email} updateType="Email" containerStyle="mt-4" labelTitle=" Email" updateFormValue={updateFormValue} />
            <InputText type="password" defaultValue={Password} updateType="Password" containerStyle="mt-4" labelTitle="Password" updateFormValue={updatePassword} />
            <InputText type="password" defaultValue={ConfirmPassword} updateType="ConfirmPassword" containerStyle="mt-4" labelTitle="Confirm Password" updateFormValue={updateConfirmPassword} />

            <ErrorText styleClass="mt-16">{errorMessage}</ErrorText>
            <div className="modal-action">
                <button className="btn btn-ghost" onClick={() => closeModal()}>Cancel</button>
                <button className="btn btn-primary px-6" onClick={() => saveNewAccount()}>Save</button>
            </div>
        </>
    )
}

export default AddAccountModelBody 