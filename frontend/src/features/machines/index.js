import moment from "moment"
import { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import TitleCard from "../../components/Cards/TitleCard"
import { openModal } from "../common/modalSlice"
import { deleteMachine, getMachinesContent, getMachineCounts, getTransactionsCounts, selectTotalTransactionsAmount, getTransactionsTotalAmount } from "./machineSlice"
import { CONFIRMATION_MODAL_CLOSE_TYPES, MODAL_BODY_TYPES } from '../../utils/globalConstantUtil'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { showNotification } from '../common/headerSlice'
import ArrowPathIcon from '@heroicons/react/24/outline/ArrowPathIcon';
import DashboardStats from '../dashboard/components/DashboardStats'
import UserGroupIcon from '@heroicons/react/24/outline/UserGroupIcon'
import CircleStackIcon from '@heroicons/react/24/outline/CircleStackIcon'
import CreditCardIcon from '@heroicons/react/24/outline/CreditCardIcon'
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import SearchBar from "../../components/Input/SearchBar"
import MachineStatus from "./MachineStatus";






const TopSideButtons = ({ removeFilter, applyFilter, applySearch, refreshMachines }) => {

    const dispatch = useDispatch()

    const openAddNewMachineModal = () => {
        dispatch(openModal({ title: "Add New Machine", bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW }))
    }

    const [filterParam, setFilterParam] = useState("")
    const [searchText, setSearchText] = useState("")
    const modelFilters = ["Type A", "Type B"]

    const showFiltersAndApply = (params) => {
        applyFilter(params)
        setFilterParam(params)
    }

    const removeAppliedFilter = () => {
        removeFilter()
        setFilterParam("")
        setSearchText("")
    }

    useEffect(() => {
        if (searchText === "") {
            removeAppliedFilter()
        } else {
            applySearch(searchText)
        }
    }, [searchText])


    return (
        <div className="flex items-center justify-between space-x-3">
            <div className="flex items-center space-x-2">
                <SearchBar searchText={searchText} styleClass="mr-1" setSearchText={setSearchText} />
                {filterParam !== "" && (
                    <button onClick={() => removeAppliedFilter()} className="btn btn-xs mr-2 btn-active btn-ghost normal-case">
                        {filterParam}
                        <XMarkIcon className="w-4 ml-2" />
                    </button>
                )}
            </div>
            <div className="dropdown dropdown-bottom dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-outline">
                    <FunnelIcon className="w-3 mr-2" />Filter
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 text-sm shadow bg-base-100 rounded-box w-52">
                    {modelFilters.map((l, k) => (
                        <li key={k}>
                            <a onClick={() => showFiltersAndApply(l)}>{l}</a>
                        </li>
                    ))}
                    <div className="divider mt-0 mb-0"></div>
                    <li><a onClick={() => removeAppliedFilter()}>Remove Filter</a></li>
                </ul>
            </div>
            <button className="btn btn-ghost btn-sm normal-case" onClick={() => refreshMachines()}>
                <ArrowPathIcon className="w-4 mr-2"/>Refresh Data
            </button>
            <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openAddNewMachineModal()}>
                Add New Machine
            </button>
        </div>
    )
}

function Machines() {
    const { machines, machineCounts, transactionsCounts } = useSelector((state) => state.machines);
    const dispatch = useDispatch()
    const [machine, setmachine] = useState(machines);
    const [selectedMachineDetails, setSelectedMachineDetails] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [valueMachines, setValueMachines] = useState(machineCounts);
    const [valueTransactions, setValueTransactions] = useState(transactionsCounts); // Create state for transactionsCounts
    const [isLoading, setIsLoading] = useState(true);
    console.log("Liste de machines actuelle : ", machines);


    const totalTransactionsAmount = useSelector(selectTotalTransactionsAmount);
    console.log("Total Transactions Amount : ", totalTransactionsAmount);

    const [sortBy, setSortBy] = useState('MachineName'); // Default sorting criteria
    const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order ('asc' or 'desc')
    const handleSort = (criteria) => {
        if (criteria === sortBy) {
            // Toggle sorting order if the same column is clicked
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            // Set a new sorting criteria if a different column is clicked
            setSortBy(criteria);
            setSortOrder('asc'); // Default to ascending order
        }
    };
    const sortedMachines = [...machines].sort((a, b) => {
        const valueA = a[sortBy].toLowerCase();
        const valueB = b[sortBy].toLowerCase();

        if (sortOrder === 'asc') {
            return valueA.localeCompare(valueB);
        } else {
            return valueB.localeCompare(valueA);
        }
    });

    useEffect(() => {
        // Dispatch the getTransactionsTotalAmount thunk
        dispatch(getTransactionsTotalAmount())
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching transactions total amount:", error);
                setIsLoading(false);
            });
    }, [dispatch]);



    const statsData = [
/*
        { title: "Machines Counts", value: valueMachines, icon: <UserGroupIcon className='w-8 h-8' />, description: "↗︎ 2300 (22%)" },
*/
        { title: "Machines Counts", value: valueMachines.count, icon: <UserGroupIcon className='w-8 h-8' />, description: "↗︎ 2300 (22%)" },
        { title: "Total ", value: "$ "+totalTransactionsAmount.toString(), icon: <CreditCardIcon className='w-8 h-8' />, description: "Current month" },
/*
        { title: "Transcation", value: valueTransactions, icon: <CircleStackIcon className='w-8 h-8' />, description: "50 in hot machines" },
*/
        { title: "Transactions", value: valueTransactions, icon: <CircleStackIcon className='w-8 h-8' />, description: "50 in hot machines" },
    ]

    useEffect(() => {
        dispatch(getMachinesContent())
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
        setValueTransactions(transactionsCounts); // Update the state for transactionsCounts
    }, [machineCounts, transactionsCounts]); // Include transactionsCounts in the dependency array


    const deleteCurrentMachine = (index, MachineID) => {
        console.log("Current MachineID : ", MachineID);
        dispatch(openModal({
            title: "Confirmation", bodyType: MODAL_BODY_TYPES.CONFIRMATION,
            extraObject: { message: `Are you sure you want to delete this Machine?`, type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE, MachineID },
            MachineID: MachineID,
            index: index
        }, deleteMachine(MachineID)))
    }



    const removeFilter = () => {
        setmachine(machines)
    }

    const applyFilter = (params) => {
        let filteredTransactions = machines.filter((t) => { return t.MachineName === params })
        setmachine(filteredTransactions)
    }

    // Search according to name
    const applySearch = (value) => {
        let filteredTransactions = machines.filter((t) => { return t.MachineName.toLowerCase().includes(value.toLowerCase()) || t.MachineName.toLowerCase().includes(value.toLowerCase()) })
        setmachine(filteredTransactions)
    }

    const openshowMachineDetails = (machineDetails) => {
        setIsDetailModalOpen(true);
        setSelectedMachineDetails(machineDetails);
        dispatch(
            openModal({
                title: "Machine Details",
                bodyType: MODAL_BODY_TYPES.LEAD_DETAILS,
                size: 'lg',
                extraObject: machineDetails,
            })
        );
        console.log("Détails de la machine :", machineDetails);

    };

    const refreshMachines = () => {
        setIsLoading(true); // Set isLoading to true to show a loading indicator
        dispatch(getMachinesContent())
            .then(() => {
                setIsLoading(false); // Set isLoading to false when data is fetched
                dispatch(showNotification({ message: "Machine list refreshed!", status: 1 }));
            })
            .catch((error) => {
                console.error("Error fetching machines:", error);
                setIsLoading(false); // Set isLoading to false even on error
                dispatch(showNotification({ message: "Failed to refresh machine list. Please try again.", status: 2 }));
            });
    };



    if (isLoading) {
        return <div>Loading...</div>;
    }





    return (
        <>

            {/** ---------------------- Select Period Content ------------------------- */}
            {/* <DashboardTopBar updateDashboardPeriod={updateDashboardPeriod}/>  */}

           {/* <button className="btn btn-sm btn-ghost" onClick={refreshMachines}>
                <ArrowPathIcon className="w-4 mr-2" />Refresh
            </button>*/}

            {/** ---------------------- Different stats content 1 ------------------------- */}

            <div className="grid lg:grid-cols-3 mt-1 md:grid-cols-3 grid-cols-1 gap-6">
                {
                    statsData.map((d, k) => {
                        return (
                            <DashboardStats key={k} {...d} colorIndex={k} />
                        )
                    })
                }
            </div>


            <TitleCard title="Current Machines" topMargin="mt-7" TopSideButtons={<TopSideButtons applyFilter={applyFilter} applySearch={applySearch} removeFilter={removeFilter} refreshMachines={refreshMachines}/>}>

                {/* Machines List in table format loaded from slice after api call */}
                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>
                                    Status
                                </th>
                                <th onClick={() => handleSort('MachineName')} style={{ cursor: 'pointer' }}>
                                    Name {sortBy === 'MachineName' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th>Mac Address</th>
                                <th onClick={() => handleSort('Country')} style={{ cursor: 'pointer' }}>
                                    Country {sortBy === 'Country' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('State')} style={{ cursor: 'pointer' }}>
                                    State {sortBy === 'State' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('Model')} style={{ cursor: 'pointer' }}>
                                    Model {sortBy === 'Model' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>

                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                sortedMachines.map((l, k) => {
                                    return (
                                        <tr key={k}>
                                            <td>
                                                <MachineStatus MacAddressMqtt5={l.MacAddress} />
                                            </td>

                                            <td>{l.MachineName}</td>
                                            <td>{l.MacAddress}</td>
                                            <td>{l.Country}</td>
                                            <td>{l.State}</td>
                                            <td>{l.Model}</td>
                                            <td><button className="btn btn-square btn-ghost" onClick={() => { deleteCurrentMachine(k, l.MachineID); }}><TrashIcon className="w-5" /></button></td>

                                            <td>   <button className="btn px-6 btn-sm normal-case btn-primary" onClick={() => openshowMachineDetails(l)}>
                                                Details
                                            </button>
                                            </td>

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


export default Machines