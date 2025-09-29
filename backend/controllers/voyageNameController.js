const { getAllVoyage } = require('../model/voyageNameModel.js')

async function fetchVoyageNames(req, res) {
    try {
        const voyageNames = await getAllVoyage();
        res.json({success:true, voyageNames})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

module.exports = { fetchVoyageNames }