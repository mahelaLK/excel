const { getGangs } = require('../model/gangModel.js');

async function fetchGang(req, res) {
    try {
        const inwardVoyage = req.params.inwardVoyage;
        const details = await getGangs(inwardVoyage);
        res.json({success: true, details});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message});
    }
}

module.exports = { fetchGang };