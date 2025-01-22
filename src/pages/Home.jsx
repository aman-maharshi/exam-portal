import { useContext } from 'react'
import Layout from '../Layout'
import GlobalContext from "../GlobalContext"

const Home = () => {
  const { userData, setUserData } = useContext(GlobalContext)

  return (
    <Layout>
      <div className='min-h-screen bg-white w-full p-4'>
        <div className='container'>
          <h1 className='font-bold text-3xl'>Welcome, {userData?.username}</h1>
        </div>
      </div>
    </Layout>
  )
}

export default Home