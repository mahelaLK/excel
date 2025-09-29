const { poolPromise, sql } = require('../config/mssqldb.js');

async function getAllVoyage() {
    try {
        const pool = await poolPromise;
        const voyageResult = await pool.request()
            .query('SELECT RTRIM(InwardVoyage) AS InwardVoyage FROM VPS_Voyages');

        if (voyageResult.recordset.length===0) {
            throw new Error("No voyages");
        }
        return voyageResult;
    } catch (error) {
        throw error;
    }
}

module.exports = { getAllVoyage }