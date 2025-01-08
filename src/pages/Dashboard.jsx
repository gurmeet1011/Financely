import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards'
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import TransactionTable from '../components/TransactionTable';
import ChartComponent from '../components/Charts';
import nodataImage from '../assets/nodata.png';


function Dashboard() {
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  }
  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  }
  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  }
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  }
  const onFinish = (values, type) => {
    // console.log(values.date,moment(values.date))
    const newTransaction = {
      type: type,
      name: values.name,
      tag: values.tag,
      amount: parseFloat(values.amount),
      date: values.date.format("YYYY-MM-DD")
    }
    addTransaction(newTransaction)
  }
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    }
    catch (e) {
      console.error("Error adding document: ", e)
      if (!many) toast.error("Couldn't add transaction")
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, [user]);
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      // console.log(transactions);
      toast.success("Transactions Fetched")
    }
    setLoading(false);
  }
  useEffect(() => {
    calculateBalance();
  }, [transactions]);
  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type == "income") {
        incomeTotal += transaction.amount;
      }
      else {
        expenseTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }
  useEffect(() => {
    console.log("Income", income, totalBalance, expense);

  }, [income])
  const sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  return (
    <div>
      <Header />
      {loading ? <p>Loading...</p> : <>
        <Cards showExpenseModal={showExpenseModal} showIncomeModal={showIncomeModal} income={income} expense={expense} totalBalance={totalBalance} />
        <AddExpenseModal
          isExpenseModalVisible={isExpenseModalVisible}
          handelExpenseCancel={handleExpenseCancel}
          onFinish={onFinish}
        />
        <AddIncomeModal
          isIncomeModalVisible={isIncomeModalVisible}
          handelIncomeCancel={handleIncomeCancel}
          onFinish={onFinish}
        />

        {transactions.length === 0 ? <div className='noDataImg'>
          <img src={nodataImage} alt='No Data' className='noDataImg' />
        </div> : <ChartComponent sortedTransactions={sortedTransactions} />}
        <TransactionTable transactions={transactions}
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions} />
      </>}

    </div>
  )
}

export default Dashboard