import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import TitleCard from '../../../components/Cards/TitleCard';
import Subtitle from '../../../components/Typography/Subtitle';
import currentConfig from "../../../config";

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart() {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Assuming you have a function to fetch machine data from your backend
        async function fetchMachineData() {
            try {
                // Fetch machine data from your backend
                const response = await fetch(currentConfig.apiUrl+'/'+'machines');
                const machines = await response.json();

                // Filter machines in Canada
                const canadianMachines = machines.filter((machine) => machine.Country === 'Canada');

                // Group machines by state and count
                const stateCounts = {};
                canadianMachines.forEach((machine) => {
                    const state = machine.State;
                    if (state in stateCounts) {
                        stateCounts[state]++;
                    } else {
                        stateCounts[state] = 1;
                    }
                });

                // Sort states by machine count in descending order
                const sortedStates = Object.keys(stateCounts).sort(
                    (a, b) => stateCounts[b] - stateCounts[a]
                );

                // Select the top 3 states with the most machines
                const top3States = sortedStates.slice(0, 3);

                // Create labels and data arrays
                const labels = top3States;
                const data = top3States.map((state) => stateCounts[state]);

                // Create chart data
                const chartData = {
                    labels,
                    datasets: [
                        {
                            label: '# of Machines',
                            data,
                            backgroundColor: [
                                'rgba(255, 0, 0, 0.8)',
                                'rgba(54, 162, 235, 0.8)',
                                'rgba(255, 206, 86, 0.8)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                };

                setChartData(chartData);
            } catch (error) {
                console.error('Error fetching machine data:', error);
            }
        }

        fetchMachineData().then(r =>    console.log(r) );
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return (
        <TitleCard title={'Geo Distribution'}>
            {chartData && <Doughnut options={options} data={chartData} />}
        </TitleCard>
    );
}

export default DoughnutChart;
