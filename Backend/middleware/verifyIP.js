const IP = require("../models/IP");

const verifyIP = async(req, res, next) =>{
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`Client IP: ${clientIp}`);

    // If behind a proxy
    // const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    try{
        const foundIPs = await IP.findOne({IPAddress: clientIp}).exec();
        //if(!foundIPs) return res.status(401).json({message : "UnAuthorized Access : UnAuthorized IP address"});
        next();
    }catch(error){
        console.log(error)
        res.status(500).send({ error: 'Server error.' });
    }
}
module.exports = verifyIP;