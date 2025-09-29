const { poolPromise, sql } = require('../config/mssqldb.js');

async function getGangs(inwardVoyage) {
    try {
        const pool = await poolPromise;
        const gangResult = await pool.request()
            .input('InwardVoyage', inwardVoyage)
            .query('SELECT VPS_Voyages.VoyageID, VPS_GangPlanHeader.GangNumber FROM  VPS_GangPlanHeader INNER JOIN VPS_Voyages ON VPS_GangPlanHeader.VoyageID = VPS_Voyages.VoyageID WHERE VPS_Voyages.InwardVoyage=@inwardVoyage');
        
        if (gangResult.recordset.length === 0){
            throw new Error("No voyage found for given number");
        }

        const voyageId = gangResult.recordset[0].VoyageID;
        const gangNumbers = gangResult.recordset.map(r => r.GangNumber);

        return {inwardVoyage, gangNumbers};
    } catch (error) {
        throw error;
    }
}

module.exports = { getGangs };