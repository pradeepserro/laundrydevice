import { useState } from 'react'; // Removed unused import
import { Link } from 'react-router-dom';
import LandingIntro from './LandingIntro';
import ErrorText from '../../components/Typography/ErrorText';
import InputText from '../../components/Input/InputText';

import currentConfig from '../../config';
import axios from 'axios';
const CryptoJS = require("crypto-js");
const apiUrl = currentConfig.apiUrl;

// Define the API endpoint for fetching user data
const usersEndpoint = `${apiUrl}/users`;

function Login() {
    const INITIAL_LOGIN_OBJ = {
        password: '',
        Email: '', // Changed 'emailId' to 'Email' to match your user object
    };

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginObj, setLoginObj] = useState(INITIAL_LOGIN_OBJ);
    const cfg = {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };

    const compareHashPassword = (password, hashedPassword) => {
        // const decData = CryptoJS.enc.Base64.parse(hashedPassword);
        // console.log("decData: ", decData);
        const key = "inovtech";
        console.log("key: ", key);
        const bytes = CryptoJS.AES.decrypt(hashedPassword, key).toString(CryptoJS.enc.Utf8);
        console.log("bytes: ", bytes);
        const bytesToStr = bytes.toString(CryptoJS.enc.Utf8);
        console.log("bytesToStr: ", bytesToStr);
        let dbPawd = bytesToStr;
        console.log("dbPawd is", dbPawd);
        console.log("and enetered pwd is: ", password);


        if (password === dbPawd) {
            console.log("Password matched")
            return true;
        }
        console.log("Password not matched")
        return false;
    }


    const compareStrings = (st1, str2) => {
        return st1 === str2;
    }
    // Function to fetch user data from DynamoDB
    const fetchUserDataFromDynamoDB = async (email) => {
        setLoading(true);

        try {
            const response = await axios.get(`${apiUrl}/users/${email}`);
            setLoading(false);
            return response.data; // Return the user data
        } catch (error) {
            console.error('Error fetching user data:', error);
            setLoading(false);
            return null; // Return null if there's an error
        }
    };

    const submitForm = async (e) => {
        e.preventDefault();
        setErrorMessage('');

        if (loginObj.Email.trim() === '') return setErrorMessage('Email Id is required!');
        if (loginObj.password.trim() === '') return setErrorMessage('Password is required!');

        // Fetch the user data from DynamoDB based on the provided email
        const userData = await fetchUserDataFromDynamoDB(loginObj.Email);
        console.log("user data is", userData);


        if (!userData) {
            return setErrorMessage('Invalid email or password');
        }


        const storedPasswordHash = userData.PasswordHash; // Assuming PasswordHash is the attribute name

        // Compare the provided password with the stored password hash

        const isPasswordCorrect = compareHashPassword(loginObj.password, storedPasswordHash);
        //         const isPasswordCorrect = compareStrings(loginObj.password, storedPasswordHash);

        if (isPasswordCorrect) {
            setLoading(true);
            localStorage.setItem('token', 'DumyTokenHere');
            setLoading(false);
            window.location.href = '/app/dashboard';
        } else {
            setErrorMessage('Invalid Email or Password');
        }
    };

    const updateFormValue = ({ updateType, value }) => {
        setErrorMessage('');
        setLoginObj({ ...loginObj, [updateType]: value });
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center">
            <div className="card mx-auto w-full max-w-5xl  shadow-xl">
                <div className="grid  md:grid-cols-2 grid-cols-1  bg-base-100 rounded-xl">
                    <div className="">
                        <LandingIntro />
                    </div>
                    <div className="py-24 px-10">
                        <h2 className="text-2xl font-semibold mb-2 text-center">Login</h2>
                        <form onSubmit={(e) => submitForm(e)}>
                            <div className="mb-4">
                                <InputText
                                    type="Email"
                                    defaultValue={loginObj.Email}
                                    updateType="Email"
                                    containerStyle="mt-4"
                                    labelTitle="Email Id"
                                    updateFormValue={updateFormValue}
                                />

                                <InputText
                                    defaultValue={loginObj.password}
                                    type="password"
                                    updateType="password"
                                    containerStyle="mt-4"
                                    labelTitle="Password"
                                    updateFormValue={updateFormValue}
                                />
                            </div>

                            <div className="text-right text-primary">
                                <Link to="/forgot-password">
                                    <span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                                        Forgot Password?
                                    </span>
                                </Link>
                            </div>

                            <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
                            <button
                                type="submit"
                                className={'btn mt-2 w-full btn-primary' + (loading ? ' loading' : '')}
                            >
                                Login
                            </button>

                            <div className="text-center mt-4">
                                Don't have an account yet?{' '}
                                <Link to="/register">
                                    <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                                        Register
                                    </span>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
