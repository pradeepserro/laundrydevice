import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'
import {closeModal} from "../common/modalSlice";

import currentConfig from "../../config";
const apiUrl = currentConfig.apiUrl;

const ACCOUNTS_API_URL =  `${apiUrl}/users`;


export const getAccountsContent = createAsyncThunk('accounts/content', async () => {
        const response = await axios.get(ACCOUNTS_API_URL);
        return response.data;
});





export const AccountSlice = createSlice({
    name: 'accounts',
    initialState: {
        isLoading: false,
        accounts : []
    },
    reducers: {
        addNewAccount: (state, action) => {
            let {newAccountObj} = action.payload
            state.accounts = [...state.accounts, newAccountObj] 
            console.log("Mew accounts list : ", state.accounts);
        },
        uiupdt: (state, action) => {
            let {index} = action.payload
            state.accounts.splice(index, 1);
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAccountsContent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getAccountsContent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.accounts = action.payload;
            })
            .addCase(getAccountsContent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },

})

export const { addNewAccount,uiupdt } = AccountSlice.actions

export default AccountSlice.reducer