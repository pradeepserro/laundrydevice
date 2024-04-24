import React, {useEffect, useState} from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import currentConfig from "../../../config";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

function LineChart() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Assuming you have a function to fetch transaction data from your backend
        async function fetchTransactionData() {
            try {
                // Fetch transaction data from your backend
                const response = await fetch(currentConfig.apiUrl + '/' + 'transactions');
                const transactions = await response.json();
                // Filter transactions for the last 30 days
                const today = new Date();
                const last30Days = new Date(today);
                last30Days.setDate(today.getDate() - 30);

                const filteredTransactions = transactions.filter((transaction) => {

                    const dateString = transaction.Date;
                    const dateParts = dateString.split("-"); // Split the string into parts
                    const year = parseInt(dateParts[0], 10);
                    const month = parseInt(dateParts[1], 10) - 1; // Subtract 1 from the month (months are zero-based)
                    const day = parseInt(dateParts[2], 10);

                    const transactionDate = new Date(year, month, day);
                    return transactionDate >= last30Days && transactionDate <= today;
                });

                console.log("filteredTransactions are ", filteredTransactions);

                // Group transactions by date and calculate total amounts
                const groupedTransactions = {};
                filteredTransactions.forEach((transaction) => {
                    const transactionDate = new Date(transaction.Date);
                    const formattedDate = formatDate(transactionDate);
                    console.log("formattedDate is :", formattedDate);
                    if (formattedDate in groupedTransactions) {
                        groupedTransactions[formattedDate] += transaction.Amount;
                    } else {
                        groupedTransactions[formattedDate] = transaction.Amount;
                    }
                });

                // Create labels and data arrays
                const labels = Object.keys(groupedTransactions);

                labels.sort((a, b) => {
                    const dateA = new Date(a);
                    const dateB = new Date(b);
                    return dateA - dateB;
                });

                const data = labels.map((date) => groupedTransactions[date]);

                const chartData = {
                    labels,
                    datasets: [
                        {
                            fill: true,
                            label: 'Total Amount',
                            data,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                };


                setChartData(chartData);
            } catch (error) {
                console.error('Error fetching transaction data:', error);
            }
        }

        fetchTransactionData().then(r => console.log("r is ", r));
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    // Function to format date as needed
    function formatDate(date) {
        //const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return date.toLocaleDateString("fr-CA");
    }

    return (
        <TitleCard title={'History'}>
            {chartData && <Line data={chartData} options={options}/>}
        </TitleCard>
    );
}

export default LineChart;