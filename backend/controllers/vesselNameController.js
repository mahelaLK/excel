const { getVesselName } = require('../model/vesselNameModel.js')

async function fetchVesselNames(req, res) {
    try {
        const vesselNames = await getVesselName();
        res.json({success: true, vesselNames})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

module.exports = { fetchVesselNames }