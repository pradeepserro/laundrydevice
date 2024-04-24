import DashboardStats from './components/DashboardStats'
// import AmountStats from './components/AmountStats' 
// import PageStats from './components/PageStats' 

import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
// import UsersIcon from '@heroicons/react/24/outline/UsersIcon' 
import CircleStackIcon from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon'
// import UserChannels from './components/UserChannels' 
import LineChart from './components/LineChart'
// import BarChart from './components/BarChart' 
import DashboardTopBar from './components/DashboardTopBar'
// import { useDispatch } from 'react-redux' 
import { showNotification } from '../common/headerSlice'
import DoughnutChart from './components/DoughnutChart'
import States from './components/States'  
import { useDispatch, useSelector } from "react-redux"; 
import { getMachineCounts, getTransactionsCounts, selectTotalTransactionsAmount, getTransactionsTotalAmount } from "../machines/machineSlice"; // Import the action for transactionsCounts
import { useEffect, useState } from "react";

// import { useState } from 'react' 




function Dashboard() { 

    const { machineCounts, transactionsCounts } = useSelector((state) => state.machines); // Add transactionsCounts
    const dispatch = useDispatch();
    const [valueMachines, setValueMachines] = useState(machineCounts);
    const [valueTransactions, setValueTransactions] = useState(transactionsCounts); // Create state for transactionsCounts
    //console.log("Machine Counts: ", machineCounts);
    console.log("Transactions Counts : ", transactionsCounts);
    const totalTransactionsAmount = useSelector(selectTotalTransactionsAmount);
    useEffect(() => {
        // Dispatch the getTransactionsTotalAmount thunk
        dispatch(getTransactionsTotalAmount());
    }, [dispatch]);
    useEffect(() => {
        dispatch(getMachineCounts());
        dispatch(getTransactionsCounts()); // Dispatch the action to get transactionsCounts
    }, [dispatch]);

    useEffect(() => {
        setValueMachines(machineCounts);
        setValueTransactions(transactionsCounts); // Update the state for transactionsCounts
    }, [machineCounts, transactionsCounts]); // Include transactionsCounts in the dependency array

    // const dispatch = useDispatch()  

    const statsData = [
        /*{ title: "Machines Counts", value:valueMachines , icon: <UserGroupIcon className='w-8 h-8' />, description: "↗︎ 2300 (22%)" },*/
        { title: "Machines Counts", value: valueMachines.count, icon: <UserGroupIcon className='w-8 h-8' />, description: "↗︎ 2300 (22%)" },
        { title: "Total ", value: "$ "+totalTransactionsAmount.toString(), icon: <CreditCardIcon className='w-8 h-8' />, description: "Current month" },
       /* { title: "Transaction", value: valueTransactions, icon: <CircleStackIcon className='w-8 h-8' />, description: "50 in hot machines" },*/
        { title: "Transaction", value: valueTransactions, icon: <CircleStackIcon className='w-8 h-8' />, description: "50 in hot machines" },
        // {title : "Active Users", value : "5.6k", icon : <UsersIcon className='w-8 h-8'/>, description : "↙ 300 (18%)"},
    ] 


    const updateDashboardPeriod = (newRange) => {
        // Dashboard range changed, write code to refresh your values
        dispatch(showNotification({ message: `Period updated to ${newRange.startDate} to ${newRange.endDate}`, status: 1 }))
    }

    return (
        <>
            {/** ---------------------- Select Period Content ------------------------- */}
            <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod} />

            {/** ---------------------- Different stats content 1 ------------------------- */}
            <div className="grid lg:grid-cols-3 mt-2 md:grid-cols-3 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        console.log("d.value : ", d.value);
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k} />
                        )
                    })
                }
            </div>
            <div className="grid lg:grid-cols-4 mt-4 grid-cols-1 gap-6">
                {/* <UserChannels /> */}
                <div className="lg:col-span-1 col-span-1 ">
                <States  className="lg:col-span-1 col-span-1 h-full"/> {/* Colonne 1 */}
                </div>
                <div className=" lg:col-span-2 col-span-2 ">
                    <LineChart className=" lg:col-span-2 col-span-2 h-full" /> {/* Colonne 2, agrandie */}
                </div>
                <div className="lg:col-span-1 col-span-1">
                <DoughnutChart className="lg:col-span-1 col-span-1 h-full" /> {/* Colonne 3 */}
                </div>

            </div>




            {/** ---------------------- Different charts ------------------------- */}
            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6"> */}
            {/* <LineChart /> */}
            {/* <BarChart />  */}
            {/* </div> */}

            {/** ---------------------- Different stats content 2 ------------------------- */}

            {/* <div className="grid lg:grid-cols-2 mt-10 grid-cols-1 gap-6">
                <AmountStats />    
                <PageStats />   
            </div> */}

            {/** ---------------------- User source channels table  ------------------------- */}

            {/* <div className="grid lg:grid-cols-2 mt-4 grid-cols-1 gap-6"> */}
            {/* <UserChannels />  */}
            {/* <DoughnutChart />     */}

            {/* </div> */}
        </>
    )
}

export default Dashboard