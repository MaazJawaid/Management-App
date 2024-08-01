import React from 'react'
import "./ViewReport.scss"
const ViewReport = () => {
    return (
        <div className="container-wrapper">
            <div className="container">
                <div className="top-container">
                    <div className="occureceNumber">
                        <span>Occurence Report Number : 001</span>
                    </div>
                    <div className="current-date-and-time">
                        <span>Date : 0001</span>
                        <span>Time :23:00</span>
                    </div>
                </div>
                <div className="main-content">
                    <div className="applicantData">

                        <div className="applicantheading">
                            <h5>Applicant : </h5>
                        </div>

                        <div className="form form_card row my-5">
                            <div class="input-group mb-3 col-md-4 col-sm-12">
                           

                            </div>
                        </div>


                    </div>

                </div>
            </div>
        </div>
    )
}

export default ViewReport
