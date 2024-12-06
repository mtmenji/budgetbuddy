import { useEffect, useState } from 'react';
import { useTransactionsContext } from '../../hooks/useTransactionsContext';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Tooltip, Legend, BarElement, Title, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Tooltip, Legend, BarElement, Title, CategoryScale, LinearScale);

const Ratio = ({ selectedMonth, selectedYear }) => {
    const { transactions } = useTransactionsContext();
    const { user } = useAuthContext();
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    const selectedMonthNumber = (selectedMonth) => {
        const monthMap = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
        };
        return monthMap[selectedMonth] || 0;
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('/transactions', {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();
                const filtered = data.filter(transaction => {
                    const transactionDate = new Date(transaction.date);
                    return (
                        transactionDate.getMonth() + 1 === selectedMonthNumber(selectedMonth) &&
                        transactionDate.getFullYear() === parseInt(selectedYear)
                    );
                });
                setFilteredTransactions(filtered);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };
        fetchTransactions();
    }, [selectedMonth, selectedYear, user.token]);

    const calculateTotals = () => {
        const totalIncome = filteredTransactions
            .filter(transaction => transaction.type === 'income')
            .reduce((sum, transaction) => sum + transaction.value, 0);

        const totalExpenses = filteredTransactions
            .filter(transaction => transaction.type === 'expense' && !['income', 'saving'].includes(transaction.category))
            .reduce((sum, transaction) => sum + transaction.value, 0);

        return { totalIncome, totalExpenses };
    };

    let { totalIncome, totalExpenses } = calculateTotals();
    totalIncome = 1000; // Example value
    const expensePercentage = totalIncome > 0 ? (400 / totalIncome) * 100 : 0; // Example calculation
    console.log(`Income: ${totalIncome}, Expense Percentage: ${expensePercentage}`);

    const data = {
        labels: [''],
        datasets: [
            {
                label: 'Percentage of Income',
                data: [expensePercentage],
                backgroundColor: ['#f44336'],
                borderColor: ['#d32f2f'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Expenses: ${context.raw.toFixed(2)}% of Income`;
                    },
                },
            },
            datalabels: {
                display: false
            },
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    beginAtZero: true,
                    callback: function (value) {
                        return `${value}%`;
                    },
                },
                grid: {
                    drawTicks: false,
                },
            },
        },
    };

    return (
        <div className='m-2 h-[calc(100vh-96px)]'>
            <h2 className="text-xl font-bold text-dark1 mb-4 text-center">Spending Ratio</h2>
            <p className='text-center text-sm mb-2'>A visual breakdown of your spending ratio.</p>
            <div className="flex flex-col md:flex-row md:divide-x md:space-x-4 h-[calc(100vh-142px)]">
                <div className="md:w-1/2 space-y-4 p-2 text-center flex flex-col justify-evenly">
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold border-b-2 border-gray-500 pb-1">Total Income</h2>
                        <p className="text-lg">${totalIncome}</p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold border-b-2 border-gray-500 pb-1">Total Expenses</h2>
                        <p className="text-lg">${totalExpenses}</p>
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold border-b-2 border-gray-500 pb-1">Percentage Spent</h2>
                        <p className="text-lg">{expensePercentage}%</p>
                    </div>
                </div>

                <div className="md:w-1/2 space-y-4 p-2">
                    {filteredTransactions.length > 0 ? (
                        <div className='h-full'>
                            <Bar data={data} options={options} />
                        </div>
                    ) : (
                        <p>Loading or no transactions available for the selected period.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ratio;