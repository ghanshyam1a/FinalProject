import multer from "multer";
import {v4} from "uuid";
// single file uploaded
//const upload = multer({dest:"uploads"});

// multiple file uploaded
//const upload = multer({dest:"uploads"});

// upload multiple file and single file in channinng upload.file.js not in user.router.js file
//const upload = multer({dest:"uploads"}).single("avatar");

//const upload = multer({dest:"uploads"}).array("profile",3);

// upload multiple file with multiple input fields

// const upload = multer({dest:"uploads"}).fields([
//     {name: "avatar",maxcount : 1},
//     {name:"profile", maxcount: 2},
//     {name:"gallery",maxcount:3},
// ]);

// configure storage
const storage = multer.diskStorage({
    destination :(req,file,cb) =>{
        cb(null,"uploads");
    },
    filename:(req,file,cb) =>{
        const orgName = file.originalname;
        cb(null, `${v4()}-${orgName}`);
    },
});


// file filter to allow only images 

    const fileFilter = (req,file,cb) =>{
        if ( file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"|| file.mimetype === "image/png")    {
        cb(null , true);
    }

    else{
        cb("uploaded file not allowed",false);
    }

    };

    // configure Multer

const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize:1000000,
        files:3
    },
}).array("projects",2);

export default upload;
