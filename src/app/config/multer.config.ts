import multer from "multer";
import { cloudinaryUpload } from "./cloudinary.config";
import streamifier from "streamifier"


// // user_post_upload
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryUpload,
//   params: (req, file) => {
//     const fileName = file.originalname
//       .toLowerCase()
//       .replace(/\s+/g, "-")
//       .replace(/\./g, "-")
//       .replace(/[^a-z0-9\-]/g, "");

//     const extension = file.originalname.split(".").pop();

//     return {
//       resource_type: "auto",
//       folder: "posts",
//       upload_preset: "user_post_upload",
//       public_id: `${Math.random().toString(36).substring(2)}-${Date.now()}-${fileName}.${extension}`,
//     };
//   },
// });


// export const multerUpload = multer({
//   storage: storage,


//   limits: {
//     fileSize: 100 * 1024 * 1024
//   }
//   ,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/png",
//       "image/jpeg",
//       "image/jpg",
//       "video/mp4",
//       "video/mov",
//       "video/avi",
//       "image/heic"
//     ];

//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only PNG, JPG, JPEG images are allowed"));
//     }

//   }
// });




const storage = multer.memoryStorage()


export const upload = multer({ storage })


export const uploadToCloudinary = (buffer: Buffer) => {
  return new Promise((resolve, reject) => {

    const stream = cloudinaryUpload.uploader.upload_stream(
      {
        folder: "posts",
        resource_type: "auto"
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    streamifier.createReadStream(buffer).pipe(stream)
  })
}







// export const deleteImageFromCloudinary = async (url: string) => {
//   try {
//     if (!url) return;

//     const urlObj = new URL(url);
//     const pathname = urlObj.pathname; // /demo/image/upload/v1680000000/myimage.jpg
//     const parts = pathname.split("/upload/");

//     if (parts.length < 2) {
//       throw new AppError(400, "Invalid Cloudinary URL");
//     }

//     const publicIdWithVersion = parts[1];

//     if (!publicIdWithVersion) {
//       throw new AppError(400, "Unable to extract publicId from URL");
//     }

//     // Safely extract publicId
//     const publicId = publicIdWithVersion
//       .replace(/v\d+\//, "")
//       .replace(/\.(jpg|jpeg|png|gif|webp|avif)$/i, "");

//     await cloudinary.uploader.destroy(publicId);
//   } catch (error: any) {
//     throw new AppError(401, "Cloudinary image deletion failed", error.message);
//   }
// };