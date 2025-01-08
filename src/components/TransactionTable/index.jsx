import { Radio, Select, Table } from 'antd'
import { parse, unparse } from 'papaparse'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import  SearchIcon  from "../../assets/search.svg"

function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
    const [search, setSearch] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [sortKey, setSortKey] = useState('')
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount"
        },
        {
            title: "Tag",
            dataIndex: "tag",
            key: "tag"
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type"
        },
        {
            title: "Date",
            dataIndex: "date",
            key: "date"
        },
    ]
    let filteredTransactions = transactions.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()) && item.type.includes(typeFilter));
    let sortedTransactions = filteredTransactions.sort((a, b) => {
        if (sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        }
        else if (sortKey === "amount") {
            return a.amount - b.amount;
        }
        else {
            return 0;
        }
    })
    function exportCSV() {
        var csv = unparse({
            fields: ["name", "type", "tag", "amount", "date"],
            data: transactions
        })
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    function importFromCSV(event) {
        event.preventDefault();
        try {
            parse(event.target.files[0], {
                header: true,
                complete: async function (results) {
                    for (const transaction of results.data) {
                        const newTransaction = {
                            ...transaction,
                            amount: parseFloat(transaction.amount)
                        }
                        await addTransaction(newTransaction, true)
                    }

                }
            })
            toast.success("All transactions Added!");
            fetchTransactions();
            event.target.files = null;
        }
        catch (e) {
            toast.error(e.message)
        }

    }
    return (
        <div
            style={{
                padding: "2rem 2rem",
                boxShadow:"var(--shadow)",
                margin:"1rem 2rem",
                borderRadius:"0.5rem"

            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    alignItems: "center",
                    marginBottom: "1rem"
                }}
            >


                <div className='input-flex'>
                    <img src={SearchIcon} alt='search' width={"16"} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder='search By name'
                    />
                </div>

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
                    <Radio.Group
                        className='input-radio'
                        onChange={(e) => setSortKey(e.target.value)}
                        value={sortKey}
                    >
                        <Radio.Button value={""}>No Sort</Radio.Button>
                        <Radio.Button value={"date"}>Sort By Date</Radio.Button>
                        <Radio.Button value={"amount"}>Sort By Amount</Radio.Button>
                    </Radio.Group>
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

            <Table columns={columns} dataSource={sortedTransactions} />
        </div>
    )
}

export default TransactionTable