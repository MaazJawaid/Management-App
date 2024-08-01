import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../../../components/Searchbar/SearchBar';

const ApplicantRegistration = () => {
  const [submitStatus, setSubmitStatus] = useState(null);

  const [post, setPost] = useState({
    Name: '',
    CPF: '',
    Address: '',
    References: '',
  });

  const [errors, setErrors] = useState({});

  const handleInput = event => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validateForm()) {
      axios
        .post('http://localhost:3000/postApplicant', post)
        .then(response => {
          setSubmitStatus('success');
          setTimeout(() => {
            setSubmitStatus(null);
          }, 1000);
          setPost({ Name: '', CPF: '', Address: '', References: '' }); // Clearing the fields
          console.log(response);
        })
        .catch(err => {
          setSubmitStatus('error');
          setTimeout(() => {
            setSubmitStatus(null);
          }, 3000);
          console.log(err);
        });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!post.Name.trim()) {
      errors.Name = 'Name is required';
      isValid = false;
    }

    if (!post.CPF.trim()) {
      errors.CPF = 'CPF is required';
      isValid = false;
    }

    if (!post.Address.trim()) {
      errors.Address = 'Address is required';
      isValid = false;
    }

    if (!post.References.trim()) {
      errors.References = 'References is required';
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
            <SearchBar/>
            <h2>Registro do candidato</h2>
          </div>
          <form className="form-body" onSubmit={handleSubmit}>
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="Name" value={post.Name} onChange={handleInput} />
            {errors.Name && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.Name}</div>}
            <br />
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" name="CPF" value={post.CPF} onChange={handleInput} />
            {errors.CPF && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.CPF}</div>}
            <br />
            <label htmlFor="address">Rua</label>
            <input type="text" id="address" name="Address" value={post.Address} onChange={handleInput} />
            {errors.Address && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.Address}</div>}
            <br />
            <label htmlFor="references">Referência</label>
            <input type="text" id="references" name="References" value={post.References} onChange={handleInput} />
            {errors.References && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.References}</div>}
            <br />
            <input className="registerbtn" type="submit" value="Enviar" />
          </form>
        </div>
      </section>
    </>
  );
};

export default ApplicantRegistration;
