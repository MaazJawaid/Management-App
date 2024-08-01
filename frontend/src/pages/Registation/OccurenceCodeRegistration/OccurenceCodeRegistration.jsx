import React, { useState } from 'react';
import '../StylingFile/Style.scss';
import axios from 'axios';
import SearchBar from '../../../components/Searchbar/SearchBar';

const OccurrenceCodeRegistration = () => {
  const [post, setPost] = useState({
    Code: '',
    Description: '',
    OBS: ''
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInput = event => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validateForm()) {
      axios
        .post('http://localhost:3000/postoccurance', post)
        .then(response => {
          setSubmitStatus('success');
          setTimeout(() => {
            setSubmitStatus(null);
          }, 1000);
          console.log(response)
          setPost({ Code: '', Description: '', OBS: '' }); // Clearing the fields
        })
        .catch(err => {
          setSubmitStatus('error');
          setTimeout(() => {
            setSubmitStatus(null);
          }, 1000);
          console.log(err);
        });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!post.Code.trim()) {
      errors.Code = 'Code is required';
      isValid = false;
    }

    if (!post.Description.trim()) {
      errors.Description = 'Description is required';
      isValid = false;
    }

    if (!post.OBS.trim()) {
      errors.OBS = 'OBS is required';
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
            <SearchBar />
            <h2>Cadastro de Código de Ocorrência</h2>
          </div>
          <form className="form-body" onSubmit={handleSubmit}>
            <label htmlFor="code">Código de registro</label>
            <input type="text" id="code" name="Code" value={post.Code} onChange={handleInput} />
            {errors.Code && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.Code}</div>}
            <br />
            <label htmlFor="description">Descrição</label>
            <input
              type="text"
              id="description"
              name="Description"
              value={post.Description}
              onChange={handleInput}
            />
            {errors.Description && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.Description}</div>}
            <br />
            <label htmlFor="obs">OBS</label>
            <input type="text" id="obs" name="OBS" value={post.OBS} onChange={handleInput} />
            {errors.OBS && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.OBS}</div>}
            <br />
            <input className="registerbtn" type="submit" value="Enviar" />
          </form>
        </div>
      </section>
    </>
  );
};

export default OccurrenceCodeRegistration;
