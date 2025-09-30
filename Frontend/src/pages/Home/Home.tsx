import { useSelector } from 'react-redux'
import { persistor, type Rootstate } from '../../store/store'
import { useDispatch } from 'react-redux'
import { clearData } from '../../store/Slice/userSlice/authDataSlice'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const userData = useSelector((state:Rootstate)=>state.authData)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    console.log("userData from redux store",userData);
    const handleLogout = () =>{
        dispatch(clearData());
        persistor.purge();
        navigate('/login');
        
    }
  return (
    <>
    <div>Home</div>
    <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Home