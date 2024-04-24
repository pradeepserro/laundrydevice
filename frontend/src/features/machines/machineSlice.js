import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {createSelector} from '@reduxjs/toolkit';
import axios from 'axios'
// import { closeModal } from "../common/modalSlice";
import currentConfig from "../../config";
const apiUrl= currentConfig.apiUrl;

const MACHINES_API_URL = `${apiUrl}/machines`;
const TRANSACTIONS_API_URL = `${apiUrl}/transactions`;
const COUNT_MACHINE_API_URL = `${apiUrl}/machinescount`;
const COUNT_TRANSACTIONS_API_URL = `${apiUrl}/transactionscount`;


export const getMachinesContent = createAsyncThunk('machines/content', async () => {
    const response = await axios.get(MACHINES_API_URL);
    return response.data;
});

export const getTransactionsTotalAmount = createAsyncThunk('transactions/totalAmount', async () => {
    const response = await axios.get(TRANSACTIONS_API_URL);
    console.log("response.data : ", response.data);

    let TotalAmount = 0; // Initialize TotalAmount to 0
    for (let i = 0; i < response.data.length; i++) {
        TotalAmount += parseFloat(response.data[i].Amount); // Accumulate the Amount
    }
    return TotalAmount;
});


export const getTransactionsContent = createAsyncThunk('machines/content', async () => {
    const response = await axios.get(TRANSACTIONS_API_URL);
    return response.data;
});

export const getMachineCounts = createAsyncThunk('machines/counts', async () => {
    const response = await axios.get(COUNT_MACHINE_API_URL);
    return response.data;
});

export const getTransactionsCounts = createAsyncThunk('tansactions/counts', async () => {
    const response = await axios.get(COUNT_TRANSACTIONS_API_URL);
    return response.data;
});


export const selectTotalTransactionsAmount = createSelector(
    (state) => state.machines.transactionsTotalAmount, // Assuming you store the total amount in the state
    (totalAmount) => totalAmount
);


export const machinesSlice = createSlice({
    name: 'machines',
    initialState: {
        isLoading: false,
        machines: [],
        machineCounts: 0,
        transactionsCounts: null,
        transactionsTotalAmount: 0,
    },
    reducers: {
        addNewMachine: (state, action) => {
            let {newMachineObj} = action.payload
            state.machines = [...state.machines, newMachineObj]
            console.log("Mew machines list : ", state.machines);
        },
        uiupdt: (state, action) => {
            let {index} = action.payload
            state.machines.splice(index, 1);
        },

        deleteMachine: (state, action
        ) => {

            console.log("MachineID : ", action.payload);
            let deleteUrl = MACHINES_API_URL + '/' + action.payload.toString()
            console.log("Delete url : ", deleteUrl);
            axios.delete(deleteUrl).then(r => console.log(r.data));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMachinesContent.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMachinesContent.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.machines = action.payload;
            })
            .addCase(getMachinesContent.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getMachineCounts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getMachineCounts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.machineCounts = action.payload;
            })
            .addCase(getMachineCounts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getTransactionsCounts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTransactionsCounts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactionsCounts = action.payload;
            })
            .addCase(getTransactionsCounts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(getTransactionsTotalAmount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTransactionsTotalAmount.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactionsTotalAmount = action.payload;
            })
            .addCase(getTransactionsTotalAmount.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },

})

export const {addNewMachine, deleteMachine, uiupdt} = machinesSlice.actions

export default machinesSlice.reducer