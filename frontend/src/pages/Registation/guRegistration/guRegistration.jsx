import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './guRegistration.scss';

const GuRegistration = () => {
  const [staff, setStaff] = useState([]);
  const [vehicle, setVehicle] = useState([]);
  const [garison, setGarison] = useState([]);
  const [vechicleId, setvehicleId] = useState()
  const [staffIds, setStaffIds] = useState([])
  const [avGarrison, setAvGarssion] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState('');





  const [post, setPost] = useState({
    StaffName: '',
    VehcleName: '',
    Av_garison: "",
    Status: true
  });

  useEffect(() => {
    axios.get('http://localhost:3000/getStaffStatus')
      .then((response) => {
        setStaff(response.data);
      })
      .catch((error) => {
        console.error('Error fetching staff data:', error);
      });

    axios.get('http://localhost:3000/getVehcleStatus')
      .then((response) => {
        setVehicle(response.data);
      })
      .catch((error) => {
        console.error('Error fetching vehicle data:', error);
      });


    axios.get('http://localhost:3000/newGarissonData')
      .then((response) => {
        setGarison(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching vehicle data:', error);
      });


  }, []);

  const vehicleHandleChange = (event) => {

    const { name, value, id } = event.target;
    console.log(id)
    setvehicleId(id)
    setSelectedVehicle(value);
    setPost((prevState) => ({
      ...prevState,
      [name]: value,

    }));

    setAvGarssion((prevState) => [...prevState, value]);


  };



  // const staffHandleChange = (event) => {
  //   // const { name, value ,id} = event.target;
  //   const {id} = event.target;
  //   // setStaffId(prevIds => [...prevIds, id]);
  //   // console.log(staffId);

  //   if (!staffId.includes(id)) {
  //     // If not present, update the state array
  //     setStaffId(prevIds => [...prevIds, id]);
  // }
  // console.log(staffId)

  //   // setStaffId(...id)
  //   // setPost((prevState) => ({
  //   //   ...prevState,
  //   //   [name]: value,

  //   // }));
  // };

  const staffHandleChange = (event) => {

    const { id, checked, name, value } = event.target;

    setPost((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setAvGarssion((prevState) => [...prevState, checked ? value : '']);



    if (checked && !staffIds.includes(id)) {
      // If checkbox is checked and ID is not already in staffId, add it
      setStaffIds(prevIds => [...prevIds, id]);

    } else if (!checked && staffIds.includes(id)) {
      // If checkbox is unchecked and ID is in staffId, remove it
      setStaffIds(prevIds => prevIds.filter(item => item !== id));
    }

    setSelectedStaff(checked ? value : '');
  };

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(e.isPropagationStopped());
    console.log("delete clicked")
    if (garison.length > 0) {


      axios.delete('http://localhost:3000/deleteGarrisonStatus')
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.error('Error submitting data:', err);
        });


      axios.put('http://localhost:3000/statustrueStaff')
        .then((response) => {
          // console.log(dispatch, response.data)
        })
        .catch((error) => {
          console.error('Error fetching vehicle data:', error);
        });

      axios.put('http://localhost:3000/statustrueVehcle')
        .then((response) => {
          // console.log(dispatch, response.data)
        })
        .catch((error) => {
          console.error('Error fetching vehicle data:', error);
        });


      //rendering

      axios.get('http://localhost:3000/getStaffStatus')
        .then((response) => {
          setStaff(response.data);
        })
        .catch((error) => {
          console.error('Error fetching staff data:', error);
        });

      axios.get('http://localhost:3000/getVehcleStatus')
        .then((response) => {
          setVehicle(response.data);
        })
        .catch((error) => {
          console.error('Error fetching vehicle data:', error);
        });


      axios.get('http://localhost:3000/newGarissonData')
        .then((response) => {
          setGarison(response.data);
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error fetching vehicle data:', error);
        });




    }

  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit clicked");
    let GarisonLastelementIndex = avGarrison.length - 1
    let ToString = avGarrison[0] + avGarrison[GarisonLastelementIndex]
    console.log("avgarison is ", ToString);

    if (!selectedVehicle) {
      // alert('Selecione um veículo.');
      return;
    }

    if (!selectedStaff) {
      // alert('Selecione um membro da equipe.');
      return;
    }

    try {
      // Submit new garisson data

      const postData = { ...post, Status: true, Av_garison: ToString };
      await axios.post('http://localhost:3000/newGarisson', postData);
      console.log("post api working");

      setSelectedVehicle(null);
      setSelectedStaff('');
      setStaffIds([]);

      // Clear post data after submission
      setPost({
        StaffName: '',
        VehcleName: '',
        Av_garison: '',
        Status: null
      });
      console.log("post data cleared");

      // Clear radio button selection
      const radioButtons = document.querySelectorAll('input[type="radio"]');
      radioButtons.forEach(button => {
        button.checked = false;
      });

      // Clear checkbox selection
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });

      // Update vehicle and staff data
      const updateVehicleResponse = await axios.put(`http://localhost:3000/updateVehicle/${vechicleId}`);
      console.log(updateVehicleResponse);
      console.log("update vehicle api working");

      const updateStaffResponse = await axios.put('http://localhost:3000/updateStaff', { dataArray: staffIds });
      console.log(updateStaffResponse);
      console.log("update staff api working");

      // Fetch updated garisson data
      // const garissonResponse = await axios.get('http://localhost:3000/newGarissonData');
      // setGarison(garissonResponse.data);
      // console.log("New garission data api working");

      // Fetch updated vehicle and staff status
      const vehicleResponse = await axios.get('http://localhost:3000/getVehcleStatus');
      setVehicle(vehicleResponse.data);
      console.log("getVehicle stats api working");

      const staffResponse = await axios.get('http://localhost:3000/getStaffStatus');
      setStaff(staffResponse.data);
      console.log("getstaff stats api working");

      // Fetch updated garisson data again
      const updatedGarissonResponse = await axios.get('http://localhost:3000/newGarissonData');
      setGarison(updatedGarissonResponse.data);
      console.log("getnewgarssiondata stats api working");

      console.log('All API calls completed successfully.');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors as needed
    }

    setPost({
      StaffName: '',
      VehcleName: '',
      Av_garison: '',
      Status: null
    });
  };


  const onActive = (id) => {
    console.log("Active Id", id)

    axios.put(`http://localhost:3000/newGarisonActive/${id}`).then((response) => console.log(response))

    axios.get('http://localhost:3000/newGarissonData').then((response) => {
      setGarison(response.data);
    })
    //  console.log("getnewgarssiondata stats api working");


  }
  const onInActive = (id) => {

    // Update vehicle and staff data
    axios.put(`http://localhost:3000/newGarisonInActive/${id}`).then((response) => console.log(response))
    axios.get('http://localhost:3000/newGarissonData').then((response) => {
      setGarison(response.data);
    })

  }

  return (
    <div className="custom-container">
      <div className="container">
        <div className="Dashboard_heading">
          <h3>Registro da guarnição</h3>
          <hr />
        </div>
        <form onSubmit={handleSubmit}>
          <div >
            <div className="gu-layout">
              <div className="cars my-5 div-child" style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <h3 className="">Carro</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    {vehicle.map((v, i) => (
                      <div className='d-flex justify-content-start' key={i} >
                        <input type="radio" id={v._id} name="VehcleName" value={v.Model} onChange={vehicleHandleChange}
                        // onClick={(e) =>{console.log(e.target)}}
                        />
                        <label htmlFor={`vehcle${i}`} className="ml-2">{v.Brand}&nbsp; {v.Model}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className=" pl-3 guards my-5 div-child" style={{ display: 'flex', justifyContent: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                  <h3 className="text-center">Guarda</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}>
                    {staff.map((s, i) => (
                      <div key={i}>
                        <input type="checkbox" id={s._id} name="StaffName" value={s.Name} onChange={staffHandleChange} />
                        <label htmlFor={`staff${i}`} className="ml-2">{s.Name}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              <div className=" guards my-5 margin-gus" style={{ display: 'flex', justifyContent: 'start', paddingLeft: '25px', paddingRight: '25px' }}>
                <div>
                  <h3 className="text-center">Guarnição Disponível</h3>
                  <ul style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    {garison.length > 0 && garison.map((v, i) => {
                      return (
                        <>
                          {
                            v.Status == true ?
                              <li style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
                                <div style={{ fontWeight: 'bold' }}>
                                  {v.StaffName + ' ' + v.VehcleName}
                                </div>
                              </li>
                              :
                              <li style={{ color: 'red', display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'space-between' }}>
                                <div style={{ fontWeight: 'bold' }}>
                                  {v.StaffName + ' ' + v.VehcleName}
                                </div>
                                <div>
                                  <button class="btn btn=primary" onClick={() => { onActive(v._id) }} style={{
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    paddingLeft: '35px',
                                    paddingRight: '35px',
                                    paddingTop: '4px',
                                    paddingBottom: '4px',
                                    borderRadius: '3px',
                                    borderColor: '#007bff',
                                    outlineColor: '#007bff',
                                    marginRight: '20px'
                                  }}>Liberar</button>
                                </div>
                              </li>
                          }
                        </>
                      )
                    })}
                  </ul>
                </div>
              </div>

            </div>

            <div className='GuRegistration-btn'>
              <button type="submit" className="btn btn-primary my-5 py-2 px-5 ml-3">Atribuir</button>
              {/* <button type="submit" className="btn btn-primary my-5 py-2 px-5 ml-3" onClick={(e) => handleDelete(e)}>Delete All</button> */}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuRegistration;
