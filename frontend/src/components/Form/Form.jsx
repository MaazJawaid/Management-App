import React from 'react'
import './Form.scss'
const Form = () => {
    return (
        <>
            <section id='form'>
                <div className="form-wrapper">

                    <div className="form-heading">
                        <h2>Vehicle registration</h2>
                    </div>
                    <form className='form-body' action="">
                    <label for="fname">First Name</label>
                     <input type="text" id="fname" name="firstname" placeholder="Your name.."/>
                     <br />
                    <label for="fname">First Name</label>
                     <input type="text" id="fname" name="firstname" placeholder="Your name.."/>
                     <br />
                    <label for="fname">First Name</label>
                     <input type="text" id="fname" name="firstname" placeholder="Your name.."/>
                     <br />
                    <label for="fname">First Name</label>
                     <input type="text" id="fname" name="firstname" placeholder="Your name.."/>

                        <br />

                        <input class="registerbtn" type="submit" value="Submit"/>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Form