import {
    S3Client,
    PutObjectCommand,
    HeadObjectCommand,
    HeadBucketCommand,
    CreateBucketCommand,
    PutBucketPolicyCommand
} from "@aws-sdk/client-s3";
import crypto from 'crypto';

const s3_client = new S3Client({
    region: process.env.S3_REGION || 'eu-west-3',
    endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
    forcePathStyle: true,
    credentials: {
        accessKeyId: process.env.S3_ROOT_USER || '',
        secretAccessKey: process.env.S3_ROOT_PASSWORD || ''
    }
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'mfdb-bucket';

interface UploadResponse {
    file_key: string;
    hash: string;
    public_url: string;
}

export class StorageService {

    private async ensureBucketExists(): Promise<void> {
        try {
            await s3_client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        } catch (error: any) {
            if (error.$metadata?.httpStatusCode === 404) {
                console.log(`Storage Service: Bucket '${BUCKET_NAME}' not found. Creating it...`);

                try {
                    await s3_client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));

                    const public_policy = {
                        Version: "2012-10-17",
                        Statement: [
                            {
                                Sid: "PublicReadGetObject",
                                Effect: "Allow",
                                Principal: "*",
                                Action: ["s3:GetObject"],
                                Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`]
                            }
                        ]
                    };

                    await s3_client.send(new PutBucketPolicyCommand({
                        Bucket: BUCKET_NAME,
                        Policy: JSON.stringify(public_policy)
                    }));

                    console.log(`Storage Service: Bucket '${BUCKET_NAME}' created successfully.`);
                } catch (creation_error) {
                    console.error('Storage Service: Failed to create bucket', creation_error);
                    throw creation_error;
                }
            } else {
                throw error;
            }
        }
    }


    async uploadFile(file_buffer: Buffer, mime_type: string, folder: string = 'uploads'): Promise<UploadResponse> {
        await this.ensureBucketExists();

        //ex: image/png => png
        const file_extension = mime_type.split('/')[1];

        //ex: f5ffd268106b8589e379355afc952379bf7b694ac7b8d746cf69eb0a4c9c61db
        const hash = crypto.createHash('sha256').update(file_buffer).digest('hex');

        //ex: figure/f5ffd268106b8589e379355afc952379bf7b694ac7b8d746cf69eb0a4c9c61db.png
        const file_key = `${folder}/${hash}.${file_extension}`;

        const already_exists = await this.fileExists(file_key);

        if (already_exists) {
            console.log(`Storage Service: File ${file_key} already exists. Skipping upload.`);

            return {
                file_key: file_key,
                hash: hash,
                public_url: StorageService.getPublicUrl(hash, file_extension, folder)
            }
        }

        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: file_key,
            Body: file_buffer,
            ContentType: mime_type
        });

        try {
            await s3_client.send(command);
            console.log(`Storage Service: New file uploaded to ${file_key}`);

            return {
                file_key: file_key,
                hash: hash,
                public_url: StorageService.getPublicUrl(hash, file_extension, folder)
            }

        } catch (error) {
            console.error('Storage Service: Upload failed', error);
            throw new Error('Upload failed');
        }
    }

    private async fileExists(key: string): Promise<boolean> {
        try {
            await s3_client.send(new HeadObjectCommand({
                Bucket: BUCKET_NAME,
                Key: key
            }));
            return true;
        } catch (error) {
            return false;
        }
    }

    static getPublicUrl(hash: string, file_extension: string, folder: string = 'uploads'): string {
        const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000';
        const bucket = process.env.S3_BUCKET_NAME || 'mfdb-bucket';

        return `${endpoint}/${bucket}/${folder}/${hash}.${file_extension}`;
    }
}