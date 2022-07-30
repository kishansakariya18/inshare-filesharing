const router = require('express').Router();
// const { error } = require('console'); 
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4:uuidv4 } = require('uuid');
const { findOne } = require('../models/file');

let storage = multer.diskStorage({
     destination: (req,res,cb) => cb(null , 'uploads/'),
     filename: (req,file, cb) =>{

        //ensure filename is unique
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

            cb(null , uniqueName);
     },
});

let upload = multer({
    storage,  //what is storage
    limits: {fileSize : 1000000 * 100}, 
}).single('myfile');

// router.post('/' , (req,res) => {
//     // Stores File
//         upload(req , res , async (err) =>{
 
//         //Validate request  (if req is valid or not)
//             if(!req.file){
//             return res.json({error : "All Fields are required"});
//             }
//             if(err){
//                 return res.status(500).send({error: err.message})
//             }
//             //store data into database
//             const file = new File({
//                 filename: req.file.filename,
//                 uuid : uuid4(),
//                 path: req.file.path,
//                 size: req.file.size
//             });

//             const response = await file.save();
//             return res.json({file: `${process.env.APP_BASE_URL}/files/${response.uuid}`});
//             //http:// localhost:4000/files/ebbdbbcu-12nje
//         })
//     //Response => Link
// });

router.post('/', (req, res) => {
    // Stores File
    upload(req, res, async (err) => {
         //Validate request  (if req is valid or not)
      if (err) {
        return res.status(500).send({ error: err.message });
      }
      //store data into database
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      });
});


router.post('/send' ,async (req,res) =>{

    const {uuid , emailTo , emailFrom} = req.body;
    //validate Request
    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({error : "All fields are required"});
    }

    //Get data from database
    const file = await File.findOne({uuid : uuid});
    //If already sent email before than 
    if(file.sender){
        return res.status(422).send({error : "Email Already Sent."});
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();

    //Send Email
    const sendMail = require('../services/emailService');
    sendMail({
        from : emailFrom,
        to: emailTo,
        subject : 'inShare File Sharing',
        text : `${emailFrom} Shared file with you`,
        html : require('../services/emailTemplate')({
            emailFrom : emailFrom,
            downloadLink : `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size/1000) + 'KB',
            expires : '24hours'
        })
    })
    return res.send({success : true})
   

});



module.exports = router;