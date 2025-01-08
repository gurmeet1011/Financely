import React, { useEffect } from 'react'
import './styles.css'
import { auth } from '../../firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from "firebase/auth";
import User from "../../assets/user.svg"

function Header() {
  const [user, loading] = useAuthState(auth)
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, loading])
  function logoutFnc() {
    signOut(auth).then(() => {
      toast.success("Logout Successfully");
      navigate('/')
    }).catch((error) => {
      toast.error(error.message)
    });
  }
  return (
    <div className='navbar'>
      <p className='logo'>Financely</p>
      {user && <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <img src={user.photoURL ? user.photoURL : User} style={{ borderRadius: "50%", height: "2rem", width: "2rem" }} />
        <p className='logo link' onClick={logoutFnc}>Logout</p></div>}
    </div>
  )
}

export default Header