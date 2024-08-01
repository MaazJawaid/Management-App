import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
const Home = () => {

    // const [Dashboard, setDashboard] = useState([])
    const [occurenceInCareLength, setoccurenceInCareLength] = useState(null)
    const [openCasesLength, setopenCasesLength] = useState(null)
    const [StaffRegistrationsLength, setStaffRegistrationsLength] = useState(null)
    const [vehicleRegistrationsLength, setvehicleRegistrationsLength] = useState(null)
    const [guAvailableLength, setguAvailableLength] = useState(null)
    const [guNotAvailableLength, setguNotAvailableLength] = useState(null)
    const [todayOccurencesLength, settodayOccurencesLength] = useState(null)
    const [monthOccurencesLength, setMonthOccurencesLength] = useState(null)
    const [yearOccurencesLength, setYearOccurencesLength] = useState(null)
    const [loading , setLoading] = useState(false)


    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:3000/getnewoccuranceAllStatusWithZeroAndTwo")
            .then((response) => {
                let data = response.data
                // console.log(data.length)
                setoccurenceInCareLength(data.length)
        })
        axios.get("http://localhost:3000/getnewoccuranceOpenCases")
            .then((response) => {
                let data = response.data
                // console.log(data.length)
                setopenCasesLength(data.length)
        })
        axios.get("http://localhost:3000/getAllStaff")
            .then((response) => {
                let data = response.data
                // console.log(data.length)
                setStaffRegistrationsLength(data.length)
        })
        axios.get("http://localhost:3000/getVehcle")
            .then((response) => {
                let data = response.data
                // console.log(data.length)
                setvehicleRegistrationsLength(data.length)
        })
        axios.get("http://localhost:3000/getGarrisonTrue")
            .then((response) => {
                let data = response.data
                // console.log(data.length)
                setguAvailableLength(data.length)
        })
        axios.get("http://localhost:3000/getGarrisonFalse")
            .then((response) => {
                let data = response.data
                // console.log(data.length)
                setguNotAvailableLength(data.length)
        })
        axios.get("http://localhost:3000/occurrences/today")
            .then((response) => {
                let data = response.data.count
                // console.log("today total occuenrences : " , data)
                settodayOccurencesLength(data)
        })
        axios.get("http://localhost:3000/occurrences/month")
            .then((response) => {
                let data = response.data.count
                // console.log(data.length)
                setMonthOccurencesLength(data)
        })
        axios.get("http://localhost:3000/occurrences/year")
            .then((response) => {
                let data = response.data.count
                // console.log(data.length)
                setYearOccurencesLength(data)
        })
        .finally(()=>{
            setLoading(false)
        })


    }, [])
    return (
        <div className="custom-container text-center">
            <div className='container'>
                <div className='Dashboard_heading'>
                    <h3 >Painel de Controle </h3>
                </div>
            {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px'}}>
                        <CircularProgress size={100} />
                    </Box>:
                <div className='Dashboard_cards'>

                    <>
                       <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Ocorrências em Atendimento
                            </h6>
                            <h5>{occurenceInCareLength}</h5>
                        </div>
                        <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Ocorrências em aberto
                            </h6>
                            <h5>{openCasesLength}</h5>
                        </div>
                        <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Registros de Funcionários
                            </h6>
                            <h5>{StaffRegistrationsLength}</h5>
                        </div>
                        <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Gu Disponiveis
                            </h6>
                            <h5>{vehicleRegistrationsLength}</h5>
                        </div>
                        <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Gu Não  Disponiveis
                            </h6>
                            <h5>{guAvailableLength}</h5>
                        </div>
                        <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Efetivo Total
                            </h6>
                            <h5>{guNotAvailableLength}</h5>
                        </div>
                        <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Ocorrências Atendidas Hoje
                            </h6>
                            <h5>{todayOccurencesLength}</h5>
                        </div>
                        <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Ocorrências Atendidas no Mês
                            </h6>
                            <h5>{monthOccurencesLength}</h5>
                        </div>
                        <div className="Dashboard_card" style={{backgroundColor: 'white' }}>
                            <h6>
                            Ocorrências Atendidas no Ano
                            </h6>
                            <h5>{yearOccurencesLength}</h5>
                        </div>
                    </>

                </div>

}
            </div>
        </div>
    )
}

export default Home