import streamifier from 'streamifier'
import cloudinary from './cloudinary.bucket'

export const uploadToCloudinary = (file: Express.Multer.File) =>
  new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'yawa_reports' },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )

    streamifier.createReadStream(file.buffer).pipe(stream)
  })