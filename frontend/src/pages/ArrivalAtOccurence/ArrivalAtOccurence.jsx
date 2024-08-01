import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ArrivalAtOccurence = () => {

  const [Occurance_hold, setOccurance_hold] = useState([]);
  const [findgarrison, setFindGarission] = useState([])
  const [arriveId, setarriveId] = useState([])
  const [garissonIds, setGarissonIds] = useState([])
  const [alltruegarrisionallgarison, setalltruegarrisionallgarison] = useState(0)
  const [allgarisonLength, setallgarisonLength] = useState(0)
  const [loading, setLoading] = useState(false)
  const [jugaar, setjugaar] = useState(0)


  useEffect(() => {
    setLoading(true);
    axios
      .get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatusWithZero")
      .then((response) => {
        setOccurance_hold(response.data)
        console.log(Occurance_hold)
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });
    // console.log("Garrson", Occurance_hold)
    axios.get(`https://srv496943145.host.ultaserver.net/getnewoccuranceocurrencesgarissonwithtruedisabled/${arriveId}`)
      .then((response) => {
        console.log("garisson who are true", response.data.length)
        setalltruegarrisionallgarison(response.data.length)

      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false)
      })



  }, [arriveId, jugaar])

  const handleChange = (event) => {
    console.log("handle chnage triggered");
    const { value, id, checked } = event.target;

    // console.log(value)

    if (checked && !garissonIds.includes(id)) {
      // If checkbox is checked and ID is not already in staffId, add it
      setGarissonIds(prevIds => [...prevIds, id]);

    } else if (!checked && garissonIds.includes(id)) {
      // If checkbox is unchecked and ID is in staffId, remove it
      setGarissonIds(prevIds => prevIds.filter(item => item !== id));
    }



  }
  // console.log("garsion id are " , garissonIds)
  const handleInput = (e) => {
    // e.preventDefault()
    // console.log(e)
    const { id } = e.target;
    setarriveId(id)


    //direct api call to get av_garsion from newoccrunces table
    axios
      .get(`https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatus/${id}`)
      .then((response) => {
        setFindGarission(response.data.av_garison)
        setallgarisonLength(response.data.av_garison.length)
        console.log("garsionlength", response.data.av_garison.length)
        // Set the fetched data in state
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });

  }

  const handleStatus = (e) => {
    e.preventDefault();
    axios.put(`https://srv496943145.host.ultaserver.net/occuranceDispatcharrivegarrison/${arriveId}`, { garissonIds })
      .then((response) => {
        // Update Occurance_hold after the arrival status has been successfully updated
        setjugaar(response)
        setFindGarission([])
        axios.get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatusWithZero")
          .then((response) => {
            setOccurance_hold(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error updating garrisons:", error);
      });

    if (alltruegarrisionallgarison === allgarisonLength) {
      console.log("alltruegarrisionallgarison === allgarisonLengths");
      const token = localStorage.getItem("token")
      const InformedOfArrivalBy = jwtDecode(token).username
      axios.put(`https://srv496943145.host.ultaserver.net/occuranceDispatcharrive/${arriveId}`, { InformedOfArrivalBy })
        .then((response) => {
          console.log("data is ", response);
          axios
            .get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatusWithZero")
            .then((response) => {
              setOccurance_hold(response.data)
              // console.log("Garrson is ", response.data)
              // Set the fetched data in state
            })
            .catch((error) => {
              // Handle errors, if any
              console.error("Error fetching data:", error);
            });


        })
        .catch((error) => {
          console.error('Error fetching vehicle data:', error);
        });

      //Arrival Time added

      axios.put(`https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatusWithZero/${arriveId}`)
        .then((response) => {
          console.log("data is ", response);
          axios
            .get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatusWithZero")
            .then((response) => {
              setOccurance_hold(response.data)
              // console.log("Garrson is ", response.data)
              // Set the fetched data in state
            })
            .catch((error) => {
              // Handle errors, if any
              console.error("Error fetching data:", error);
            });

        })
        .catch((error) => {
          console.error('Error fetching vehicle data:', error);
        });
    }

  }

  const transformString = (str) => {
    const result = str.replace(/([A-Z][a-zA-Záãéíóúç]+)([A-Z][a-zA-Záãéíóúç]+)/, '$2 $1');
    return result;
  };

  // console.log("garrison id is" , findgarrison);
  return (
    <div className='custom-container' >
      <div className="container">
        <div className="Dashboard_heading">
          <h3>Chegada da Gu na Ocorrencia</h3>
          <hr />
        </div>
        <div className="row full_hieght_2">
          <div className="col-md-8 col-sm-12  ">

            {
              loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress size={100} />
              </Box> :
                Occurance_hold.map((v, i) => {

                  const dateTime = new Date(v.Time);

                  const formattedTime = `${dateTime.getHours().toString().padStart(2, '0')}:${dateTime.getMinutes().toString().padStart(2, '0')}`;

                  return (


                    <div className="col-md-12 col-sm-12 my-3 occurance_holds row d-flex  ">


                      <input type="radio" name='11' id={v._id} onChange={handleInput} />


                      <div className="col-md-4 col-sm-12">
                        <h6 >Telefone : {v.phone} </h6>
                      </div>
                      <div className="col-md-4 col-sm-12">
                        <h6 >Solicitante : {v.Applicant} </h6>
                      </div>
                      <div className="col-md-4 col-sm-12">
                        <h6 >Numero da Ocorrencia: {v.occurance_Number} </h6>
                      </div>
                      <div className="col-md-4 col-sm-12 ml-md-3 ">
                        <h6 >Bonde : {v.Street} </h6>
                      </div>
                      <div className="col-md-4 col-sm-12">
                        <h6>Rua : {v.Street} </h6>
                      </div>
                      <div className="col-md-4 col-sm-12 ml-md-3 ">
                        <h6>Cód. Atendimento : {v.occurance_Code} </h6>
                      </div>
                      {/* <div className="col-md-6 col-sm-12">
                    <h6> Garnição deixando a cena: {v.Neighbourhood} </h6>
                  </div> */}
                      <div className="col-md-6 col-sm-12">
                        <h6> Hora de saída da guarnição:
                          {formattedTime}
                        </h6>
                      </div>
                    </div>
                  );
                })}
          </div>



          <div className="col-md-4 col-sm-12 my-3 " style={{ textAlign: "center" }}>
            <h3>Gu. empenhadas</h3>
            <div style={{ minHeight: "100px", backgroundColor: "#fff", borderRadius: "15px", textAlign: "center" }} className=''>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {
                  loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                    <CircularProgress size={60} />
                  </Box> :
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', marginBottom: '10px', marginTop: '10px', paddingBottom: '10px' }}>
                      {findgarrison.map((v, i) => {
                        return (
                          <div>
                            <input
                              disabled={v.disabled}
                              key={i}
                              id={v.id}
                              type="checkbox"
                              name="av_garison"
                              value={v.garissonName} // Adjust this to the correct property or index
                              onChange={handleChange}
                              style={{ marginRight: '8px', marginTop: '13px' }}
                            />{transformString(v.garissonName)}
                            {console.log(v.garissonName)}
                          </div>
                        );
                      })}
                    </div>
                }
              </div>

              {/* <h6 style={{marginTop:"10px"}}> {findgarrison[0]}</h6> */}
            </div>

            <div className="button mt-3 text-center">
              <a href='' type='submit' className="btn btn-primary" onClick={handleStatus} style={{ padding: "10px 120px", marginTop: "25px" }}>Chegado</a>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
export default ArrivalAtOccurence