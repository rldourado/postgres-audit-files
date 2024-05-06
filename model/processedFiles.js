import mongoose from 'mongoose';
const { Schema } = mongoose;

const processedFilesSchema = new Schema({
    filePath: String,
});

const ProcessedFiles = mongoose.model('ProcessedFiles', processedFilesSchema);
export default ProcessedFiles
