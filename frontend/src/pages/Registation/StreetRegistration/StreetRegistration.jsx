import React, { useState } from "react";
import "../StylingFile/Style.scss";
import axios from "axios";
import SearchBar from "../../../components/Searchbar/SearchBar";

const StreetRegistration = () => {
  const [Post, setPost] = useState({
    Stret: "",
    ZipCode: "",
    Neigbourhood: "",
    City: ""
  });

  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    setPost({ ...Post, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      axios
        .post("http://localhost:3000/poststreet", Post)
        .then((response) => {
          console.log(response);
          setSubmitStatus("success");
          setTimeout(() => {
            setSubmitStatus(null);
          }, 1000); // Clear the success message after 1 second
          setPost({ Stret: "", ZipCode: "", Neigbourhood: "", City: "" }); // Clear the fields
        })
        .catch((err) => {
          console.log(err);
          setSubmitStatus("error");
          setTimeout(() => {
            setSubmitStatus(null);
          }, 2000); // Clear the error message after 1 second
        });
    }
  };

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!Post.Stret.trim()) {
      errors.Stret = "Street is required";
      isValid = false;
    }

    if (!Post.ZipCode.trim()) {
      errors.ZipCode = "ZipCode is required";
      isValid = false;
    }

    if (!Post.Neigbourhood.trim()) {
      errors.Neigbourhood = "Neigbourhood is required";
      isValid = false;
    }

    if (!Post.City.trim()) {
      errors.City = "City is required";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

  const handleSearchBarFocus = () => {
    setIsSearchBarFocused(true);
  };

  const handleSearchBarBlur = () => {
    setIsSearchBarFocused(false);
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
            <h2>Cadastro de Rua</h2>
          </div>
          <form className="form-body" onSubmit={handleSubmit} action="">
            <label htmlFor="fname">Rua</label>
            <input type="text" id="fname" name="Stret" value={Post.Stret} onChange={handleInput} />
            {errors.Stret && <div style={{ color: "red", fontWeight: 500 }} className="error">{errors.Stret}</div>}
            <br />
            <label htmlFor="fname">CEP</label>
            <input type="text" id="fname" name="ZipCode" value={Post.ZipCode} onChange={handleInput} />
            {errors.ZipCode && <div style={{ color: "red", fontWeight: 500 }} className="error">{errors.ZipCode}</div>}
            <br />
            <label htmlFor="fname">Bairro</label>
            <input type="text" id="fname" name="Neigbourhood" value={Post.Neigbourhood} onChange={handleInput} />
            {errors.Neigbourhood && <div style={{ color: "red", fontWeight: 500 }} className="error">{errors.Neigbourhood}</div>}
            <br />
            <label htmlFor="fname">Cidade</label>
            <input type="text" id="fname" name="City" value={Post.City} onChange={handleInput} />
            {errors.City && <div style={{ color: "red", fontWeight: 500 }} className="error">{errors.City}</div>}
            <br />
            <input className="registerbtn" type="submit" value="Enviar" />
          </form>
        </div>
      </section>
    </>
  );
};

export default StreetRegistration;
