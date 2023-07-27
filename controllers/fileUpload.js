const File = require("../models/File");
const path = require("path");
const cloudinary = require('cloudinary').v2;

// Function to move a file locally on the server
exports.localFileUpload = async (req, res) => {
    try {
        // File fetch
        const file = req.files.file;
        console.log("File -> ", file);

        // __dirname means your current working directory
        let filePath = path.join(__dirname, "files", `${Date.now()}.${file.name.split(".")[1]}`);
        console.log("Path => ", filePath);

        // Move function to move the file to that path
        file.mv(filePath, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload the file on the server",
                });
            }

            res.json({
                success: true,
                message: "Local File uploaded successfully!!!",
            });
        });
    } catch (error) {
        console.log("Not able to upload the file on the server");
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to upload the file on the server",
        });
    }
};

// Function to upload a file to Cloudinary
async function uploadFileToCloudinary(file, folder, quality) {
    const options = {folder};
    console.log("temp file path", file.tempFilePath);

    if(quality) {
        options.quality = quality;
    }

    options.resource_type = "auto"; // read documantation
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

// Handler for uploading an image to Cloudinary
exports.imageUpload = async (req, res) => {
    try {
        // Step 1: Fetch data
        const { name, tags, email } = req.body;
        console.log(name, tags, email);

        // Step 2: Validation

        // Check if the required fields exist
        if (!name || !tags || !email) {
            return res.status(400).json({
                success: false,
                message: "Name, tags, and email are required fields.",
            });
        }

        const file = req.files.imageFile;
        console.log(file);

        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);
        
        // If file format not supported
        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        // If file format is supported
        console.log("Uploading to mathur");
        const response = await uploadFileToCloudinary(file, "MATHUR"); // mathur is the name of the folder inside the Cloudinary media library
        console.log(response);

        // Save the entry in the database 
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success: true,
            imageUrl:response.secure_url,
            message: "Image Successfully Uploaded!!",
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}

// Handler for uploading an image to Cloudinary

exports.videoUpload = async (req,res) => {
    try{
        const { name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.videoFile;
        
        // validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        // IF FILE FORMAT IS SUPPORTED
        console.log("Uploading to MATHUR");
        const response = await uploadFileToCloudinary(file, "MATHUR");
        console.log(response);

        //db me entry save krni h
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Video Successfully Uploaded',
        })

    }
    catch(err){
        console.error(err);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })

    }
}

// image size Reducer - IMAGE COMPRESSOR

exports.imageSizeReducer = async (req,res) => {
    try{
        //data fetch
        const { name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        // if file format is supported
        console.log("Uploading to MATHUR");
        // height can also be compressed -> read documantation for more
        const response = await uploadFileToCloudinary(file, "MATHUR", 90); // adding one more attribute "quality" (90%) here to compress the image
        console.log(response);

        //db me entry save krni h
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image Successfully Uploaded',
        })
    }

    catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        })
    }
}


// Function to check if supported type exists in the filetype
// using includes() function
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}
