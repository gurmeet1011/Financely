import React from 'react'
import Header from '../components/Header'
import SignupSignin from '../components/SignupSignin'

function Signup() {
  return (
    <div>
        <Header/>
        <div className='wrapper' style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
        }}>
            <SignupSignin/>
        </div>
    </div>
  )
}

export default Signup
