import { useContext } from 'react'
import GlobalContext from "../GlobalContext"
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const { userData, setUserData } = useContext(GlobalContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    setUserData({})
    navigate('/')
  }

  return (
    <div className='bg-white w-[250px] p-4 h-full rounded-xl shadow-md flex flex-col gap-4'>
      <div className='p-4 rounded-xl font-bold card-gradient text-white cursor-pointer'>Home</div>
      <div className='p-4 rounded-xl font-bold bg-gray-100 cursor-pointer '>Study Material</div>
      <div className='p-4 rounded-xl font-bold bg-gray-100 cursor-pointer '>Test Results</div>


      <div onClick={handleLogout} className='p-4 mt-auto text-gray-500 font-bold cursor-pointer'>
        Logout
      </div>
    </div>
  )
}

export default Sidebar