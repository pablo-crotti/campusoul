import express from 'express';
import multer from 'multer';
import aws from 'aws-sdk';
import Image from '../models/imageModel.js';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION
});

const s3 = new aws.S3();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/upload', auth, upload.single('file'), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const file = req.file;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uuidv4() + '-' + Date.now() + '.' + file.mimetype.split('/')[1],
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.error('Error uploading to S3:', err);
                return res.status(500).send('Error uploading to S3');
            }
            const url = data.Location;

            const image = new Image({
                url: url
            });

            const userId = req.user._id;

            image.save().then((savedImage) => {
                User.findByIdAndUpdate(userId, { $push: { images: savedImage._id } }, { new: true })
                    .then(updatedUser => {
                        res.status(201).json(updatedUser); 
                    }).catch((error) => {
                        res.status(400).json({ message: error.message });
                    })
            }).catch((error) => {
                res.status(400).json({ message: error.message });
            })

        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;