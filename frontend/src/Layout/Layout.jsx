import React, { useEffect, useState } from 'react'
import './Layout.scss'
import { Outlet } from 'react-router-dom'
import Aside from '../components/Aside/Aside.jsx'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from "react-router-dom";

const Layout = ({onLogout}) => {
  let navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);

  const handleTrigger = () => setIsOpen(!isOpen);

  const receivedData=(data)=>{
      setIsOpen(data)
      console.log("data passed from child is parent is " , data)
  }
  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key === 'Backspace') {
  //       event.preventDefault(); // Prevent default backspace behavior
  //     }
  //   };
  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => {
  //     window.removeEventListener('keydown', handleKeyDown);
  //   };
  // }, []);

  useEffect(()=>{
    const token = localStorage.getItem("token")
    if(token){
      const user = jwtDecode(token)
     
      if(!user){
        console.log("jwt token is not corrct");
        localStorage.removeItem('token')
        navigate("/login")
        
      }
    }
  },[]) 
    

  return (
    <>
      <main className='layout'>
        <aside className={`aside-layout ${isOpen ? "sidebar--open" : ""}`}>
          <Aside onLogout={onLogout}  sendDataToParent={receivedData} />
        </aside>
        <div className='main-layout'>
          <div className="menu-icon" onClick={handleTrigger} >
            <div></div>
            <div></div>
            <div></div>
          </div>
          <Outlet />
        </div>
      </main>
    </>
  )
}

export default Layout