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

/**
* Route handler for uploading a file. The file is uploaded to AWS S3 and its URL is stored in the database.
* The file is associated with the user who uploaded it. Requires authentication.
* 
* @param {Object} req - The HTTP request object. The file to be uploaded is expected in 'req.file'.
* @param {Object} res - The HTTP response object used for sending back the status of the upload and the updated user data.
* 
* The route uses 'auth' middleware for authentication and 'upload.single('file')' middleware for handling file uploads.
* 
* On successful upload, the file's URL is saved in the database and associated with the user. The updated user data is then returned.
* If no file is provided, a 400 bad request response is sent. Errors during file upload or database operations result in appropriate error responses.
*/
router.post('', auth, upload.single('file'), async (req, res) => {
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
                return User.findByIdAndUpdate(userId, { $push: { images: savedImage._id } }, { new: true })

            }).then(updatedUser => {
                updatedUser.password = undefined;
                res.status(201).json(updatedUser);
            }).catch((error) => {
                res.status(400).json({ message: error.message });
            })

        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
* Route handler for deleting an image. The image is deleted from AWS S3 and its reference is removed from the database.
* The image is identified by its ID provided in the route parameters. Requires authentication.
* 
* @param {Object} req - The HTTP request object. The image ID to be deleted is expected in 'req.params.imageId'.
* @param {Object} res - The HTTP response object used for sending back the status of the deletion.
* 
* The route uses 'auth' middleware for authentication.
* 
* On successful deletion, the image is removed from AWS S3 and its reference is deleted from the database.
* If the image is not found, a 404 not found response is sent. Errors during deletion from S3 or database operations result in appropriate error responses.
*/
router.delete('/:imageId', auth, async (req, res) => {
    try {
        const imageId = req.params.imageId;
        const userId = req.user._id;

        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).send('Image not found.');
        }

        const filename = image.url.split('/').pop();

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename
        };

        s3.deleteObject(params, async (err, data) => {
            if (err) {
                console.error('Error deleting from S3:', err);
                return res.status(500).send('Error deleting from S3');
            }

            await Image.findByIdAndDelete(imageId);

            await User.findByIdAndUpdate(userId, { $pull: { images: imageId } });

            res.status(200).send('Image successfully deleted');
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
* Route handler for retrieving a specific image by its ID. The image ID is provided in the route parameters.
* 
* @param {Object} req - The HTTP request object. The image ID to be retrieved is expected in 'req.params.imageId'.
* @param {Object} res - The HTTP response object used for sending back the requested image or an error message.
* 
* On successful retrieval, the image data is returned. If the image is not found, a 404 not found response is sent.
* Errors during the retrieval process result in a 500 internal server error response.
*/
router.get('/:imageId', async (req, res) => {
    try {
        const imageId = req.params.imageId;

        const image = await Image.findById(imageId);
        if (!image) {
            return res.status(404).send('Image not found.');
        }

        res.status(200).json(image);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;