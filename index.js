import aws from 'aws-sdk';
const s3 = new aws.S3();

(async () => {
    await s3.putObject({
        Bucket: 'campusoul',
        Key: 'my-file.txt',
        Body: 'Hello World!'
    }).promise();
})();