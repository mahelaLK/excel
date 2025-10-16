const { poolPromise, sql } = require('../config/mssqldb.js');

async function getVesselName() {
    try {
        const pool = await poolPromise;
        const vesselResult = await pool.request()
            .query('SELECT RTRIM(VesselName) AS VesselName, RTRIM(VesselType) AS VesselType FROM  VPS_VesselMaster')
        
        if (vesselResult.recordset.length===0) {
            throw new Error("No Vessels");
        }
        return vesselResult;
    } catch (error) {
        throw error;
    }
}

module.exports = { getVesselName }