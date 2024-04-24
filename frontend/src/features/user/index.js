// import moment from "moment" 
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { showNotification } from "../common/headerSlice"  
import TitleCard from "../../components/Cards/TitleCard"
// import { RECENT_TRANSACTIONS } from "../../utils/dummyData" 
// import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon' 
// import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon' 
// import SearchBar from "../../components/Input/SearchBar" 
import DashboardStats from '../dashboard/components/DashboardStats'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import CircleStackIcon from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon'
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import { openModal } from "../common/modalSlice" 
import {  getAccountsContent } from "./AccountSlice"
// import {  getMachineCounts, getTransactionsCounts } from "../machines/machineSlice"

import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import {getMachineCounts, getTransactionsCounts} from "../machines/machineSlice";
// import Machines from "../machines"






// const statsData = [
//     { title: "Machines Counts", value: "34k", icon: <UserGroupIcon className='w-8 h-8' />, description: "↗︎ 2300 (22%)" },
//     { title: "Total ", value: "$34,545", icon: <CreditCardIcon className='w-8 h-8' />, description: "Current month" },
//     { title: "Transcation", value: "450", icon: <CircleStackIcon className='w-8 h-8' />, description: "50 in hot machines" },
//     // {title : "Active Users", value : "5.6k", icon : <UsersIcon className='w-8 h-8'/>, description : "↙ 300 (18%)"}, 
// ] 

const TopSideButtons = () => {

    const dispatch = useDispatch()

    const openAddNewAccountModal = () => {
        dispatch(openModal({ title: "Add New Accounts", bodyType: MODAL_BODY_TYPES.ACCOUNT_ADD_NEW }))
    }

 

    return (
        <div className="inline-block float-right">

            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewAccountModal()}>
                Add New Account
            </button>
         
        </div>
    )
}


function Accounts() {
    
    const { machineCounts, accountsCounts ,  } = useSelector((state) => state.machines); // Add accountsCounts
    const dispatch = useDispatch();
    const [valueMachines, setValueMachines] = useState(machineCounts);
    const [valueAccounts, setValueAccounts] = useState(accountsCounts); // Create state for accountsCounts
    console.log("Machine Counts: ", machineCounts);
    console.log("Accounts Counts: ", accountsCounts);

    const { accounts } = useSelector((state) => state.accounts);
    const [isLoading, setIsLoading] = useState(true);
    const [index, setmachine] = useState(accounts);  
    console.log("users Counts: ", accounts); 


    const statsData = [
        /*
                { title: "Machines Counts", value: valueMachines, icon: <UserGroupIcon className='w-8 h-8' />, description: "↗︎ 2300 (22%)" },
        */
                { title: "Machines Counts", value: valueMachines.count, icon: <UserGroupIcon className='w-8 h-8' />, description: "↗︎ 2300 (22%)" },
                { title: "Total ", value: "$34,545", icon: <CreditCardIcon className='w-8 h-8' />, description: "Current month" },
        /*
                { title: "Transcation", value: valueAccounts, icon: <CircleStackIcon className='w-8 h-8' />, description: "50 in hot machines" },
        */
                { title: "Transcation", value: valueAccounts, icon: <CircleStackIcon className='w-8 h-8' />, description: "50 in hot machines" },
            ]




    // const { machines } = useSelector(state => state.machine)
    // const dispatch = useDispatch()  

    useEffect(() => {
        dispatch(getAccountsContent())
            .then(() => {
                setIsLoading(false); // Set isLoading to false when data is fetched
            })
            .catch((error) => {
                console.error("Error fetching machines:", error);
                setIsLoading(false); // Set isLoading to false even on error
            }); 
            dispatch(getMachineCounts());
            dispatch(getTransactionsCounts());
    }, [dispatch]) 

    useEffect(() => {
        setValueMachines(machineCounts);
        setValueAccounts(accountsCounts); // Update the state for accountsCounts
    }, [machineCounts, accountsCounts]); // Include accountsCounts in the dependency array

 

  
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // const getDummyStatus = (index) => {
    //     if (index % 5 === 0) return <div className="badge">Not Interested</div>
    //     else if (index % 5 === 1) return <div className="badge badge-primary">In Progress</div>
    //     else if (index % 5 === 2) return <div className="badge badge-secondary">Sold</div>
    //     else if (index % 5 === 3) return <div className="badge badge-accent">Need Followup</div>
    //     else return <div className="badge badge-ghost">Open</div>
    // }

    // const deleteCurrentMachine = (index) => {
    //     dispatch(openModal({
    //         title: "Confirmation", bodyType: MODAL_BODY_TYPES.CONFIRMATION,
    //         extraObject: { message: `Are you sure you want to delete this machine?`, type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE, index }
    //     }))
    // }

    // const removeFilter = () => {
    //     setTrans(RECENT_TRANSACTIONS)
    // }

    // const applyFilter = (params) => {
    //     let filteredAccounts = RECENT_TRANSACTIONS.filter((t) => { return t.location == params })
    //     setTrans(filteredAccounts)
    // }

    // // Search according to name
    // const applySearch = (value) => {
    //     let filteredAccounts = RECENT_TRANSACTIONS.filter((t) => { return t.email.toLowerCase().includes(value.toLowerCase()) || t.email.toLowerCase().includes(value.toLowerCase()) })
    //     setTrans(filteredAccounts)
    // } 



    return (
        <>

            <div className="grid lg:grid-cols-3 mt-1 md:grid-cols-3 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k} />
                        )
                    })
                }
            </div>

            <TitleCard title="Users Accounts" topMargin="mt-7" TopSideButtons={< TopSideButtons />} >

                {/* Team Member list in table format loaded constant */}
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>BirthDate</th>
                                <th>Phone Number</th>
                                <th>Email</th>
                                {/* <th>Account Date</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                index.map((l, k) => {
                                    return (
                                        <tr key={k}>
                                           <td>{l.Username}</td>
                                            <td>{l.BirthDate}</td>
                                            <td>{l.PhoneNumber}</td>
                                            <td>{l.Email}</td> 
                                            {/* <td><button className="btn btn-square btn-ghost" onClick={() =>{deleteCurrentMachine(k, l.MachineID); }}><TrashIcon className="w-5" /></button></td> */}
                                            {/* <td>{l.Model}</td> */}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </TitleCard>
        </>
    )
}


export default Accounts