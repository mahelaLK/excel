const { poolPromise, sql } = require('../config/mssqldb.js');

async function getAllGangPlanDetailGen(inwardVoyage) {
    try {
        const pool = await poolPromise;
        const gangResult = await pool.request()
            .input('inwardVoyage', inwardVoyage)
            .query(`SELECT DISTINCT 
                        VPS_Voyages.VoyageID, 
                        VPS_GangPlanHeader.GangNumber 
                    FROM  VPS_GangPlanHeader INNER JOIN VPS_Voyages 
                    ON VPS_GangPlanHeader.VoyageID = VPS_Voyages.VoyageID 
                    WHERE VPS_Voyages.InwardVoyage=@inwardVoyage`);
        
            if (gangResult.recordset.length === 0){
                throw new Error("No voyage found for given number");
            }

            const voyageId = gangResult.recordset[0].VoyageID;
            const gangNumbers = gangResult.recordset.map(r => r.GangNumber);

            const gangPlanDetails = [];
            let berthSide = null;
            for (const gangNumber of gangNumbers){
                const detailResult = await pool.request()
                .input('gangNumber', gangNumber)
                .input('voyageId', voyageId)
                .query(`
                    SELECT
                        VPS_GangPlanHeader.BerthSide, 
                        VPS_GangPlanHeader.Crane, 
                        VPS_GangPlanDetail.GangPlanHeaderID, 
                        VPS_GangPlanDetail.ListOfBays
                    FROM VPS_GangPlanHeader 
                    INNER JOIN VPS_GangPlanDetail
                    ON VPS_GangPlanHeader.GangPlanHeaderID = VPS_GangPlanDetail.GangPlanHeaderID 
                    WHERE 
                        VPS_GangPlanHeader.GangNumber=@gangNumber AND VPS_GangPlanHeader.VoyageID=@voyageId
                    `);
                
                berthSide = detailResult.recordset[0]?.BerthSide?.trim() || null;

                const cranes = [
                    ...new Set(
                        detailResult.recordset
                            .map(r => r.Crane?.trim())
                            .filter(Boolean)
                    )
                ];

                const gangPlanHeaderIds = detailResult.recordset.map(r => r.GangPlanHeaderID);
                let gangDetails = [];
                
                for(const gangPlanHeaderId of gangPlanHeaderIds){
                    const bayResult = await pool.request()
                        .input('gangPlanHeaderId', gangPlanHeaderId)
                        .query(`
                            SELECT
                                Discharge,
                                Overstow, 
                                Restow, 
                                Loads, 
                                NoOfVehicles, 
                                BBLK
                            FROM VPS_GangPlanHeader 
                            WHERE GangPlanHeaderID = @gangPlanHeaderId
                            `);

                    const shiftResult = await pool.request()
                            .input('gangPlanHeaderId', gangPlanHeaderId)
                            .query(`
                                SELECT
                                    VPS_ShiftPlanHeader.ShiftPlanHeaderID, 
                                    VPS_ShiftPlanHeader.ShiftNumber, 
                                    VPS_ShiftPlanHeader.ShiftStartDate, 
                                    VPS_ShiftPlanHeader.Supervisor,  
                                    VPS_ShiftPlanHeader.NoOfDrivers, 
                                    VPS_ShiftPlanHeader.TK, 
                                    VPS_ShiftPlanHeader.Checklist, 
                                    VPS_ShiftPlanHeader.Traffic, 
                                    VPS_ShiftPlanHeader.Unlashing
                                FROM VPS_ShiftPlanHeader 
                                INNER JOIN VPS_GangPlanHeader ON VPS_ShiftPlanHeader.VoyageID = VPS_GangPlanHeader.VoyageID 
                                WHERE VPS_GangPlanHeader.GangPlanHeaderID = @gangPlanHeaderId
                                `);
                    
                    bayResult.recordset.forEach(r=>{
                        gangDetails.push({
                            GangPlanHeaderID: gangPlanHeaderId,
                            Discharge: r.Discharge,
                            Overstow: r.Overstow,
                            Restow: r.Restow,
                            Loads: r.Loads,
                            NoOfVehicles: r.NoOfVehicles,
                            BBLK: r.BBLK,
                            shiftPlanDetails: shiftResult.recordset.map(s => ({
                                ShiftPlanHeaderID: s.ShiftPlanHeaderID,
                                ShiftNumber: s.ShiftNumber,
                                ShiftStartDate: s.ShiftStartDate,
                                Supervisor: s.Supervisor,
                                NoOfDrivers: s.NoOfDrivers,
                                TK: s.TK,
                                Checklist: s.Checklist,
                                Traffic: s.Traffic,
                                Unlashing: s.Unlashing
                            }))
                        });
                    });
                }



                gangPlanDetails.push({
                    gangNumber,
                    Crane: cranes,
                    gangPlanHeaderIds,
                    gangDetails
                })
            }
            
        return {inwardVoyage, berthSide, gangNumbers, gangPlanDetails};
    } catch (error) {
        throw error;
    }
}


module.exports = { getAllGangPlanDetailGen };