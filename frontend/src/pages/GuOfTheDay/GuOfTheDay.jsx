import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { jwtDecode } from 'jwt-decode'
const GuOfTheDay = () => {


  const [Occurance_hold, SetOccurance_hold] = useState([])
  const [GarisonFalse, setGarisonFalse] = useState([])
  const [occuranceId, setoccuranceId] = useState(null)
  const [garisonId, setGarisonId] = useState(null)
  const [av_garison, setav_garison] = useState([])
  const [bunchId, setBunchId] = useState([])
  const [bunchValue, setBunchValue] = useState([])
  const [loading, setLoading] = useState(false)



  useEffect(() => {
    // Fetch data when the component mounts
    setLoading(true);
    axios
      .get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatus")
      .then((response) => {
        // Set the fetched data in state
        SetOccurance_hold(response.data);
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });


    axios
      .get("https://srv496943145.host.ultaserver.net/getGarrison")
      .then((response) => {
        setGarisonFalse(response.data)
        console.log("Garrson finded are", GarisonFalse)
        // Set the fetched data in state
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false)
      })


  }, []);


  const handleInput = (event) => {

    const { id } = event.target;
    console.log("d", id)
    setoccuranceId(id);
  }

  const handleInputGarison = (event) => {
    // event.preventDefault();
    const { id, value, checked } = event.target;

    console.log("Garison", id)
    setGarisonId(id);
    console.log("Value", value);


    if (checked && !bunchId.includes(id)) {
      // If checkbox is checked and ID is not already in staffId, add it
      setBunchId(prevIds => [...prevIds, id]);

    } else if (!checked && bunchId.includes(id)) {
      // If checkbox is unchecked and ID is in staffId, remove it
      setBunchId(prevIds => prevIds.filter(item => item !== id));
    }

    if (checked) {
      setGarisonId(id);
    } else if (id === garisonId) {
      setGarisonId(''); // Unset GarrisonId if the checkbox is unchecked
    }

    if (checked) {

      let obj = {
        id: uuidv4(),
        "garissonName": value,
        garissonId: id,
        DispachTime: new Date(),
        ArrivalTime: "Notarrived",
        disabled: false
      }

      setav_garison((prevValues) => [...prevValues, obj]);
    } else {
      setav_garison((prevValues) => prevValues.filter((item) => item.garissonName !== value));
    }

    setBunchValue((prevValues) => {
      const updatedBunchValue = checked
        ? [...prevValues, value] // If checked, add the value to the bunchValue array
        : prevValues.filter((item) => item !== value); // If unchecked, remove the value from the bunchValue array
      return updatedBunchValue; // Return the updated bunchValue
    });
  }

  // console.log("BunchId" , bunchId)
  // console.log('id' , garisonId)
  // console.log("BunchValue" , bunchValue)
  console.log("Av_garison", av_garison)

  const handleData = (e) => {
    // e.preventDefault()
    ; if (!occuranceId) {
      alert("Selecione a ocorrência por favor!")
      return
    }
    if (av_garison.length === 0) {
      alert("Selecione a guarnição, por favor!")
      return
    }


    const token = localStorage.getItem("token")
    const DispatchBy = jwtDecode(token).username

    axios.put(`https://srv496943145.host.ultaserver.net/occuranceDispatch/${occuranceId}`, { DispatchBy })
      .then((response) => {
        console.log("data is ", response);
        axios.get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatus")
          .then((response) => {
            SetOccurance_hold(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });

      })
      .catch((error) => {
        console.error('Error fetching vehicle data:', error);
      });

    // dispatch time added 
    axios.put(`https://srv496943145.host.ultaserver.net/occuranceDispatchTime/${occuranceId}`)
      .then((response) => {
        console.log("data is ", response.data);

      })
      .catch((error) => {
        console.error('Error fetching vehicle data:', error);
      });

    axios.put(`https://srv496943145.host.ultaserver.net/updataGarrison`, { dataArray: bunchId })
      .then((response) => {
        console.log(response);
        // Fetch updated GarisonFalse data after dispatch
        axios.get("https://srv496943145.host.ultaserver.net/getGarrison")
          .then((response) => {
            setGarisonFalse(response.data);
            console.log("Newly Garrson finded are", GarisonFalse)

          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error('Error fetching vehicle data:', error);
      });

    axios.put(`https://srv496943145.host.ultaserver.net/occuranceDispatchGarison/${occuranceId}`, { dataArray: av_garison })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Error fetching vehicle data:', error);
      });
  }


  return (


    <div className="custom-container">
      <div className="container">
        <div className="Dashboard_heading">
          <h3>Ocorrência aguardando atendimento</h3>
          <hr className='my-4' />
        </div>

        <div className="row full_hieght_2">
          <div className="col-md-8 col-sm-12 " style={{ marginTop: "13px" }}>
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
              <CircularProgress size={100} />
            </Box> :

              Occurance_hold.map((v, i) => {

                return (
                  <div className="col-md-12 col-sm-12 my-3  row occurance_holds d-flex" >


                    <input type="radio" name='11' id={v._id} onChange={handleInput} />
                    <div className="col-md-4 col-sm-12">
                      <h6>Telefone : {v.phone} </h6>
                    </div>
                    <div className="col-md-4 col-sm-12">
                      <h6 className='ml-sm-2'>Solicitante : {v.Applicant} </h6>
                    </div>
                    <div className="col-md-4 col-sm-12">
                      <h6 className='ml-sm-2'>Cód. Atendimento : {v.occurance_Code} </h6>
                    </div>
                    <div className="col-md-4 col-sm-12">
                      <h6 className='ml-sm-2'>Rua : {v.Street} </h6>
                    </div>
                    <div className="col-md-4 col-sm-12">
                      <h6 className='ml-sm-2'>Numero da Ocorrencia: {v.occurance_Number} </h6>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="col-md-4 col-sm-12 ">
            <div className="Avaliable_gar my-3   ">
              <h3 className="text-center">Garnição Disponível</h3>
              {
                loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                  <CircularProgress size={100} />
                </Box> :
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', marginBottom: '10px', marginTop: '10px' }}>
                    {GarisonFalse.map((v, i) => {
                      return (
                        <div>
                          <input
                            type="checkbox"
                            id={v._id}
                            name="av_garison"
                            value={v.StaffName + " " + v.VehcleName}
                            onChange={(e) => handleInputGarison(e)}
                          />
                          <label for="vehicle1" className="ml-2">
                            {v.StaffName + ' ' + v.VehcleName}
                          </label>
                        </div>
                      )
                    })}

                  </div>}

            </div>

            <div className="button mt-3 text-center">
              <button href="" className="btn btn-primary " onClick={handleData} style={{ padding: "10px 120px" }}> Despatcho</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuOfTheDay