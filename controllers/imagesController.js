import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid'; 
dotenv.config(); 
  
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION    
});  

const s3 = new aws.S3();  
  
const fileFilter = (req, file, cb) => {
    console.log("AWS Secret Access Key:", process.env.AWS_SECRET_ACCESS_KEY);
    console.log("AWS Access Key ID:", process.env.AWS_ACCESS_KEY_ID);
    console.log("AWS Default Region:", process.env.AWS_DEFAULT_REGION);
    console.log("AWS Bucket Name:", process.env.AWS_BUCKET_NAME); 

    console.log("File mimetype:", file.mimetype); 


    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type, only JPG and PNG are allowed!'), false);
    }
};

    
const upload = multer({

    storage: multerS3({
        s3: s3, 
        bucket: process.env.AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE, 
        key: function (req, file, cb) {
            const fileName = uuidv4() + '-' + Date.now() + '.' + file.mimetype.split('/')[1];
            console.log("Generated File Name:", fileName);
            cb(null, fileName);
        }
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

export { upload }
