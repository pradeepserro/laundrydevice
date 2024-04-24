import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import DashboardStats from "../../dashboard/components/DashboardStats";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import Mqtt5 from './PubSub5';
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";

import currentConfig from "../../../config";
const apiUrl= currentConfig.apiUrl;

function DetailsMachineModalBody({closeModal}) {
    const {extraObject: machineDetails} = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState('Date'); // Default sorting criteria
    const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order ('asc' or 'desc')

    const handleSort = (criteria) => {
        if (criteria === sortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(criteria);
            setSortOrder('asc'); // Default to ascending order
        }
    };

    const sortedTransactions = [...transactions].sort((a, b) => {
        if (sortBy === 'Date') {
            const dateA = new Date(a.Date);
            const dateB = new Date(b.Date);

            if (sortOrder === 'asc') {
                return dateA - dateB;
            } else {
                return dateB - dateA;
            }
        } else if (sortBy === 'time') {
            const timeA = a.time;
            const timeB = b.time;

            if (sortOrder === 'asc') {
                return timeA.localeCompare(timeB);
            } else {
                return timeB.localeCompare(timeA);
            }
        }
    });



    const getTransactionsByMacAddress = async (MacAddress) => {
        setIsLoading(true);

        try {
            const response = await axios.get(
                `${apiUrl}/transactions/${MacAddress}`
            );
            setTransactions(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setIsLoading(false);
        }
    };

    let transactionsAmountByMachine= 0;
    transactions.map((transaction) => {
        transactionsAmountByMachine += parseFloat(transaction.Amount);
    });

    const statsData = [
        {title: "Total ", value: "$ "+transactionsAmountByMachine.toString(), icon: <CreditCardIcon className='w-8 h-8'/>, description: "Current month"},
        {
            title: "Transactions",
            value: transactions.length.toString(),
            icon: <CircleStackIcon className='w-8 h-8'/>,
            description: "50 in hot machines"
        },
    ]

    const handleRefresh = () => {
        getTransactionsByMacAddress(machineDetails.MacAddress);
    };

    useEffect(() => {
        getTransactionsByMacAddress(machineDetails.MacAddress);
    }, [machineDetails.MacAddress]);
    return (
        <>
            <div className="grid lg:grid-cols-7 mt-4 grid-cols-1 gap-6">
                <div className="lg:col-span-2 col-span-3">
                    <div className="grid lg:grid-cols-2 mt-1 md:grid-cols-2 grid-cols-1 gap-4">
                        {
                            statsData.map((d, k) => {
                                return (
                                    <DashboardStats key={k} {...d} colorIndex={k}/>
                                )
                            })
                        }
                    </div>
                    <div className=" p-4 rounded-lg shadow">
                        <div className="mb-2">
                            <strong>Machine Name:</strong> {machineDetails.MachineName}
                        </div>
                        <div className="mb-2">
                            <strong>Mac Address:</strong> {machineDetails.MacAddress}
                        </div>
                        <div className="mb-2">
                            <strong>Country:</strong> {machineDetails.Country}
                        </div>
                        <div className="mb-2">
                            <strong>State:</strong> {machineDetails.State}
                        </div>
                        <div className="mb-2">
                            <strong>Street Address:</strong> {machineDetails.StreetAddress}
                        </div>
                        <div className="mb-2">
                            <strong>Model:</strong> {machineDetails.Model}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-5 col-span-4 overflow-x-auto w-full bg-base-100">
                    {isLoading ? (
                        <div className="m-auto">Loading transactions...</div>
                    ) : transactions.length === 0 ? (
                        <div className="m-auto">
                            <h1 className="card-title">No transactions available.</h1>
                        </div>
                    ) : (
                        <table className="table w-full">
                            <thead className="items-center flex w-full">
                            <tr className="flex w-full">
                                <th className="w-1/6 p-3" onClick={() => handleSort('Date')} style={{cursor: 'pointer'}}>
                                    Date {sortBy === 'Date' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="w-1/6 p-3" onClick={() => handleSort('time')} style={{cursor: 'pointer'}}>
                                    Time {sortBy === 'time' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                {/*<th className="w-2/5 p-3">Mac Address</th>*/}
                                <th className="w-1/6 p-3">Origin</th>
                                <th className="w-1/6 p-3">CoinAcceptor</th>
                                <th className="w-1/6 p-3">High Voltage</th>
                                <th className="w-1/6 p-3">Low Voltage</th>
                            </tr>
                            </thead>
                            <tbody
                                className="flex flex-col items-center justify-between overflow-y-scroll w-full max-h-80">
                            {sortedTransactions.map((transaction, index) => (
                                <tr key={index} className="flex w-full">
                                    <td className="w-1/6 p-3">{transaction.Date}</td>
                                    <td className="w-1/6 p-3">{transaction.time}</td>
                                    {/*<td className="w-2/5 p-3">{transaction.MacAddress}</td>*/}
                                    <td className="w-1/6 p-3">{transaction.Origin}</td>
                                    <td className="w-1/6 p-3">{transaction.CoinAcceptor.toString()}</td>
                                    <td className="w-1/6 p-3">{transaction.HighVoltage.toString()}</td>
                                    <td className="w-1/6 p-3">{transaction.LowVoltage.toString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <div className="mt-4 grid-cols-2 flex justify-between">
            <div className="col-span-1" style={{width:'60%'}}>

                    <Mqtt5 MacAddressMqtt5={machineDetails.MacAddress} customFunction={handleRefresh}/>

                </div>
                <div className="col-span-1" >
                    <button className="btn btn-ghost btn-lg normal-case mr-2" onClick={handleRefresh}
                            disabled={isLoading}>
                        <ArrowPathIcon className="w-4 mr-2"/>Refresh Transactions
                    </button>

                    <button
                        className="btn btn-lg btn-outline normal-case mr-2"
                        onClick={() => closeModal()}
                    >

                        <XMarkIcon className="w-4 mr-2"/>Close
                    </button>
                </div>
            </div>
        </>
    );

}

export default DetailsMachineModalBody;
