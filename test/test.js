import fs from 'fs';
import aws from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION
});

const s3 = new aws.S3();

const fileName = 'test/image.png';
const maxFileSize = 5 * 1024 * 1024; // 5 MB

fs.readFile(fileName, (err, data) => {
    if (err) throw err;

    if (data.length > maxFileSize) {
        console.error("Erreur : La taille du fichier dépasse la limite autorisée.");
        return;
    }

    const validExtensions = ['.jpg', '.jpeg', '.png']; 
    if (!validExtensions.some(ext => fileName.endsWith(ext))) {
        console.error("Erreur : Le type de fichier n'est pas autorisé.");
        return;
    }

    const params = {
        Bucket: 'campusoul', 
        Key: 'image.jpg', 
        Body: data,
        ContentType: 'image/jpeg' 
    };

    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err;
        console.log(`Image uploaded successfully at ${data.Location}`);
    });
});
