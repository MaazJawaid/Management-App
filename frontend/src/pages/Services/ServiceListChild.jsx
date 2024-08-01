import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from 'jwt-decode'

const ServiceListChild = () => {

  const [data, setData] = useState([])
  const [oldData, setOldData] = useState([])
  const [submitStatus, setSubmitStatus] = useState(null);

  const navigate = useNavigate()
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://srv496943145.host.ultaserver.net/getnewoccuranceAll/${id}`)
      .then((response) => {
        // Set the fetched data in state
        setData(response.data);
        setOldData(response.data);

        // console.log(response.data)
        console.log(data)
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });

  }, [])

  const handleEditClick = () => {
    navigate('/service/editservice', { state: { phone: data.phone } });
  };

  const occurenceUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      const MadeBy = jwtDecode(token).username;

      let changingVarValue;

      if ((oldData.Request === data.Request) && (oldData.Description === data.Description)) {
        changingVarValue = 'none'
      } else if ((oldData.Request !== data.Request) && (oldData.Description === data.Description)) {
        changingVarValue = 'request'
      } else if ((oldData.Request === data.Request) && (oldData.Description !== data.Description)) {
        changingVarValue = 'description'
      } else if ((oldData.Request !== data.Request) && (oldData.Description !== data.Description)) {
        changingVarValue = 'both'
      }

      // Update formData state with current data before making requests
      const updatedFormData = {
        OccurenceId: id,
        request: data.Request,
        description: data.Description,
        changedBy: MadeBy,
        changingVar: changingVarValue
      };

      console.log(updatedFormData)

      // const updateResponse = await axios.put(`https://srv496943145.host.ultaserver.net/updateOccurance/${id}`, {
      //   Request: data.Request,
      //   Description: data.Description
      // });
      // console.log("Data updated successfully:", updateResponse.data);      
      
      const historyResponse = await axios.post('https://srv496943145.host.ultaserver.net/occurrence/edit/history', updatedFormData);
      console.log(historyResponse.data);
      setSubmitStatus('Edited');
      
      setOldData(historyResponse.data)

      setTimeout(() => {
        setSubmitStatus(null);
      }, 2000);
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="container">
      {submitStatus === 'Edited' && (
        <div className="alert alert-danger" style={{ width: '20%' }} role="alert">
          updated successfully
        </div>
      )}
      {/* <div className="btnDiv" style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
        <button
          onClick={handleEditClick}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            paddingLeft: '50px',
            paddingRight: '50px',
            paddingTop: '7px',
            paddingBottom: '7px',
            borderRadius: '3px',
            borderColor: '#007bff',
            outlineColor: '#007bff',
            marginRight: '20px'
          }}
        >
          Edição Personalizada
        </button>
      </div> */}
      <div className=" row garison my-4 popa ">
        <div style={{ backgroundColor: "#ffff", display: 'flex', justifyContent: 'center' }} className=" col-md-4 col-sm-12 Record_1">

          <ul style={{ width: '70%' }}>
            <li>
              <h6> Telephono: {data.phone}</h6>
            </li>
            <li>
              <h6> Solicitante: {data.Applicant}</h6>
            </li>
            <li>
              <h6> Cód. Atendimento: {data.occurance_Code}</h6>
            </li>
            <li>
              <h6> Numero de Ocorrência: {data.occurance_Number}</h6>
            </li>
          </ul>
        </div>
        <div style={{ backgroundColor: "#ffff", display: 'flex', justifyContent: 'center' }} className=" col-md-4 col-sm-12  Record_2 less-gap_3">
          <ul style={{ width: '70%' }}>
            <li>
              <h6> Rua: {data.Street}</h6>
            </li>
            <li>
              <h6>Bairro: {data.Neighbourhood}</h6>
            </li>
            <li>
              <h6> Cidade: {data.City}</h6>
            </li>

            <li>
              <h6> Referência: {data.Reference}</h6>
            </li>
          </ul>
        </div>
      </div>

      <div className=" row request_card py-3 my-4 less-gap">
        <label for="vehicle3" className="ml-2 font-weight-bold">
          {" "}
          Solicitação
        </label>
        <div class=" col-sm-12 col-md-12 input-group request-group mb-3 mt-3">
          <textarea
            className="form-control"
            placeholder="Request"
            aria-label="Username"
            aria-describedby="basic-addon1"
            name="Request"
            value={data.Request}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="loki"></div>

      <div className=" row request_card py-3 mb-5 less-gap_2" style={{ marginTop: "10px" }}>
        <label for="vehicle3" className="ml-2 font-weight-bold" >
          {" "}
          Observaçã
        </label>
        <div class=" col-sm-12 col-md-12 input-group request-group mb-3 mt-3">
          <textarea
            className="form-control"
            placeholder="Description"
            aria-label="Username"
            aria-describedby="basic-addon1"
            name="Description"
            value={data.Description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="d-flex justify-content-center ">
        <input
          onClick={occurenceUpdate}
          className="btn btn-primary p-3 m-3 w-50 text-center" value="Confirmar Edição" type="button" />
      </div>

    </div>
  );
};

export default ServiceListChild;
