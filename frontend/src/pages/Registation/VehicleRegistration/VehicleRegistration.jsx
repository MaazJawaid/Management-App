import React, { useState } from "react";
import axios from "axios";
import "../StylingFile/Style.scss";

const VehicleRegistration = () => {
  const [post, setPost] = useState({
    VehicleNumber: "",
    Plate: "",
    Brand: "",
    Model: "",
    Status:true
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      const postData = { ...post, Status: true };
      axios
        .post("http://localhost:3000/postVehicle", postData)
        .then((response) => {
          console.log(response);
          setSubmitStatus('success');
          setTimeout(() => {
            setSubmitStatus(null);
          }, 1000);
          setPost({ VehicleNumber: "", Plate: "", Brand: "", Model: "",Status:"" }); // Clearing the fields
        })
        .catch((err) => {
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

    if (!post.VehicleNumber.trim()) {
      errors.VehicleNumber = 'VehicleNumber is required';
      isValid = false;
    }

    if (!post.Plate.trim()) {
      errors.Plate = 'Plate is required';
      isValid = false;
    }

    if (!post.Brand.trim()) {
      errors.Brand = 'Brand is required';
      isValid = false;
    }

    if (!post.Model.trim()) {
      errors.Model = 'Model is required';
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
            <h2>Registro de Veículo</h2>
          </div>
          <form className="form-body" onSubmit={handleSubmit} action="">
            <label htmlFor="vehicleNumber">Número do veículo</label>
            <input
              type="text"
              id="vehicleNumber"
              name="VehicleNumber"
              placeholder="Seu Número do veículo"
              onChange={handleInput}
              value={post.VehicleNumber}
            />
            {errors.VehicleNumber && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.VehicleNumber}</div>}
            <br />
            <label htmlFor="plate">Placa</label>
            <input
              type="text"
              id="plate"
              name="Plate"
              placeholder="Sua Número do Placa"
              onChange={handleInput}
              value={post.Plate}
            />
            {errors.Plate && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.Plate}</div>}
            <br />
            <label htmlFor="brand">Marca</label>
            <input
              type="text"
              id="brand"
              name="Brand"
              placeholder="Sua Marca"
              onChange={handleInput}
              value={post.Brand}
            />
            {errors.Brand && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.Brand}</div>}
            <br />
            <label htmlFor="model">Modelo</label>
            <input
              type="text"
              id="model"
              name="Model"
              placeholder="Seu veículo Modelo"
              onChange={handleInput}
              value={post.Model}
            />
            {errors.Model && <div style={{ color: "red", fontWeight: 600 }} className="error">{errors.Model}</div>}
            <br />
            <input className="registerbtn" type="submit" value="Enviar" />
          </form>
        </div>
      </section>
    </>
  );
};

export default VehicleRegistration;
