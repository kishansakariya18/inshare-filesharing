const router = require('express').Router();
const File = require('../models/file')

router.get('/:uuid' , async (req,res) =>{
    try{
    const file = await File.findOne({ uuid: req.params.uuid});
    //Link Expired
    if(!file){
        return res.render('download' , {error : ' Link has been expired '});
    }

    return res.render('download' , {
        uuid : file.uuid , 
        fileName : file.filename,
        fileSize: file.size,
        downloadLink : `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        //http://localhost:4000/files/download/28787698
    })
    }
    catch(err){
        return res.render('download' , {error : 'Something Went Wrong'});
    }
});


module.exports = router;