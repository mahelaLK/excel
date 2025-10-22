import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { PortContext } from './context/PortContext';
import { useEffect } from 'react';
import GangDetails from './GangDetails';
import { IoIosSearch } from "react-icons/io";
import GangDetailsCar from './GangDetailsCar';
import GangDetailsGen from './GangDetailsGen';

const Voyage = ({vesselName, vesselType}) => {

  const { voyageNames, getGangDetails, getGangDetailsCar, getGangDetailsGen, getAllVoyageNames } = useContext(PortContext);
  const [selectedVoyage, setSelectedVoyage] = useState('');
  const [submittedVoyage, setSubmittedVoyage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedVoyage(selectedVoyage);
    if (vesselType==='Container Ship') {
      getGangDetails(selectedVoyage);
    } else if (vesselType==='Car Carrier'){
      getGangDetailsCar(selectedVoyage);
    } else if (vesselType==='General Cargo'){
      getGangDetailsGen(selectedVoyage);
    }
  }

  useEffect(()=>{
    if (vesselName) {
      getAllVoyageNames(vesselName);
    }
    setSelectedVoyage('');
    setSubmittedVoyage('');
  },[vesselName])

  return (
    <div>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        <select value={selectedVoyage}
          onChange={(e)=>{
            const value = e.target.value;
            setSelectedVoyage(value);
            if (value==='') {
              setSubmittedVoyage('');
            }
          }}
          className='outline-1 px-2 py-1 rounded-lg my-2'
        >
          <option value="" className='px-4'>----Select Voyage----</option>
          {voyageNames.map((voyage, index) => (
            <option key={index} value={voyage.InwardVoyage} className='px-4'>
              {voyage.InwardVoyage}
            </option>
          ))}
        </select>
        <button type="submit" className='bg-neutral-800 text-neutral-200 px-2 py-1 rounded-lg my-2 flex gap-2 justify-center items-center'>Submit <IoIosSearch/></button>
      </form>
      <hr className='mt-4'/>
      <div className='overflow-auto'>
        {submittedVoyage && (
          <>
            {vesselType==='Container Ship' && (<GangDetails vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
            {vesselType==='Car Carrier' && (<GangDetailsCar vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
            {vesselType==='General Cargo' && (<GangDetailsGen vesselName={vesselName} inwardVoyage={submittedVoyage}/>)}
          </>
        )}
      </div>
    </div>
  )
}

export default Voyage