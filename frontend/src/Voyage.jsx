import React from 'react'
import { useContext } from 'react';
import { useState } from 'react'
import { PortContext } from './context/PortContext';
import { useEffect } from 'react';
import GangDetails from './GangDetails';

const Voyage = () => {

  const { voyageNames, getGangDetails } = useContext(PortContext);
  const [selectedVoyage, setSelectedVoyage] = useState('');
  const [submittedVoyage, setSubmittedVoyage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedVoyage(selectedVoyage);
    getGangDetails(selectedVoyage);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <select value={selectedVoyage}
        onChange={(e)=>setSelectedVoyage(e.target.value)}
        >
          <option value="">----Select Voyage----</option>
          {voyageNames.map((voyage, index) => (
            <option key={index} value={voyage.InwardVoyage}>
              {voyage.InwardVoyage}
            </option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
      {submittedVoyage && <GangDetails inwardVoyage={submittedVoyage}/>}
    </div>
  )
}

export default Voyage