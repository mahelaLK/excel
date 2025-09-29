import React from 'react'
import { useState } from 'react';
import { createContext } from 'react'
import axios from 'axios'
import { useEffect } from 'react';

export const PortContext = createContext();

const PortContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [voyageNames, setVoyageNames] = useState([]);
    const [gangDetails, setGangDetails] = useState(null);
    const [totalActual, setTotalActual] = useState([]);

    const getAllVoyageNames = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/voyagenames')
            if (response.data.success) {
                setVoyageNames(response.data.voyageNames.recordset)
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
            
        }
    }

    const getGangDetails = async (inwardVoyage) => {
        try {
            const response = await axios.get(backendUrl + `/api/gangplandetails/${inwardVoyage}`)
            if (response.data.success) {
                setGangDetails(response.data.details)
            } else {
                console.log(response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    useEffect(()=>{
        getAllVoyageNames()
    },[])

    const value = {
        voyageNames, 
        gangDetails, getGangDetails
    }

  return (
    <PortContext.Provider value={value}>
        {props.children}
    </PortContext.Provider>
  )
}

export default PortContextProvider