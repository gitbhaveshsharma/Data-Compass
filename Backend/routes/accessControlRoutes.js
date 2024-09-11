
const router = require('express').Router();
const mongoose = require('mongoose');
const IP = require('../models/IP');

router.get('/',async(req, res)=>{
    try{
        const result = await IP.find().exec();

        
        res.json(result);
    }catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Server error.' });
    }
})


//add new Ip address
router.post('/',async(req, res)=>{
    const {IPAddress, name} = req.body;

    console.log(req.body);
    if(!IPAddress || !name) return res.status(400).json({message : "bad request-body should not be empty"});

    try{
        const duplicate = await IP.findOne({IPAddress : IPAddress, name: name}).exec();
        console.log(duplicate);
        if(duplicate) return res.status(409).json({message : "Duplicate : IP address already exits"});

        const result  = await IP.create({
            "IPAddress" : IPAddress,
            "name" : name,
        })
        console.log(result);
        res.status(200).json(result);
    }catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Server error.' });
    }
})
//update status (in future IP)
router.put('/',async(req, res)=>{
    const {id,status} = req.body;

console.log(req.body);
if(!id || !status) return res.status(400).json({message : "bad request-body should not be empty"});

try{
    const foundIP = await IP.findById(id).exec();
    //console.log(foundIP);
    if(!foundIP) return res.status(404).json({message : "Not Found-IP address doesnt Exits"});
    //update status and save 
    foundIP.status = status;
    await foundIP.save();
    
    console.log(foundIP)
    res.status(200).json(foundIP);
}catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Server error.' });
}
})
//delete ip address
router.delete('/:id',async(req, res)=>{
    const {id} = req.params;
    console.log(`Received DELETE request for ID: ${id}`);

    console.log("hh",req.params);

    if(!id ) return res.status(400).json({message : "bad request-body should not be empty"});

    try{
        const result = await IP.findByIdAndDelete(id).exec();
        console.log(result); 
        if (!result) return res.status(404).json({ message: "Not Found: IP address doesn't exist" });
        
        res.status(200).json({message:"IP address deleted successfully"});
    }catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Server error.' });
    }
})

module.exports=router;