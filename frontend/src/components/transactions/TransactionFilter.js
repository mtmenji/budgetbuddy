import { useState, useEffect } from "react";

const TransactionFilter = ({setFilters, transactions}) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [categories, setCategories] = useState([]);
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [filteredCategories, setFilteredCategories] = useState([]);

    const categoryDropdown = transactions ? [...new Set(transactions.map((transaction) => {
        return transaction.category
    }))] : [];

    const handleCategoryChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(
            (option) => option.value
        );
        setCategories(selectedOptions);
    };

    const handleReset = () => {
        setStartDate("");
        setEndDate("");
        setCategories([]);
        setMinAmount("");
        setMaxAmount("");
    };

    useEffect(() => {
        setFilters({ startDate, endDate, categories, minAmount, maxAmount });
    }, [startDate, endDate, categories, minAmount, maxAmount, setFilters]);

    useEffect(() => {
        let filteredTransactions = transactions || [];

        if (startDate) {
            filteredTransactions = filteredTransactions.filter(
                (transaction) => new Date(transaction.date) >= new Date(startDate)
            )
        }
        if (endDate) {
            filteredTransactions = filteredTransactions.filter(
                (transaction) => new Date(transaction.date) <= new Date(endDate)
            )
        }

        const uniqueCategories = [
            ...new Set(filteredTransactions.map((transaction) => transaction.category)),
        ]
        setFilteredCategories(uniqueCategories)
    }, [startDate, endDate, transactions])

    return (
        <div className="bg-dark2 border-b-2 border-dark1">
            <form className="flex flex-wrap items-center justify-around gap-4 mb-1">
                {/* Start Date */}
                <div>
                    <p className="text-light1 mb-1 text-sm">Start Date</p>
                    <input
                        type="date"
                        onChange={(e) => setStartDate(e.target.value)}
                        value={startDate}
                        className="bg-light1 p-px border text-center rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1"
                    />
                </div>

                {/* End Date */}
                <div>
                <p className="text-light1 mb-1 text-sm">End Date</p>
                    <input
                        type="date"
                        onChange={(e) => setEndDate(e.target.value)}
                        value={endDate}
                        className="bg-light1 p-px border text-center rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1"
                    />
                </div>

                {/* Category Selection */}
                <div>
                    <p className="text-light1 mb-1 text-sm">Category</p>
                    <select
                        value={categories}
                        onChange={handleCategoryChange}
                        className="bg-light1 p-px border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1"
                    >
                        <option value=''>Select A Category</option>
                        {filteredCategories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Minimum Amount */}
                <div>
                    <p className="text-light1 mb-1 text-sm">Minimum Amount</p>
                    <input
                        type="number"
                        placeholder="$0"
                        onChange={(e) => setMinAmount(e.target.value)}
                        value={minAmount}
                        className="bg-light1 p-px border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1"
                    />
                </div>



                {/* Maximum Amount */}
                <div>
                    <p className="text-light1 mb-1 text-sm">Maximum Amount</p>
                    <input
                        type="number"
                        placeholder="$0"
                        onChange={(e) => setMaxAmount(e.target.value)}
                        value={maxAmount}
                        className="bg-light1 p-px border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-dark1"
                    />
                </div>

                {/* Reset Button */}
                <div>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-button text-light1 px-2 py-1 rounded-md shadow-sm hover:bg-buttonhover material-symbols-outlined mt-2"
                    >
                        history
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TransactionFilter;