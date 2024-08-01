import React, { useEffect, useState } from 'react'
import '../Report/Report.scss'
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { saveAs } from 'file-saver';
import { jwtDecode } from 'jwt-decode';


const Report = () => {
    const [result, setResult] = useState([]);
    const [filteredResult, setFilteredResult] = useState([]);
    const [start, setStart] = useState(dayjs('0-00-0T0:0'));
    const [end, setEnd] = useState(dayjs('0-00-0T0:0'));
    const [loading, setLoading] = useState(false);
    const [street, setStreet] = useState("")
    const [city, setCity] = useState("")
    const [isEdited, setIsEdited] = useState(false)
    const [editData, setEditData] = useState('')

    const handleSearch = () => {
        const startingDate = start ? new Date(start) : null;
        const endingDate = end ? new Date(end) : null;

        const filteredResultFunction = filteredResult.filter((item) => {
            const registrationDate = new Date(item.registrationDate);
            const { Street, City } = item;

            // If all filters are empty, return all records
            if (startingDate == 'Invalid Date' && endingDate == 'Invalid Date' && street == '' && city == '') {
                setResult(filteredResult);
                return true; // Include this item in the result
            }

            // Date filtering logic
            let isDateMatch = true;
            if (startingDate && endingDate == 'Invalid Date') {
                isDateMatch = registrationDate >= startingDate;
            } else if (startingDate == 'Invalid Date' && endingDate) {
                isDateMatch = registrationDate <= endingDate;
            } else if (startingDate !== 'Invalid Date' && endingDate !== 'Invalid Date') {
                isDateMatch = registrationDate >= startingDate && registrationDate <= endingDate;
            }

            if (startingDate == 'Invalid Date' && endingDate == 'Invalid Date') {
                isDateMatch = true
            }

            // // Street and city filtering logic
            // let isStreetMatch = street ? Street === street : true;
            // let isCityMatch = city ? City === city : true;

            // Street and city filtering logic
            let isStreetMatch = !street || Street.includes(street);
            let isCityMatch = !city || City.includes(city);

            // Combine all filters
            return isDateMatch && isStreetMatch && isCityMatch;
        });

        setResult(filteredResultFunction);
    };

    const handleClear = () => {
        setCity('')
        setStreet('')
        setStart(dayjs('0-00-0T0:0'))
        setEnd(dayjs('0-00-0T0:0'))

        handleSearch()
    }

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:3000/occurencewithstatusthree")
            .then((res) => {
                setResult(res.data);
                setFilteredResult(res.data)
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleStartingDateAndTime = (date) => {
        setStart(date);
    }

    const handleEndingDateAndTime = (date) => {
        // if (date >= start) {
        setEnd(date);
        // } else {
        //     setEnd(dayjs('0-00-0T0:0'));
        //     alert("Selecione uma data de término correta");
        // }
    }

    useEffect(() => {
        handleSearch();
    }, [start, end, city, street]);

    const previewPdf = async (id) => {
        const token = localStorage.getItem("token");
        const ReportCreatedBy = jwtDecode(token).username;

        axios.get(`http://localhost:3000/create-pdf/new/${id}?ReportCreatedBy=${ReportCreatedBy}`, { responseType: 'text' })
            .then((response) => {
                const newWindow = window.open();
                newWindow.document.write(response.data);
                newWindow.document.close();
            })
            .catch((error) => {
                console.error('Error creating or downloading PDF:', error);
            });
    }

    const takeToPdfPage = async (id) => {
        const token = localStorage.getItem("token");
        const ReportCreatedBy = jwtDecode(token).username;

        try {
            const response = await axios.get(`http://localhost:3000/u/download-pdf/${id}`, {
                params: {
                    ReportCreatedBy: ReportCreatedBy
                }
            });

            axios({
                url: `http://localhost:3000/pdf/${id}`,
                method: 'GET',
                responseType: 'blob', // Important: Set the responseType to 'blob' to receive binary data
            })
                .then((response) => {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    saveAs(blob, `pdf-${id}.pdf`); // Save the blob as a file
                })
                .catch((error) => {
                    console.error('Error:', error);
                });

            return response.data;

        } catch (error) {
            console.error('Error creating downloadable PDF:', error);
            throw error;
        }
    };

    const handleDownloadButtonClick = (id) => {
        // createAndDownloadPdf(id);
        takeToPdfPage(id)
        // Disable further clicks by removing the event listener
        const downloadButton = document.getElementById(id);
        downloadButton.removeEventListener('click', handleClick);
    };

    const handleClick = (e) => {
        const id = e.currentTarget.id;
        handleDownloadButtonClick(id);
    };

    const generatePDF = async (occurrence, report, ReportCreatedBy) => {
        setEditData('')
        setIsEdited(false)

        const {
            av_garison, occurance_Number, ClosedBy, MadeBy, Request, Description, registrationDate, Status, DispatchBy, phone, Applicant, Street, CPF, CEP, Neighbourhood, City, Reference, changedBy, DescriptionDateTime, RequestDateTime, dateTime
        } = occurrence;
        const { formFields, description } = report;

        const occurence_code_to_display = occurance_Number.toString().padStart(4, '0');
        const date = new Date();
        const formattedDate = date.toLocaleDateString();
        const time = date.toLocaleTimeString();

        let changingVar;

        if ((DescriptionDateTime !== '') && (RequestDateTime !== '')) {
            changingVar = `<li><strong>Descrição:</strong> ${Description}</li>
            <li><strong>Descrição Editado Por:</strong> ${changedBy} em ${DescriptionDateTime}</li>
            <li><strong>Solicitação:</strong> ${Request}</li>
            <li><strong>Solicitação Editado Por:</strong> ${changedBy} em ${RequestDateTime}</li>`
        } else if ((DescriptionDateTime == '') && (RequestDateTime !== '')) {
            changingVar = `<li><strong>Descrição:</strong> ${Description}</li>
            <li><strong>Descrição Editado Por:</strong> Ainda não editado</li>
            <li><strong>Solicitação:</strong> ${Request}</li>
            <li><strong>Solicitação Editado Por:</strong> ${changedBy} em ${RequestDateTime}</li>`
        } else if ((DescriptionDateTime !== '') && (RequestDateTime == '')) {
            changingVar = `<li><strong>Descrição:</strong> ${Description}</li>
            <li><strong>Descrição Editado Por:</strong> ${changedBy} em ${DescriptionDateTime}</li>
            <li><strong>Solicitação:</strong> ${Request}</li>
            <li><strong>Solicitação Editado Por:</strong> Ainda não editado</li>`
        } else if ((DescriptionDateTime == '') && (RequestDateTime == '')) {
            changingVar = `<li><strong>Descrição:</strong> ${Description}</li>
            <li><strong>Descrição Editado Por:</strong> Ainda não editado</li>
            <li><strong>Solicitação:</strong> ${Request}</li>
            <li><strong>Solicitação Editado Por:</strong> Ainda não editado</li>`
        }

        const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Report</title>
                    <style>
                        body {
                            background-color: #f2f2f2;
                            font-family: Arial, sans-serif;
                            margin: 10px;
                            padding: 10px;
                        }
                        .container {
                            background-color: #fff;
                            padding: 30px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            margin: 20px auto;
                            max-width: 1200px;
                        }
                        h1,
                        h2 {
                            color: #343a40;
                        }
                        .section {
                            padding: 20px;
                            margin-bottom: 20px;
                            border-radius: 8px;
                            background-color: #f8f9fa;
                            page-break-inside: avoid;
                        }
                        .border-right {
                            border-right: 1px solid #dee2e6;
                        }
                        .border-left {
                            border-left: 1px solid #dee2e6;
                        }
                        hr {
                            border-top: 1px solid #dee2e6;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                        }
                        li {
                            margin-bottom: 10px;
                        }
                        li strong {
                            color: #007bff;
                        }
                        .horizontal-list {
                            display: flex;
                            flex-wrap: wrap;
                        }
                        .horizontal-list>div {
                            flex: 0 0 50%;
                            padding: 10px;
                            box-sizing: border-box;
                            border-right: 1px solid #dee2e6;
                            border-bottom: 1px solid #dee2e6;
                            page-break-inside: avoid;
                        }
                        .horizontal-list>div:nth-child(odd) {
                            border-right: none;
                        }
                        .horizontal-list>div:nth-child(even) {
                            border-left: 1px solid #dee2e6;
                        }
                        .horizontal-list hr {
                            border-top: 1px solid #dee2e6;
                            width: 100%;
                            margin: 10px 0;
                        }
                        .download-button {
                            margin-top: 20px;
                            text-align: center;
                        }
                        .new-button {
                            margin-top: 5px;
                            text-align: center;
                        }
                        .margin-t {
                            margin-top: 10px;
                        }
                        .margin-b {
                            margin-bottom: 20px;
                        }
                        .do-it {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-weight: 600;
                        }
                        .down {
                            display: flex;
                            justify-content: space-evenly;
                            font-weight: 600;
                        }
                        .row {
                            display: flex;
                            flex-wrap: wrap;
                            margin-right: -15px;
                            margin-left: -15px;
                            page-break-inside: avoid;
                        }
                        .col-md-6 {
                            flex: 0 0 50%;
                            max-width: 50%;
                            padding-right: 15px;
                            padding-left: 15px;
                            box-sizing: border-box;
                        }
                        .col-md-12 {
                            flex: 0 0 100%;
                            max-width: 100%;
                            padding-rightpadding-right: 15px;
                            padding-left: 15px;
                            box-sizing: border-box;
                        }
                    </style>
                    </head>
                    <body>
                        <div class="container margin-t">
                            <div class="new down">
                                <p>Relatório Gerado Por: ${ReportCreatedBy}</p>
                                <p>Criado em Data: ${formattedDate}</p>
                                <p>Criado em Hora: ${time}</p>
                            </div>
                            <h1 class="text-center margin-b">Relatório</h1>
                            <hr>
                            <div class="row">
                                <div class="col-md-6 occurrence-details section border-right">
                                    <h2>Detalhes da Ocorrência</h2>
                                    <ul>
                                        <li><strong>Telefone:</strong> ${phone}</li>
                                        <li><strong>Requerente:</strong> ${Applicant}</li>
                                        <li><strong>Rua:</strong> ${Street}</li>
                                        <li><strong>CPF:</strong> ${CPF}</li>
                                        <li><strong>CEP:</strong> ${CEP}</li>
                                        <li><strong>Bairro:</strong> ${Neighbourhood}</li>
                                        <li><strong>Cidade:</strong> ${City}</li>
                                        <li><strong>Referência:</strong> ${Reference}</li>
                                        <li><strong>Ocorrência gerada por:</strong> ${MadeBy} em ${dateTime} </li>
                                        ${changingVar}
                                    </ul>
                                </div>
                                <div class="col-md-6 garison-details section border-left">
                                    <h2>Guarnição</h2>
                                    <ul>
                                        ${av_garison.map((garison, index) => `
                                            ${index > 0 ? '<hr>' : ''}
                                            <li><strong>Nome do Batalhão:</strong> ${garison.garissonName}</li>
                                            <li><strong>Tempo de Despacho:</strong> ${garison.DispachTime === 'Notarrived' ? 'Não chegou' : new Date(garison.DispachTime).toLocaleTimeString()}</li>
                                            <li><strong>Tempo de Chegada:</strong> ${garison.ArrivalTime === 'Notarrived' ? 'Não chegou' : new Date(garison.ArrivalTime).toLocaleTimeString()}</li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-md-12 report-details section">
                                    <h2>Detalhes do Relatório</h2>
                                    <ul>
                                        <li><strong>Descrição:</strong> ${description}</li>
                                    </ul>
                                    <div class="horizontal-list">
                                        ${formFields.map((field, index) => `
                                            <div>
                                                <ul>
                                                    <li><strong>ID da Ocorrência:</strong> ${field.IdOfOccurence}</li>
                                                    <li><strong>Nome:</strong> ${field.name}</li>
                                                    <li><strong>CPF:</strong> ${field.cpf}</li>
                                                    <li><strong>Telefone:</strong> ${field.phone}</li>
                                                    <li><strong>CEP:</strong> ${field.cep}</li>
                                                    <li><strong>Rua:</strong> ${field.street}</li>
                                                    <li><strong>Bairro:</strong> ${field.Neighborhood}</li>
                                                    <li><strong>Cidade:</strong> ${field.City}</li>
                                                    <li><strong>Pessoa:</strong> ${field.person}</li>
                                                </ul>
                                            </div>
                                            ${index % 2 === 1 && index < formFields.length - 1 ? '<hr>' : ''}
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                            <hr>
                            <div class="row">
                                <div class="col-md-12 additional-info section">
                                    <h2>Informações Adicionais</h2>
                                    <ul>
                                        <li><strong>Número da Ocorrência:</strong> ${occurance_Number}</li>
                                        <li><strong>Código da Ocorrência:</strong> ${occurence_code_to_display}</li>
                                        <li><strong>Status:</strong> ${Status}</li>
                                        <li><strong>Tempo:</strong> ${occurrence.Time === 'Notarrived' ? 'Não chegou' : new Date(occurrence.Time).toLocaleTimeString()}</li>
                                        <li><strong>Data:</strong> ${new Date(occurrence.Time).toLocaleDateString()}</li>
                                        <li><strong>Ocorencia Gerada Por:</strong> ${MadeBy}</li>
                                        <li><strong>Data de Registro:</strong> ${new Date(registrationDate).toLocaleDateString()}</li>
                                        <li><strong>Despachado Por:</strong> ${DispatchBy}</li>
                                        <li><strong>Fechado Por:</strong> ${ClosedBy}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'downloaded_page.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };

    const createAndDownloadPdf = (id) => {
        // Decode the JWT token to get the username
        const token = localStorage.getItem("token");
        const ReportCreatedBy = jwtDecode(token).username;

        // Send ID and ReportCreatedBy to backend to generate PDF
        axios.post(`http://localhost:3000/create-pdf/${id}`, { ReportCreatedBy })
            .then((response) => {

                const { occurrence, report, ReportCreatedBy } = response.data;
                generatePDF(occurrence, report, ReportCreatedBy)

            })
            .catch((error) => {
                console.error('Error Getting Data:', error);
            });
    };

    return (
        <div className="custom-container">
            <div className="container full_hieght_3">
                <div className="Dashboard_heading">
                    <h3>Relatório</h3>
                    <hr className='' />
                </div>
                <div className="row report-reponsive-ipad ">
                    <div className="col-md-8 col-sm-12 col-lg-12 w-100 d-flex" style={{ marginTop: "13px" }}>
                        <div className="Searchbar">
                            <div className="dateandtime">
                                <div className="starting-date-time">
                                    <label htmlFor=""><strong>A partir da</strong></label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DateTimePicker
                                            className="dateandtime"
                                            value={start}
                                            onChange={handleStartingDateAndTime}
                                            sx={{ backgroundColor: " rgb(255, 255, 255)" }}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className="ending-date-time">
                                    <label htmlFor=""><strong>Para</strong></label>
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DateTimePicker
                                            className="dateandtime"
                                            value={end}
                                            onChange={handleEndingDateAndTime}
                                            sx={{ backgroundColor: " rgb(255, 255, 255)" }}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </div>
                            <div className="street-and-city">
                                <div>
                                    <label htmlFor=""><strong>Rua</strong></label>
                                    <TextField id="outlined-basic" label="Rua"
                                        value={street}
                                        className="dateandtime"
                                        onChange={(e) => setStreet(e.target.value)}
                                        variant="outlined" sx={{ backgroundColor: " rgb(255, 255, 255)" }} />
                                </div>
                                <div>
                                    <label htmlFor=""><strong>Cidade</strong></label>
                                    <TextField id="outlined-basic" label="Cidade"
                                        className="dateandtime"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        variant="outlined" sx={{ backgroundColor: " rgb(255, 255, 255)" }} />
                                </div>
                                <input className="search-btn btn btn-primary text-center w-30" value="Limpar Filtros" type="submit" onClick={handleClear} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="content">
                    <h5>O resultado é:</h5>
                    {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress size={100} />
                    </Box> :
                        <div className="result overflow">
                            <div className="result-content-wrapper">
                                {result.length > 0 ? result.sort((a, b) => b.occurance_Number - a.occurance_Number).map((v, i) => {
                                    const parsedDate = dayjs(v.registrationDate);
                                    const formattedDateRegistratonDate = parsedDate.format('DD/MM/YY');
                                    return (
                                        <div className="result-content" key={i}>
                                            <div>
                                                <table className="table">
                                                    <thead>
                                                        <tr className="standout-row">
                                                            <th><strong>Data</strong></th>
                                                            <th><strong>Occurencia</strong></th>
                                                            <th><strong>Cod</strong></th>
                                                            <th><strong>Rua</strong></th>
                                                            <th><strong>Bairro</strong></th>
                                                            <th><strong>Download</strong></th>
                                                            <th><strong>Preview</strong></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td>{formattedDateRegistratonDate}</td>
                                                            <td>{v.occurance_Number}</td>
                                                            <td>{v.occurance_Code}</td>
                                                            <td className='street'>{v.Street}</td>
                                                            <td lassName='city'>{v.City}</td>
                                                            {/* Maaz Update: I have changed the functionality of report being download*/}
                                                            <td>
                                                                <div id={v._id} onClick={() => { createAndDownloadPdf(v._id) }}>
                                                                    <FileDownloadIcon
                                                                        sx={{
                                                                            cursor: "pointer"
                                                                        }}
                                                                    />
                                                                </div>
                                                            </td>
                                                            {/* Maaz Update: I have added this for to show complete preview details */}
                                                            <td style={{ fontWeight: '600', cursor: 'pointer' }} onClick={() => { previewPdf(v._id) }}>Preview</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                        </div>
                                    )
                                }) : <div className="no-result-content text-center my-3">
                                    <p><strong>
                                        Resultados não encontrados
                                    </strong>
                                    </p>
                                </div>
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Report;
