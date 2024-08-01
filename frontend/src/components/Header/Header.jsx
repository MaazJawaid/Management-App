import React from 'react'
import './Header.scss'
import { Link } from 'react-router-dom'
const Header = () => {
    return (
        <>
            <div id='header'>
                <div className="header-wrapper">

                    <div className="header-left header-children">
                        {/* <Link to="/">
                            LOGO
                        </Link> */}
                        <div className="menu-icon">
                            <div></div>
                            <div></div>
                            <div></div> 
                        </div>
                    </div>
                    <div className="header-right header-children">
                        <span>Dashboard</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header