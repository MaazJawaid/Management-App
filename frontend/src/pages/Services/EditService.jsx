import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from 'jwt-decode'
import './style.css'


const EditService = () => {
    const [submitStatus, setSubmitStatus] = useState(null);
    const [data, setData] = useState(0);
    const [countOcc, setcountOcc] = useState(0);
    const [Garrison, setNewGarrison] = useState([]);
    const [GarrisonId, setGarrsionId] = useState('');
    const [GarrisonValue, setGarrsionValue] = useState([]);
    const [GarrisonIdFalse, setGarrsionIdFalse] = useState([]);
    const [StaffIds, setStaffIds] = useState([]);
    const [checkedBoxes, setCheckedBoxes] = useState({}); // State to keep track of checked checkboxes
    const [OccurenceNumberSaved, setOccurenceNumberSaved] = useState(0);
    const [OccurenceIdForUpdate, setOccurenceIdForUpdate] = useState("");
    const checkboxRef = useRef(null);

    const location = useLocation();
    const initialPhone = location.state?.phone || "";

    function getformValues() {
        return {
            phone: "",
            Applicant: "",
            Street: "",
            CPF: "",
            CEP: "",
            Neighbourhood: "",
            City: "",
            Reference: "",
            Description: "",
            Request: "",
            av_garison: [],
            occurance_Code: 0,
            occurance_Number: 0,
            Time: "",
            ArrivalTime: "",
            MadeBy: "",
        }
    }

    const [post, setPost] = useState(getformValues);

    useEffect(() => {
        console.log('running')
        setPost(prevPost => ({
            ...prevPost,
            phone: initialPhone
        }));

        const inititialize = async () => {
            await axios.get(`http://localhost:3000/getoccurencebyphonenumber/${initialPhone}`)
                .then((res) => {
                    setOccurenceNumberSaved(res.data.occurance_Number)
                    setOccurenceIdForUpdate(res.data._id)
                    console.log(res.data, 'abaha')

                    if (res.data) {
                        setPost((prevState) => ({
                            ...prevState,
                            occurance_Code: res.data.occurance_Code,
                            CPF: res.data.CPF,
                            CEP: res.data.CEP,
                            Description: res.data.Description,
                            Request: res.data.Request,
                            Reference: res.data.Reference,
                            Applicant: res.data.Applicant,
                            Street: res.data.Street,
                            Neighbourhood: res.data.Neighbourhood,
                            City: res.data.City,
                        }));
                    }
                }).catch((err) => {
                    setOccurenceNumberSaved(null)
                    setPost((prevState) => ({
                        ...prevState,
                        occurance_Code: "",
                        CEP: "",
                        CPF: "",
                        Description: "",
                        Request: "",
                        Reference: "",
                        Applicant: "",
                        Street: "",
                        Neighbourhood: "",
                        City: "",
                    }));
                })
        }
        inititialize()
    }, []);


    useEffect(() => {
        localStorage.setItem("data2", JSON.stringify(post))
    }, [post])


    // Function to save checkbox state to local storage
    const saveCheckedBoxesToLocalStorage = (checkedBoxes) => {
        localStorage.setItem("checkedBoxes2", JSON.stringify(checkedBoxes));
    };

    // Function to load checkbox state from local storage
    const loadCheckedBoxesFromLocalStorage = () => {
        const storedCheckedBoxes = JSON.parse(localStorage.getItem("checkedBoxes2"));
        if (storedCheckedBoxes) {
            setCheckedBoxes(storedCheckedBoxes);
        }
    };

    useEffect(() => {
        loadCheckedBoxesFromLocalStorage(); // Load checkbox state from local storage on component mount
    }, []);

    useEffect(() => {
        // Fetch data when the component mounts
        axios
            .get("http://localhost:3000/getoccurance")
            .then((response) => {
                // Set the fetched data in state
                setData(response.data);
                console.log(response.data.Code);
            })
            .catch((error) => {
                // Handle errors, if any
                console.error("Error fetching data:", error);
            });

        axios
            .get("http://localhost:3000/getnewoccurance")
            .then((response) => {
                // Set the fetched data in state
                setcountOcc(response.data);
                console.log("Code", response.occurance_Code);
                console.log("Number", response.occurance_Number);
            })
            .catch((error) => {
                // Handle errors, if any
                console.error("Error fetching data:", error);
            });

        axios
            .get("http://localhost:3000/getGarrison")
            .then((response) => {
                setNewGarrison(response.data)
                console.log("Garrson", response.data)
                // Set the fetched data in state


            })
            .catch((error) => {
                // Handle errors, if any
                console.error("Error fetching data:", error);
            });


        axios
            .get("http://localhost:3000/getGarrisonFalse")
            .then((response) => {
                setGarrsionIdFalse(response.data)
                console.log("GarrsonFalse", response.data)
                // Set the fetched data in state


            })
            .catch((error) => {
                // Handle errors, if any
                console.error("Error fetching data:", error);
            });


    }, []);

    const handleInput = (event) => {
        const { id, checked, name, value, type } = event.target;

        // Update GarrisonId based on the checked checkbox

        if (checked && !StaffIds.includes(id)) {
            // If checkbox is checked and ID is not already in staffId, add it
            setStaffIds(prevIds => [...prevIds, id]);

        } else if (!checked && StaffIds.includes(id)) {
            // If checkbox is unchecked and ID is in staffId, remove it
            setStaffIds(prevIds => prevIds.filter(item => item !== id));
        }
        if (type === "checkbox") {

            setCheckedBoxes({ ...checkedBoxes, [id]: checked }); // Update checkbox state
            saveCheckedBoxesToLocalStorage({ ...checkedBoxes, [id]: checked }); // Save checkbox state to local storage
        }

        if (checked) {
            setGarrsionId(id);
        } else if (id === GarrisonId) {
            setGarrsionId(''); // Unset GarrisonId if the checkbox is unchecked
        }
        if (checked && name === "Status") localStorage.removeItem("checkedBoxes2")


        if (checked && name !== "Status") {
            console.log("fisrt call ");
            let obj = {
                id: uuidv4(),
                "garissonName": value,
                garissonId: id,
                DispachTime: new Date(),
                ArrivalTime: "Notarrived",
                disabled: false
            }
            setGarrsionValue((prevValues) => [...prevValues, obj]);
        } else {
            console.log("second call ");
            setGarrsionValue((prevValues) => prevValues.filter((item) => item.garissonName !== value));
        }

        // calling coocurence for autofilling( api )
        // if (name === "phone") {
        //     axios.get(`http://localhost:3000/getoccurencebyphonenumber/${value}`)
        //         .then((res) => {
        //             console.log("occ is ", res);
        //             console.log("occurence number is s", res.data.occurance_Number)
        //             setOccurenceNumberSaved(res.data.occurance_Number)
        //             setOccurenceIdForUpdate(res.data._id)

        //             if (res.data) {
        //                 setPost((prevState) => ({
        //                     ...prevState,
        //                     occurance_Code: res.data.occurance_Code,
        //                     CPF: res.data.CPF,
        //                     CEP: res.data.CEP,
        //                     Description: res.data.Description,
        //                     Request: res.data.Request,
        //                     Reference: res.data.Reference,
        //                     Applicant: res.data.Applicant,
        //                     Street: res.data.Street,
        //                     Neighbourhood: res.data.Neighbourhood,
        //                     City: res.data.City,
        //                 }));
        //             }
        //         }).catch((err) => {
        //             setOccurenceNumberSaved(null)
        //             setPost((prevState) => ({
        //                 ...prevState,
        //                 occurance_Code: "",
        //                 CEP: "",
        //                 CPF: "",
        //                 Description: "",
        //                 Request: "",
        //                 Reference: "",
        //                 Applicant: "",
        //                 Street: "",
        //                 Neighbourhood: "",
        //                 City: "",
        //             }));
        //         })
        // }


        // calling zipcode(Street api )
        if (name === "CEP") {
            axios.get(`https://viacep.com.br/ws/${value}/json/`)
                .then((res) => {
                    console.log("res.data", res.data)
                    if (res.data) {
                        setPost((prevState) => ({
                            ...prevState,
                            Street: res.data.logradouro,
                            Neighbourhood: res.data.bairro,
                            City: res.data.localidade
                        }));
                    }
                }).catch((err) => {
                    setPost((prevState) => ({
                        ...prevState,
                        Street: "",
                        Neighbourhood: "",
                        City: ""
                    }));
                })
        }

        setPost((prevState) => ({
            ...prevState,
            [name]: value,
            av_garison: checked && name !== "Status" ? [...GarrisonValue, { id: uuidv4(), garissonName: value, DispachTime: new Date(), ArrivalTime: "Notarrived", garissonId: id, disabled: false }] : (name === "Status" && checked ? [] : GarrisonValue.filter((item) => item.garissonName !== value)),
            Status: checked && name !== "Status" ? "0" : "1",
            occurance_Number: OccurenceNumberSaved ? OccurenceNumberSaved : countOcc
        }));

        if (id === "vehicle3" && checked) {
            // Disable Garrison radio buttons
            setNewGarrison(Garrison.map(item => ({ ...item, disabled: true })));
        } else if (name === "av_garison") {
            // If a Garrison radio button is checked
            // Enable all Garrison radio buttons
            setNewGarrison(Garrison.map(item => ({ ...item, disabled: false })));
        } if (id === "vehicle3" && !checked) {
            // Disable Garrison radio buttons
            setNewGarrison(Garrison.map(item => ({ ...item, disabled: false })));
        }
        console.log("garisson consolled ", Garrison)
    };

    console.log("valueGarisoin is ", GarrisonValue)
    console.log("post value is ", post)

    console.log([post])



    const handleChange = (event) => {
        const { name, value } = event.target;


        setPost((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        const saved = localStorage.getItem("data2");

        const initialValue = JSON.parse(saved);
        console.log(initialValue);
        return initialValue || "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        function validCPF(cpf) {
            cpf = cpf.replace(/[^\d]+/g, '');
            if (cpf === '') {
                alert("O CPF está vazio.");
                return false;
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
                return false;
            }

            // Valida 1o dígito
            let add = 0;
            for (let i = 0; i < 9; i++) {
                add += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let rev = 11 - (add % 11);
            if (rev === 10 || rev === 11) rev = 0;
            if (rev !== parseInt(cpf.charAt(9))) {
                alert("CPF inválido");
                return false;
            }

            // Valida 2o dígito
            add = 0;
            for (let i = 0; i < 10; i++) {
                add += parseInt(cpf.charAt(i)) * (11 - i);
            }
            rev = 11 - (add % 11);
            if (rev === 10 || rev === 11) rev = 0;
            if (rev !== parseInt(cpf.charAt(10))) {
                alert("CPF inválido");
                return false;
            }

            return true;
        }

        if (post.CPF.trim() === '') {
            console.log('empty')
        } else {
            if (!validCPF(post.CPF)) {
                return false;
            }
        }

        const checkifgarissonSelectedornot = (av_garison) => {
            if (av_garison.length === 0) {
                alert("Selecione a guarnição ou coloque em espera");
                return false;
            }
            return true;
        }

        try {
            const token = localStorage.getItem("token")
            const MadeBy = jwtDecode(token).username

            const responsePost = await axios.post("http://localhost:3000/newOccurance", { ...post, MadeBy });
            console.log(responsePost);

            if (StaffIds.length !== 0) {
                console.log("Callled");
                const updateStaffResponse = await axios.put('http://localhost:3000/updateGarrisoninServiceNew', { dataArray: StaffIds });
                console.log("update staff api working", updateStaffResponse);
                console.log("update staff api working");

                // Assuming the response contains the updated post object
                console.log("Code", post.occurance_Code);
                console.log("Number", post.occurance_Number);
                setGarrsionValue([]);
                setSubmitStatus("success");
                setTimeout(() => {
                    setSubmitStatus(null);
                }, 1000);
                setPost({
                    phone: "",
                    Applicant: "",
                    CEP: "",
                    Street: "",
                    CPF: "",
                    Neighbourhood: "",
                    City: "",
                    Reference: "",
                    Description: "",
                    Request: "",
                    av_garison: [null],
                    occurance_Number: "", // Clearing the fields
                    occurance_Code: "",
                });
                localStorage.removeItem("checkedBoxes2")
                console.log(checkboxRef.current.checked, 'abc')
            }

            const responseGetGarrison = await axios.get("http://localhost:3000/getGarrison");
            setNewGarrison(responseGetGarrison.data);
            console.log("Garrison", responseGetGarrison.data);

            const responseGetGarrisonFalse = await axios.get("http://localhost:3000/getGarrisonFalse");
            setGarrsionIdFalse(responseGetGarrisonFalse.data);
            console.log("GarrisonFalse", responseGetGarrisonFalse.data);
        } catch (error) {
            setSubmitStatus("error");
            setTimeout(() => {
                setSubmitStatus(null);
            }, 3000);
            console.error("Error:", error);
        }

        setGarrsionValue([]);
        setSubmitStatus("success");
        setTimeout(() => {
            setSubmitStatus(null);
        }, 1000);
        setPost({
            phone: "",
            Applicant: "",
            Street: "",
            Neighbourhood: "",
            CPF: "",
            CEP: "",
            City: "",
            Reference: "",
            Description: "",
            Request: "",
            av_garison: [null],
            occurance_Number: "", // Clearing the fields
            occurance_Code: "",
        });
        setCheckedBoxes({});
        setGarrsionValue([]);
        setStaffIds([]);
        setGarrsionId('');
        localStorage.removeItem("checkedBoxes2");

        console.log(checkboxRef.current.checked, 'abc')
        if (checkboxRef.current) {
            checkboxRef.current.checked = false;
        }
    };

    const occurenceUpdate = async () => {
        axios.put(`http://localhost:3000/updateOccurenceInServices`, { post, OccurenceIdForUpdate })
            .then((res) => {
                console.log("data updated", res);
                setSubmitStatus('Edited')

                setTimeout(function () {
                    setSubmitStatus(null);
                }, 2000); // 3000 milliseconds = 3 seconds
            })
            .catch((err) => {
                console.log(console.log(err));
            })
    }

    return (
        <>
            {submitStatus === 'success' && (
                <div className="alert alert-success" style={{ width: '20%' }} role="alert">
                    Submitted successfully
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="alert alert-danger" style={{ width: '20%' }} role="alert">
                    An error occurred
                </div>
            )}
            {submitStatus === 'Edited' && (
                <div className="alert alert-danger" style={{ width: '20%' }} role="alert">
                    updated successfully
                </div>
            )}
            {/* <ClearAllButton clearField={clearFeilds} /> */}
            <div className="heading" style={{ width: '100%', display: "flex", justifyContent: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <h2>Página de edição</h2>
            </div>
            <div className="custom-container">
                <div className="container">
                    <form onSubmit={handleSubmit}>
                        <div className="form form_card row my-2">
                            <div class="input-group mb-3 col-md-4 col-sm-12">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="phone"
                                    placeholder="Phona"
                                    value={post.phone}
                                    onChange={handleInput}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>

                            <div class="input-group mb-3 col-md-4  col-sm-12">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Solicitante"
                                    value={post.Applicant}
                                    onChange={handleInput}
                                    name="Applicant"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>
                            <div class="input-group mb-3 col-md-4  col-sm-12">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="CPF"
                                    placeholder="CPF"
                                    value={post.CPF}
                                    onChange={handleInput}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>
                            <div class="input-group mb-3 col-md-4 col-sm-12">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="CEP"
                                    placeholder="CEP"
                                    value={post.CEP}
                                    onChange={handleInput}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>
                            <div class="input-group mb-3 col-md-4 col-sm-12">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="Street"
                                    placeholder="Rua"
                                    value={post.Street}
                                    onChange={handleInput}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>

                            <div class="input-group mb-3 col-md-4  col-sm-12">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="Neighbourhood"
                                    placeholder="Bairro"
                                    value={post.Neighbourhood}
                                    onChange={handleInput}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>
                            <div class="input-group mb-3 col-md-4 col-sm-12">
                                <input
                                    type="text"
                                    class="form-control"
                                    name="City"
                                    placeholder="Cidade"
                                    value={post.City}
                                    onChange={handleInput}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>
                            <div class="input-group mb-3 col-md-4 col-sm-12 ">
                                <input
                                    type="text"
                                    class="form-control"
                                    placeholder="Referência"
                                    value={post.Reference}
                                    onChange={handleInput}
                                    name="Reference"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>
                        </div>

                        <div className="request_card my-4">
                            <div className="infocen garison_2 vertical-view">
                                <span >

                                    <span>Numero de Ocorrência: </span>
                                    <span ><strong>{OccurenceNumberSaved}</strong> </span>
                                </span>


                                <select
                                    className="btn border dropdown-toggle dropdown p-0"
                                    role="button"
                                    name="occurance_Code"
                                    value={post.occurance_Code}
                                    onChange={handleChange}
                                >
                                    <option value="">Cód. Atendimento</option>
                                    {data &&
                                        data.map((v, i) => (
                                            <option key={i} value={v.Code}>
                                                {v.Code}
                                            </option>
                                        ))}
                                </select>



                            </div>
                            <div class="input-group request-group mb-3 mt-3">
                                <textarea
                                    class="form-control"
                                    name="Request"
                                    placeholder="Solicitação"
                                    value={post.Request}
                                    onChange={handleInput}
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>
                        </div>

                        <div className="request_card py-5 my-4 request_card_2">
                            <div class="input-group request-group mb-3 mt-3">
                                <textarea
                                    class="form-control"
                                    placeholder="Observaçã"
                                    value={post.Description}
                                    onChange={handleInput}
                                    name="Description"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                />
                            </div>
                        </div>

                        <div className="d-flex justify-content-center ">
                            <input
                                disabled={OccurenceNumberSaved ? false : true}
                                onClick={occurenceUpdate}
                                class="btn btn-primary p-3 m-3 w-50 text-center" value="Confirmar Edição" type="button" />

                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default EditService;
