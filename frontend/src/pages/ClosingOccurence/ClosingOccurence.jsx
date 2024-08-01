import axios, { Axios } from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import CircularProgress from '@mui/material/CircularProgress';
import './ClosingOccurence.css'
import {
  TextField,
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from '@mui/icons-material/Delete';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ClosingOccurence = () => {
  const [loading, setLoading] = useState(false)
  const [closingOccurences, setClosingOccurences] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [street, setStreet] = useState([])
  const [description, setDescription] = useState("");
  const [garison, setGarison] = useState([])
  const [savedOccurence, setsavedOccurence] = useState([])
  const [idForSaving, setIdForSaving] = useState("")
  const [formFields, setFormFields] = useState([{ id: 1, name: "", cpf: "", phone: "", cep: "", street: "", Neighborhood: "", City: "", person: "" }]);


  const handleFieldChange = (id, key, value) => {
    const updatedFields = formFields.map((field) =>
      field.id === id ? { ...field, [key]: value } : field
    );
    setFormFields(updatedFields);
    // calling zipcode(Street api )

    if (key === "phone") {
      console.log("phone called");
      console.log(id); // Assuming `id` identifies the object in formFields array

      axios.get(`https://srv496943145.host.ultaserver.net/getoccurencebyphonenumber/${value}`)
        .then((res) => {
          console.log("occ is ", res.data);

          if (res.data) {
            // Update the specific object in formFields array based on `id`
            setFormFields((prevFormFields) => {
              const updatedFormFields = prevFormFields.map((field) => {
                if (field.id === id) { // Assuming `id` is the identifier of the object
                  return {
                    ...field,
                    name: res.data.Applicant,
                    cpf: res.data.CPF,
                    phone: res.data.phone
                  };
                }
                return field; // Return unchanged object if `id` does not match
              });

              return updatedFormFields; // Return updated formFields array
            });
          }
        }).catch((err) => {
          console.log(err);
          // Handle error if needed
        });
    }


    if (key === "cep") {
      console.log("Street called");

      axios.get(`https://viacep.com.br/ws/${value}/json/`)
        .then((res) => {
          console.log("Response from ViaCEP:", res.data);

          if (res.data) {
            // Update the specific object in formFields array based on `id`
            setFormFields((prevFormFields) => {
              const updatedFormFields = prevFormFields.map((field) => {
                if (field.id === id) { // Assuming `id` is the identifier of the object
                  return {
                    ...field,
                    cep: res.data.cep,
                    street: res.data.logradouro,
                    Neighborhood: res.data.bairro,
                    City: res.data.localidade
                  };
                }
                return field; // Return unchanged object if `id` does not match
              });

              return updatedFormFields; // Return updated formFields array
            });
          }
        })
        .catch((err) => {
          console.log("Error fetching data from ViaCEP:", err);
          // Handle error if needed
          setOccurenceNumberSaved(null);
        });
    }
  };

  // Function to handle removing a form field
  const handleRemoveField = (id) => {
    if (id === 1) {
      console.log("Cannot delete primary field.");
      return;

      const updatedFields = formFields.filter((field) => field.id !== id);
      setFormFields(updatedFields);
    }

    const updatedFields = formFields.filter((field) => field.id !== id);
    setFormFields(updatedFields);
  };
  useEffect(() => {
    axios.get("https://srv496943145.host.ultaserver.net/getSaveOccurence")
      .then((res) => {
        // console.log("getSaveOccurence",res.data);
        setsavedOccurence(res.data)
      })
  }, [description])
  console.log("getSaveOccurence", savedOccurence);
  useEffect(() => {
    setLoading(true);
    axios
      .get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatusWithZeroAndTwo")
      .then((response) => {
        setClosingOccurences(response.data);
        console.log("data fetche is from newOcccurences  ", response.data);
        // Set the fetched data in state
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });

    axios
      .get("https://srv496943145.host.ultaserver.net/getGarrisonAll")
      .then((response) => {
        setGarssions(response.data);
        // console.log("Garrson finded are", response.data);
        // Set the fetched data in state
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });


    axios.get('https://srv496943145.host.ultaserver.net/newGarissonData')
      .then((response) => {
        setGarison(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching vehicle data:', error);
      });

    axios.get("https://srv496943145.host.ultaserver.net/getApplicants").then((response) => {
      setApplicants(response.data);
      console.log(response.data);
    });

    axios.get("https://srv496943145.host.ultaserver.net/getStreet").then((response) => {
      setStreet(response.data);
      console.log(response.data);
    })
      .finally(() => {
        setLoading(false)
      })


  }, []);

  const handleDeleteClick = (e) => {
    const go = checkCpf();

    if (go) {
      console.log('proceed')
    } else if (!go) {
      return false;
    }

    e.preventDefault();

    const { id, value } = e.target;
    let IdOfOccurence = id
    // console.log("handle delete called");


    axios.post("https://srv496943145.host.ultaserver.net/createreport", { IdOfOccurence, formFields, description })
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.log(err);
      })

    axios
      .put(`https://srv496943145.host.ultaserver.net/updataGarrisonToTrue/${id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching vehicle data:", error);
      });

    const token = localStorage.getItem("token");
    const ClosedBy = jwtDecode(token).username;

    axios.put(`https://srv496943145.host.ultaserver.net/occuranceclosed/${id}`, { ClosedBy })
      .then((response) => {
        console.log("data is ", response);
      })
      .catch((error) => {
        console.error('Error fetching vehicle data:', error);
      });


    axios
      .get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatusWithZeroAndTwo")
      .then((response) => {
        setClosingOccurences(response.data);
        console.log("data fetche is  ", response.data);
        // Set the fetched data in state
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });

    axios
      .put(`https://srv496943145.host.ultaserver.net/updataGarrisonStat`, {})
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching vehicle data:", error);
      });
    setFormFields([{ id: 1, name: "", cpf: "", cep: "", phone: "", street: "", Neighborhood: "", City: "", person: "" }]);
    axios
      .get("https://srv496943145.host.ultaserver.net/getnewoccuranceAllStatusWithZeroAndTwo")
      .then((response) => {
        setClosingOccurences(response.data);
        console.log("data fetche is  ", response.data);
        // Set the fetched data in state
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });
    handleCloseAndDelete();

  };
  const handleCloseAndDelete = () => {
    axios.delete(`https://srv496943145.host.ultaserver.net/saveOccurenceDelete/${idForSaving}`)
      .then((res) => {
        console.log("Occurence Deteted");
        setOpen(false);
        // setSelectedValue(""); // Reset selectedValue on dialog close
        setFormFields([{ id: 1, name: "", cpf: "", cep: "", phone: "", street: "", Neighborhood: "", City: "", person: "" }]);
        setDescription("")
      })

  }

  const showReport = (id) => {
    // Decode the JWT token to get the username
    const token = localStorage.getItem("token");
    const ReportCreatedBy = jwtDecode(token).username;
    console.log(ReportCreatedBy, id)
    axios.get(`https://srv496943145.host.ultaserver.net/view-pdf/new/${id}?ReportCreatedBy=${ReportCreatedBy}`, { responseType: 'text' })
      .then((response) => {
        // Open a new window and write the response HTML to it
        const newWindow = window.open();
        newWindow.document.write(response.data);
        newWindow.document.close();
      })
      .catch((error) => {
        console.error('Error creating or downloading PDF:', error);
      });
  };

  const [open, setOpen] = useState(false);
  // const [selectedValue, setSelectedValue] = useState("");

  const handleClickOpen = (e) => {
    const { id } = e.target
    console.log("id is", id);
    setIdForSaving(id)
    setOpen(true);
    // setSelectedValue(value || "");

    function checkOccurence(item) {
      return item.IdOfOccurence === id
    }
    const savedOccurences = savedOccurence.filter(checkOccurence)
    console.log("savedOccurences is this", savedOccurences);
    //  Check if any item in savedOccurences satisfies the checkOccurence condition
    const shouldIncludeInitialFormFields = savedOccurences.some(checkOccurence);
    console.log("shouldIncludeInitialFormFields", shouldIncludeInitialFormFields)

    const updatedFormFields = savedOccurences.reduce((acc, curr) => {
      if (curr.formFields) {
        acc.push(...curr.formFields);
      }
      return acc;
    }, shouldIncludeInitialFormFields ? [] : [...formFields]); // Start with initial formFields
    console.log("updatedFormFields is ", updatedFormFields);
    setFormFields(updatedFormFields);

    const updatedDescription = savedOccurences.reduce((acc, curr) => {
      if (curr.description) {
        acc += curr.description; // Concatenate description strings
      }
      return acc;
    }, shouldIncludeInitialFormFields ? "" : description);
    console.log(updatedDescription)
    setDescription(updatedDescription)

  };

  const checkCpf = () => {
    let allValid = true; // Assume all CPFs are valid initially

    formFields.forEach((item) => {
      const cpf = item.cpf;
      console.log(cpf);

      if (cpf.trim() === '') {
        allValid = true;
        return;
      }

      // Elimina CPFs inválidos conhecidos
      if (cpf.length !== 11 ||
        cpf === "00000000000" ||
        cpf === "11111111111" ||
        cpf === "22222222222" ||
        cpf === "33333333333" ||
        cpf === "44444444444" ||
        cpf === "55555555555" ||
        cpf === "66666666666" ||
        cpf === "77777777777" ||
        cpf === "88888888888" ||
        cpf === "99999999999") {
        alert("CPF inválido: Padrão de CPF inválido conhecido");
        allValid = false;
        return;
      }

      // Valida 1o dígito
      let add = 0;
      for (let i = 0; i < 9; i++) {
        add += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== parseInt(cpf.charAt(9))) {
        alert("CPF inválido: Primeiro dígito verificador está incorreto");
        allValid = false;
        return;
      }

      // Valida 2o dígito
      add = 0;
      for (let i = 0; i < 10; i++) {
        add += parseInt(cpf.charAt(i)) * (11 - i);
      }
      rev = 11 - (add % 11);
      if (rev === 10 || rev === 11) rev = 0;
      if (rev !== parseInt(cpf.charAt(10))) {
        alert("CPF inválido: Segundo dígito verificador está incorreto");
        allValid = false;
        return;
      }
    });

    return allValid; // Return the overall validation status
  };

  const handleClose = (event, reason) => {
    const IdOfOccurence = event.target.id
    console.log("event.target.id handleclose", IdOfOccurence);
    console.log("idForSaving :", idForSaving)
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      console.log("escapeKeyDown & backdropClick");
      console.log("saveOccurence", { formFields });
      axios.put(`https://srv496943145.host.ultaserver.net/saveOccurence/${idForSaving}`, { formFields, description })
        .then((res) => {
          console.log(res)
          setOpen(false);
          // setSelectedValue(""); // Reset selectedValue on dialog close
          setFormFields([{ id: 1, name: "", cpf: "", cep: "", phone: "", street: "", Neighborhood: "", City: "", person: "" }]);
          setDescription("")
        })
        .catch((err) => {
          console.log(err);
        })

    }

  };


  // Function to handle adding new form fields
  const handleAddField = () => {
    const newId = formFields.length + 1;
    const newField = { id: newId, name: "", cpf: "", cep: "", phone: "", street: "", Neighborhood: "", City: "", person: "" };
    setFormFields([...formFields, newField]);
  };
  console.log("formfeild are ", formFields);



  const onActive = (id) => {
    console.log("Active Id", id)

    axios.put(`https://srv496943145.host.ultaserver.net/newGarisonActive/${id}`).then((response) => console.log(response))

    axios.get('https://srv496943145.host.ultaserver.net/newGarissonData').then((response) => {
      setGarison(response.data);
    })
    //  console.log("getnewgarssiondata stats api working");


  }
  const onInActive = (id) => {

    // Update vehicle and staff data
    axios.put(`https://srv496943145.host.ultaserver.net/newGarisonInActive/${id}`).then((response) => console.log(response))
    axios.get('https://srv496943145.host.ultaserver.net/newGarissonData').then((response) => {
      setGarison(response.data);
    })

  }

  const transformString = (str) => {
    const result = str.replace(/([A-Z][a-zA-Záãéíóúç]+)([A-Z][a-zA-Záãéíóúç]+)/, '$2 $1');
    return result;
  };


  return (
    <div className="custom-container">
      <div className="container">
        <div className="Dashboard_heading">
          <h3>Ocorrências Abertas</h3>
          <hr />
        </div>
        <div className="row">
          <div className="col-md-12 col-sm-12 ">
            {
              loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress size={100} />
              </Box> :
                closingOccurences.map((v, i) => {
                  console.log("inside clossing occurence", v.av_garison[0].garissonName)

                  const dateTimeArrival = new Date(v.Arrivaltime);

                  const formattedTimeArrival = `${dateTimeArrival
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${dateTimeArrival
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`;

                  const dateTimeDispatch = new Date(v.Time);

                  const formattedTimeDispatch = `${dateTimeDispatch
                    .getHours()
                    .toString()
                    .padStart(2, "0")}:${dateTimeDispatch
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`;

                  const Diiference_Total_Millisencond =
                    (dateTimeArrival - dateTimeDispatch) / 1000;

                  var hours = Math.floor(Diiference_Total_Millisencond / 3600);
                  var remainingSeconds = Diiference_Total_Millisencond % 3600;
                  var minutes = Math.floor(remainingSeconds / 60);
                  var TimeDifference = hours + ":" + minutes;

                  return (
                    <div className="col-md-12 col-sm-12 my-3 occurancea_holds row">
                      <div className="col-md-10 row">
                        <div className="cont" style={{ display: 'flex', flexWrap: 'wrap', minWidth: '100%' }}>
                          <div className="col-md-3 col-sm-12" style={{ minWidth: 'fit-content' }}>
                            <h6>Nome: {v.Applicant}</h6>
                          </div>
                          <div className="col-md-3 col-sm-12 example-class" style={{ minWidth: 'fit-content' }}>
                            <h6>Telefone: {v.phone}</h6>
                          </div>
                          <div className="col-md-3 col-sm-12 example-class" style={{ minWidth: 'fit-content' }}>
                            <h6>Rua: {v.Street} </h6>
                          </div>
                          <div className="col-md-3 col-sm-12 example-class" style={{ minWidth: 'fit-content' }}>
                            <h6>Cód. Atendimento: {v.occurance_Code} </h6>
                          </div>
                        </div>
                        <div className="cont take_up" style={{ display: 'flex', flexWrap: 'wrap', minWidth: '100%' }}>
                          <div className="col-md-3 col-sm-12 example-class" style={{ minWidth: 'fit-content' }}>
                            <h6>Bairro: {v.Neighbourhood} </h6>
                          </div>
                          <div className="col-md-3 col-sm-12 example-class" style={{ minWidth: 'fit-content' }}>
                            <h6>Número de ocorrência: {v.occurance_Number.toString().padStart(4, '0')} </h6>
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-12 gu_list example-class take_up take_left">
                          <br />
                          <h6> Gu Lista : </h6>

                          <div class="card full_width">
                            <div class="card-body">
                              {v.av_garison.map((item) => {


                                const dateTimeArrival = new Date(item.ArrivalTime);

                                const formattedTimeArrival = `${dateTimeArrival.getHours().toString().padStart(2, '0')}:${dateTimeArrival.getMinutes().toString().padStart(2, '0')}`;

                                const dateTimeDispatch = new Date(item.DispachTime);

                                const formattedTimeDispatch = `${dateTimeDispatch.getHours().toString().padStart(2, '0')}:${dateTimeDispatch.getMinutes().toString().padStart(2, '0')}`;

                                const Diiference_Total_Millisencond = (dateTimeArrival - dateTimeDispatch) / 1000


                                let hours = Math.floor(Diiference_Total_Millisencond / 3600);
                                let remainingSeconds = Diiference_Total_Millisencond % 3600;
                                let minutes = Math.floor(remainingSeconds / 60);
                                let TimeDifference = hours + ":" + minutes


                                return (
                                  <div class="card">
                                    <div class="card-body">
                                      {garison.length > 0 && garison.map((v, i) => {
                                        return (
                                          <div>
                                            {
                                              v.Status == true ? (v._id) == item.garissonId ? (
                                                <span style={{ color: 'green', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontWeight: 'bold' }}>
                                                  <span >Guarnição:  {transformString(item.garissonName)}</span>

                                                </span>) : ""
                                                :
                                                (v._id) == item.garissonId ? (<span style={{ color: 'red' }}>
                                                  <span style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontWeight: 'bold' }}>
                                                    <span >Guarnição:  {transformString(item.garissonName)}</span>
                                                    <button className="btn btn=primary" onClick={() => { onActive(v._id) }} style={{
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
                                                  </span>
                                                </span>) : ""
                                            }
                                          </div>
                                        )
                                      })}

                                      <br />
                                      <span>Hora saida: {formattedTimeDispatch}</span>
                                      <br />
                                      <span>Hora chegada: {formattedTimeArrival}</span>
                                      <br />
                                      <span>Hora empenhada: {TimeDifference}</span>
                                      <br />
                                    </div>
                                  </div>)
                              }
                              )}
                            </div>
                          </div>

                        </div>
                      </div>

                      <Dialog
                        open={open}
                        fullWidth="true"
                        maxWidth="xl"
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleClose}
                        aria-describedby="alert-dialog-slide-description"

                      > <div className="div vertical_disp" style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '18px' }}>
                          <DialogTitle>
                            {`Encerramento da ocorrênca numero :`} {v.occurance_Number.toString().padStart(4, '0')}
                          </DialogTitle>

                          {/* Maaz Update: I have added this button for to show details */}
                          <button className="button-width"
                            style={{
                              padding: '10px 20px',
                              backgroundColor: '#007bff',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '1rem',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                              transition: 'background-color 0.3s',
                              marginTop: '10px', // Adjust margin-top to create space between buttons
                            }}
                            onClick={() => { showReport(v._id) }}
                          >
                            Detalhes
                          </button>

                        </div>
                        <DialogContent>


                          {formFields.map((field) => (
                            <div key={field.id}>
                              <Box className="vertical_disp">
                                <Autocomplete
                                  disablePortal
                                  id={`phone-${field.id}`}
                                  options={closingOccurences.map((item) => item.phone)}
                                  isOptionEqualToValue={(option, value) => option.id === value.id}
                                  value={field.phone}
                                  onChange={(event, newValue) =>
                                    handleFieldChange(field.id, "phone", newValue || "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      required
                                      {...params}
                                      label="Select telefone"
                                      onChange={(e) =>
                                        handleFieldChange(field.id, "phone", e.target.value)
                                      }
                                      value={field.phone}
                                      sx={{
                                        width: 170,
                                        margin: "10px auto",
                                      }}
                                    />
                                  )}
                                />

                                <Autocomplete
                                  disablePortal
                                  id={`cpf-${field.id}`}
                                  options={applicants.map((item) => item.CPF)}
                                  // isOptionEqualToValue={(option, value) => option.id === value.id}
                                  value={field.cpf}
                                  onChange={(event, newValue) =>
                                    handleFieldChange(field.id, "cpf", newValue || "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      required
                                      {...params}
                                      label="Select CPF"
                                      onChange={(e) =>
                                        handleFieldChange(field.id, "cpf", e.target.value)
                                      }
                                      value={field.cpf}
                                      sx={{
                                        width: 170,
                                        margin: "10px auto",
                                      }}
                                    />
                                  )}
                                />
                                <Autocomplete
                                  disablePortal
                                  id={`name-${field.id}`}
                                  options={applicants.map((item) => item.Name)}
                                  isOptionEqualToValue={(option, value) => option.id === value.id}
                                  value={field.name}
                                  onChange={(event, newValue) =>
                                    handleFieldChange(field.id, "name", newValue || "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      required
                                      label="Select Nome"
                                      onChange={(e) =>
                                        handleFieldChange(field.id, "name", e.target.value)
                                      }
                                      value={field.name}
                                      sx={{
                                        width: 170,
                                        margin: "10px auto",
                                      }}
                                    />
                                  )}
                                />
                                <Box
                                  component="form"
                                  sx={{
                                    '& > :not(style)': { width: '25ch' },
                                  }}
                                  noValidate
                                  autoComplete="off"
                                >
                                  <TextField
                                    required
                                    // {...params}
                                    id={`cep-${field.id}`}
                                    label="Select CEP"
                                    onChange={(e) =>
                                      handleFieldChange(field.id, "cep", e.target.value)
                                    }
                                    value={field.cep}
                                    sx={{
                                      width: 200,
                                      margin: "10px auto",
                                    }}
                                  />
                                </Box>
                                {/* )}  */}
                                {/* />  */}



                                {/* Street data */}
                                <Autocomplete
                                  disablePortal
                                  id={`street-${field.id}`}
                                  options={street.map((item) => item.Stret)}
                                  isOptionEqualToValue={(option, value) => option.id === value.id}
                                  value={field.street}
                                  onChange={(event, newValue) =>
                                    handleFieldChange(field.id, "street", newValue || "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      required
                                      {...params}
                                      label="Select Rua"
                                      onChange={(e) =>
                                        handleFieldChange(field.id, "street", e.target.value)
                                      }
                                      value={field.street}
                                      sx={{
                                        width: 170,
                                        margin: "10px auto",
                                      }}
                                    />
                                  )}
                                />
                                <Autocomplete
                                  disablePortal
                                  id={`Neighborhood-${field.id}`}
                                  options={street.map((item) => item.Neigbourhood)}
                                  isOptionEqualToValue={(option, value) => option.id === value.id}
                                  value={field.Neighborhood}
                                  onChange={(event, newValue) =>
                                    handleFieldChange(field.id, "Neighborhood", newValue || "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      required
                                      {...params}
                                      label="Select Bairro"
                                      onChange={(e) =>
                                        handleFieldChange(field.id, "Neighborhood", e.target.value)
                                      }
                                      value={field.Neighborhood}
                                      sx={{
                                        width: 170,
                                        margin: "10px auto",
                                      }}
                                    />
                                  )}
                                />

                                <Autocomplete
                                  disablePortal
                                  id={`City-${field.id}`}
                                  options={street.map((item) => item.City)}
                                  isOptionEqualToValue={(option, value) => option.id === value.id}
                                  value={field.City}
                                  onChange={(event, newValue) =>
                                    handleFieldChange(field.id, "City", newValue || "")
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      required
                                      {...params}
                                      label="Select Cidade"
                                      onChange={(e) =>
                                        handleFieldChange(field.id, "City", e.target.value)
                                      }
                                      value={field.City}
                                      sx={{
                                        width: 200,
                                        margin: "10px auto",
                                      }}
                                    />
                                  )}
                                />

                                <Box sx={{ minWidth: 100, width: 200, marginTop: 1 }}>
                                  <FormControl fullWidth>
                                    <InputLabel id={`person-label-${field.id}`}>Pessoa</InputLabel>
                                    <Select
                                      required
                                      labelId={`person-label-${field.id}`}
                                      id={`person-${field.id}`}
                                      value={field.person}
                                      onChange={(event) =>
                                        handleFieldChange(field.id, "person", event.target.value)
                                      }
                                    >
                                      <MenuItem value={`Victim`}>Victim</MenuItem>
                                      <MenuItem value={`Author`}>Author</MenuItem>
                                      <MenuItem value={`Witness`}>Witenss</MenuItem>
                                      <MenuItem value={`Other`}>Other</MenuItem>
                                    </Select>
                                  </FormControl>
                                </Box>
                                <Box sx={{ margin: 2, marginRight: 2, paddingRight: 2 }}>
                                  <PersonAddIcon className="vertical-space"
                                    sx={{ cursor: "pointer", marginLeft: 2 }}
                                    onClick={() => handleAddField()}
                                  />
                                  <DeleteIcon className="vertical-space"
                                    sx={{ cursor: "pointer", marginLeft: 2 }}
                                    onClick={() => handleRemoveField(field.id)}
                                  />
                                </Box>
                              </Box>
                            </div>
                          ))}

                          <Box sx={{ minWidth: 150, marginTop: 2 }}>
                            <FormControl fullWidth>
                              {/* <InputLabel id="demo-simple-select-label">
                            Address
                          </InputLabel> */}
                              <TextField
                                id="outlined-read-only-input"
                                label="local da ocorrencia"
                                InputProps={{
                                  readOnly: true,
                                }}
                                defaultValue={
                                  v.Street + " " + v.Neighbourhood + " " + v.City
                                }
                              />
                            </FormControl>
                          </Box>

                          <Box sx={{ minWidth: 150, marginTop: 2 }}>
                            <FormControl fullWidth>
                              <textarea
                                id="outlined"
                                label="descrição do factos"
                                value={description}
                                onChange={(ev) => setDescription(ev.target.value)}
                                style={{ minHeight: '70px', padding: '10px' }}
                              />
                            </FormControl>
                          </Box>
                        </DialogContent>
                        <DialogActions>
                          <Button id={v._id} onClick={handleClose}>Discordo</Button>
                          <Button
                            av_garison={v.av_garison}
                            value={v.Street + " " + v.Neighbourhood + " " + v.City}
                            id={v._id}
                            onClick={handleDeleteClick}
                          >
                            Concordo
                          </Button>
                        </DialogActions>
                      </Dialog>

                      <div className="col-md-2 deltbtn" style={{ display: 'flex', alignItems: 'center' }}>
                        <a
                          href="#"
                          id={v._id}
                          onClick={handleClickOpen}
                          className="btn btn-danger"
                          style={{ padding: "24px 24px" }}
                        >
                          <span id={v._id}
                            onClick={(e) => e.currentTarget.parentNode.click()}
                            className="font-weight-bold fs-6"
                            style={{ fontSize: "2rem" }}
                          >Fechar</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClosingOccurence;
