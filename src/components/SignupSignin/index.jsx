import React, { useState } from 'react'
import './styles.css'
import Input from '../Input'
import Button from '../Button'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db, provider } from "../../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function SignupSigninComponent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();
  function loginWithEmail() {
    if (email !== "" && password !== "") {
      setLoading(true)
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in 
          const user = userCredential.user;
          toast.success("Login successfully")
          setEmail("")
          setPassword("")
          setLoading(false)
          navigate('/dashboard')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage)
          setLoading(false)
        });
    }
    else {
      toast.error("Please Enter Email and Password")
      setLoading(false)
    }

  }
  function signUpWithEmail() {
    console.log(name, email, password, confirmPassword);
    if (name !== "" && email !== "" && password !== "" && confirmPassword !== "") {
      setLoading(true)
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user);
            toast.success("user created successfully!")
            setLoading(false)
            setName("");
            setEmail("")
            setConfirmPassword("")
            setPassword("")
            createDoc(user)
            navigate('/dashboard')
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error(errorMessage)
            setLoading(false)
            // ..
          });
      }
      else {
        toast.error("password and confirm password don't match!");
        setLoading(false)
      }
    }
    else {
      toast.error("All fields are required!");
      setLoading(false)
    }

  }
  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log(user);
          createDoc(user)
          toast.success("User Authenticated");
          setLoading(false)
          navigate('/dashboard')
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          toast.error(errorMessage)
          setLoading(false)
        });
    }
    catch (e) {
      toast.error(e.message)
    }

  }
  async function createDoc(user) {
    setLoading(true);
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email ? user.email : email,
          photoUrl: user.photoUrl ? user.photoUrl : "",
          createdAt: new Date()
        })
        toast.success("doc created");
        setLoading(false)
      }
      catch (e) {
        toast.error(e.message)
        setLoading(false)
      }
    }
    else {
      // toast.error("Doc already exists");
      setLoading(false);
    }
  }
  return (
    <>
      {loginForm ?
        <div className='signup-wrapper'>
          <h2 className='title'>Login on <span style={{ color: 'var(--theme)' }}>Financely.</span></h2>
          <form>
            <Input type="email" label='Email' placeholder='JohnDoe@gmail.com' state={email} setState={setEmail} />
            <Input type="password" label='Password' placeholder='Example@123' state={password} setState={setPassword} />
            <Button onClick={loginWithEmail} disabled={loading} text={loading ? "Loading..." : 'Login Using Email and Password'} />
            <Button onClick={googleAuth} disabled={loading} text={loading ? "Loading..." : 'Login Using Google'} blue={true} />
            <p className='p-login' onClick={() => setLoginForm(false)}>or Don't Have An Account ? Click Here</p>
          </form>
        </div> : <div className='signup-wrapper'>
          <h2 className='title'>Sign Up on <span style={{ color: 'var(--theme)' }}>Financely.</span></h2>
          <form>
            <Input label='Full Name' placeholder='John Doe' state={name} setState={setName} />
            <Input type="email" label='Email' placeholder='JohnDoe@gmail.com' state={email} setState={setEmail} />
            <Input type="password" label='Password' placeholder='Example@123' state={password} setState={setPassword} />
            <Input type="password" label='Confirm Password' placeholder='Example@123' state={confirmPassword} setState={setConfirmPassword} />
            <Button onClick={signUpWithEmail} disabled={loading} text={loading ? "Loading..." : 'Signup Using Email and Password'} />
            <Button onClick={googleAuth} disabled={loading} text={loading ? "Loading..." : 'Signup Using Google'} blue={true} />
            <p className='p-login' onClick={() => setLoginForm(true)}>or Have An Account Already ? Click Here</p>
          </form>
        </div>}</>
  )
}

export default SignupSigninComponent