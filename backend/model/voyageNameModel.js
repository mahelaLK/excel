const { poolPromise, sql } = require('../config/mssqldb.js');

async function getAllVoyage(vesselName) {
    try {
        const pool = await poolPromise;
        const voyageResult = await pool.request()
            .input('VesselName', vesselName)
            .query('SELECT RTRIM(VPS_Voyages.InwardVoyage) AS InwardVoyage FROM  VPS_VesselMaster INNER JOIN VPS_Voyages ON VPS_VesselMaster.VesselID = VPS_Voyages.VesselID WHERE VPS_VesselMaster.VesselName=@vesselName');

        if (voyageResult.recordset.length===0) {
            throw new Error("No voyages");
        }
        return voyageResult;
    } catch (error) {
        throw error;
    }
}

module.exports = { getAllVoyage }