import { useEffect } from 'react'
import { useTransactionsContext } from '../hooks/useTransactionsContext'
import { useAuthContext } from '../hooks/useAuthContext'
import TransactionDetails from '../components/TransactionDetails'
import TransactionForm from '../components/TransactionForm'

const Home = () => {

    const {transactions, dispatch} = useTransactionsContext()
    const {user} = useAuthContext()

    useEffect(() => {
        const fetchTransactions = async () => {
            const response = await fetch('/transactions', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if (response.ok) {
                dispatch({type: 'SET_EXPENSES', payload: json})
            }
        }

        if (user) {
            fetchTransactions()
        }
    }, [dispatch, user])

    return (
        <div className='home'>
            <h2>Home</h2>
            <div>
                {transactions && transactions.map((transaction) => (
                    <TransactionDetails key={transaction._id} transaction={transaction} />
                ))}
            </div>
            <TransactionForm />
        </div>
    )
}

export default Home