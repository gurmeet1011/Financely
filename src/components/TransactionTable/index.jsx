import { Radio, Select, Table } from 'antd'
import { parse, unparse } from 'papaparse'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import SearchIcon from "../../assets/search.svg"

// TransactionTable component handles displaying, filtering, sorting, exporting, and importing of transaction data
function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
    // useState hooks for managing search, type filter, and sorting key states
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [sortKey, setSortKey] = useState('')

    // Defining the columns for the Ant Design Table component
    const columns = [
        { title: "Name", dataIndex: "name", key: "name" },
        { title: "Amount", dataIndex: "amount", key: "amount" },
        { title: "Tag", dataIndex: "tag", key: "tag" },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "Date", dataIndex: "date", key: "date" },
    ]

    // Filtering transactions based on search input and type filter
    let filteredTransactions = transactions.filter((item) => 
        item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter)
    );

    // Sorting transactions based on the selected sort key (date or amount)
    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        } else if (sortKey === "amount") {
            return a.amount - b.amount;
        } else {
            return 0;
        }
    });

    // Function to export transactions to a CSV file
    function exportCSV() {
        var csv = unparse({
            fields: ["name", "type", "tag", "amount", "date"],
            data: transactions
        });
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); // Creating a Blob object with CSV data
        const url = URL.createObjectURL(blob); // Creating a downloadable URL for the Blob
        const link = document.createElement("a"); // Creating a temporary anchor element
        link.href = url;
        link.download = "transactions.csv"; // Setting the download filename
        document.body.appendChild(link); // Adding the link to the document body
        link.click(); // Programmatically clicking the link to start the download
        document.body.removeChild(link); // Removing the link after download
    }

    // Function to import transactions from a CSV file
    function importFromCSV(event) {
        event.preventDefault(); // Preventing default form submission behavior
        try {
            parse(event.target.files[0], {
                header: true, // Ensures the first row is treated as headers
                complete: async function (results) {
                    // Looping through parsed CSV data to add each transaction
                    for (const transaction of results.data) {
                        const newTransaction = {
                            ...transaction,
                            amount: parseFloat(transaction.amount) // Ensuring amount is a number
                        };
                        await addTransaction(newTransaction, true); // Adding the transaction
                    }
                }
            });
            toast.success("All transactions Added!"); // Displaying success message
            fetchTransactions(); // Fetching updated transactions list
            event.target.files = null; // Resetting the file input
        } catch (e) {
            toast.error(e.message); // Displaying error message if parsing fails
        }
    }

    // Returning the JSX for the TransactionTable component
    return (
        <div
            style={{
                padding: "2rem 2rem",
                boxShadow: "var(--shadow)",
                margin: "1rem 2rem",
                borderRadius: "0.5rem"
            }}
        >
            {/* Search and filter section */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem"
                }}
            >
                {/* Search input */}
                <div className='input-flex'>
                    <img src={SearchIcon} alt='search' width={"16"} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='search By name'
                    />
                </div>

                {/* Type filter dropdown */}
                <Select
                    className='select-input'
                    onChange={(value) => setTypeFilter(value)}
                    value={typeFilter}
                    placeholder="Filter"
                >
                    <Select.Option value="">All</Select.Option>
                    <Select.Option value="income">Income</Select.Option>
                    <Select.Option value="expense">Expense</Select.Option>
                </Select>
            </div>

            {/* Transactions table header with export and import buttons */}
            <div className='my-table'>
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "1rem"
                    }}
                >
                    <h2>My Transactions</h2>
                    {/* Radio buttons for sorting */}
                    <Radio.Group
                        className='input-radio'
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value={""}>No Sort</Radio.Button>
                        <Radio.Button value={"date"}>Sort By Date</Radio.Button>
                        <Radio.Button value={"amount"}>Sort By Amount</Radio.Button>
                    </Radio.Group>

                    {/* Export and Import buttons */}
                    <div
                        style={{
                            display: "flex",
                            width: "400px",
                            alignItems: "center",
                            gap: "1rem"
                        }}>
                        <button className='btn' onClick={exportCSV}>
                            Export to CSV
                        </button>
                        <label htmlFor='file-csv' className='btn btn-blue'>
                            Import from CSV
                        </label>
                        <input
                            id='file-csv'
                            type='file'
                            accept='.csv'
                            required
                            style={{ display: "none" }}
                            onChange={importFromCSV} />
                    </div>
                </div>
            </div>

            {/* Transactions table displaying sorted and filtered data */}
            <Table columns={columns} dataSource={sortedTransactions} />
        </div>
    );
}

export default TransactionTable;
