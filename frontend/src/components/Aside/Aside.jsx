import React, { useState } from 'react'
import './Aside.scss'
import { Link, useNavigate } from 'react-router-dom'
import BoltIcon from '@mui/icons-material/Bolt';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import CodeIcon from '@mui/icons-material/Code';
import PersonIcon from '@mui/icons-material/Person';
import StreetviewIcon from '@mui/icons-material/Streetview';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import ArticleIcon from '@mui/icons-material/Article';
import logo from '../../assets/r7t7t1alcs182ncao9mvjis909.png'
const Aside = ({sendDataToParent ,onLogout}) => {
    
   const navigate =  useNavigate()

  const handleTrigger = () => {
    sendDataToParent(false);   
};

const handleLogout=()=>{
    localStorage.removeItem("token")
    localStorage.removeItem("isLoggedIn")
    navigate('/login', { replace: true });
    onLogout()

}

//   const sendData =()=>{
//         sendDatatoparent(isOpen)
//   }
    return (
        <div className={`main-left `}>
            <div className="logoandmenuicon">

                <Link to="/">
                    <img style={{width:"40px"}} src={logo} alt="" srcset="" />
                </Link>
                <div className="menu-icon" onClick={handleTrigger} >
                    <CloseIcon />
                </div>

            </div>
            <div className="main-left-wrapper">

                <div className="operation ">


                    <h5>Operações</h5>
                    <ul>

                        <li onClick={handleTrigger}>
                            <BoltIcon fontSize="small" />
                            <Link to="/service" >Serviço</Link>
                        </li>

                        <li onClick={handleTrigger}>
                            <EmojiObjectsIcon fontSize="small" />
                            <Link to="/guoftheday" >Despacho da Guarnição</Link>
                        </li>

                        <li onClick={handleTrigger}>
                            <GroupIcon fontSize="small" />
                            <Link to="/arrival" >Chegada à Ocorrência</Link>

                        </li>


                        <li onClick={handleTrigger}>
                            <LibraryBooksIcon fontSize="small" />
                            <Link to="/closing" >Encerramento da Ocorrência</Link>
                        </li>

                        <li onClick={handleTrigger}>
                            <ArticleIcon fontSize="small" />
                            <Link to="/report" >Report</Link>
                        </li>
                    </ul>

                    <div className="registration">
                        <h5>Registros</h5>
                        <ul>
                        <li onClick={handleTrigger}>
                                <EmojiObjectsIcon fontSize="small" />
                                <Link to="/staffregistration" > Equipe</Link>
                            </li>
                            <li onClick={handleTrigger}>
                                <DirectionsCarIcon fontSize="small" />
                                <Link to="/vehicleregistration" > Veículo</Link>
                            </li >
                            <li onClick={handleTrigger}>
                                <SettingsIcon fontSize="small" />
                                <Link to="/guregistration" > Guarnição do Dia</Link>
                            </li>
                            <li onClick={handleTrigger}>
                                <PersonIcon fontSize="small" />
                                <Link to="/appilcantregistration" > Candidato</Link>

                            </li>
                            <li onClick={handleTrigger}>
                                <StreetviewIcon fontSize="small" />
                                <Link to="/streetregistration" > Endereço</Link>

                            </li>
                            <li onClick={handleTrigger}>
                                <CodeIcon fontSize="small" />
                                <Link to="/occurencecode" > Código de ocorrência</Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div onClick={handleLogout}>
                    <LogoutIcon
                    sx={{ fontSize: 40}}
                    style={{color:"red" ,width:"100%" , cursor:"pointer"}}
                    /> 
                </div>
            </div>
        </div>
    )
}

export default Aside