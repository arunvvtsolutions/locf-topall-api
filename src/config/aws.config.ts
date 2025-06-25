export const awsConfig = {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  fileUrl: process.env.AWS_S3_FILE_URL,
  folders: {
    pdf: process.env.NEXT_PUBLIC_S3_PDF_FOLDER || 'pdf',
    image: process.env.NEXT_PUBLIC_S3_IMAGE_FOLDER || 'image'
  }
};
