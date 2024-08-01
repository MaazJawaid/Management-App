import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DataNotFound from '../../components/DataNotFound/DataNotFound';
import Slide from "@mui/material/Slide";
import CircularProgress from '@mui/material/CircularProgress';
import './SearchData.scss'; // Import CSS file for custom styles
import { Box } from '@mui/material';

const SearchData = () => {
  const { id } = useParams();
  const [dataSearched, setDataSearched] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios
        .get(`https://latest-v2.vercel.app/SearchedOccurences/${id}`) // Corrected the API endpoint
        .then((response) => {
          setDataSearched(response.data);
          console.log("Data fetched:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className='container'>
      <div className="heading">
        <h3>Data Searched</h3>
        <hr />
      </div>
      <div className="">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
            <CircularProgress size={100} />
          </Box>
        ) : dataSearched.length > 0 ? ( // Added check for dataSearched length
          dataSearched.map((v, i) => (
            <div style={{ width: "100%" }} className="ml-15  my-3 row" key={i}>
              <div className="occurrence-box w-100">
                <h6>Telefone: {v.phone}</h6>
                <h6>Candidato: {v.Applicant}</h6>
                <h6>Garnição deixando a cena: {v.Neighbourhood}</h6>
                <h6>Bonde: {v.Street}</h6>
                <h6>Rua: {v.Street}</h6>
              </div>
            </div>
          ))
        ) : (
          <DataNotFound />
        )}
      </div>
    </div>
  );
};

export default SearchData;
