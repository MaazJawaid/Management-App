import React, { useState } from "react";
import axios from 'axios';
import "../StylingFile/Style.scss";

const StaffRegistration = () => {
  const [Post , setPost] = useState({
    Name:'',
    SurName : '',
    WarName:'',
    Status:true
  });
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setPost({...Post, [event.target.name]: event.target.value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const postData = { ...Post, Status: true };
      axios.post('http://localhost:3000/postStaff', postData)
        .then(response => {
          console.log(response);
          setSubmitStatus('success');
          setTimeout(() => {
            setSubmitStatus(null);
          }, 1000);
          setPost({ Name:'', SurName: '', WarName:'' }); // Clearing the fields
        })
        .catch(err => {
          console.log(err);
          setSubmitStatus('error');
          setTimeout(() => {
            setSubmitStatus(null);
          }, 1000);
        });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!Post.Name.trim()) {
      errors.Name = 'Name is required';
      isValid = false;
    }

    if (!Post.SurName.trim()) {
      errors.SurName = 'Surname is required';
      isValid = false;
    }

    if (!Post.WarName.trim()) {
      errors.WarName = 'War Name is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  return (
    <>
      {submitStatus === "success" && (
        <div className="alert-setting">
          <div className="alert alert-success" role="alert">
            Submitted successfully
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className=" alert-setting" >
          <div className="alert alert-danger" >
            An error occurred
          </div>
        </div>
      )}
      <section id="form">
        <div className="form-wrapper">
          <div className="form-heading">
            <h2>Cadastro de pessoal</h2>
          </div>
          <form className="form-body" onSubmit={handleSubmit} action="">
            <label htmlFor="fname">Nome</label>
            <input
              type="text"
              id="fname"
              placeholder="Your Nome"
              name="Name"
              onChange={handleInput}
              value={Post.Name}
            />
            {errors.Name && <div style={{color:"red" , fontWeight:600}} className="error">{errors.Name}</div>}
            <br />
            <label htmlFor="lname">Sobrenome</label>
            <input
              type="text"
              id="lname"
              name="SurName"
              onChange={handleInput}
              placeholder="Your Sobrenome"
              value={Post.SurName}
            />
            {errors.SurName && <div style={{color:"red" , fontWeight:600} }className="error">{errors.SurName}</div>}
            <br />
            <label htmlFor="wname">Nome da Guerra</label>
            <input
              type="text"
              id="wname"
              name="WarName"
              onChange={handleInput}
              placeholder="Your Nome da Guerra"
              value={Post.WarName}
            />
            {errors.WarName && <div style={{color:"red" , fontWeight:600}} className="error">{errors.WarName}</div>}
            <br />
            <input className="registerbtn" type="submit" value="Enviar"/>
          </form>
        </div>
      </section>
    </>
  );
};

export default StaffRegistration;
