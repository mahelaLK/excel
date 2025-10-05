const { poolPromise, sql } = require('../config/mssqldb.js');

async function getVesselName(createdDate) {
    try {
        const pool = await poolPromise;
        const vesselResult = await pool.request()
            .query('SELECT RTRIM(VesselName) AS VesselName FROM  VPS_VesselMaster')
        
        if (vesselResult.recordset.length===0) {
            throw new Error("No Vessels");
        }
        return vesselResult;
    } catch (error) {
        throw error;
    }
}

module.exports = { getVesselName }