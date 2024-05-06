import mongoose from 'mongoose';
const { Schema } = mongoose;

const postgresAuditSchema = new Schema({
    timestamp: Date,
    user: String,
    database: String,
    field01: String,
    clientIP: String,
    field02: String,
    field03: String,
    operation: String,
    field04: String,
    field05: String,
    field06: String,
    field07: String,
    field08: String,
    field09: String,
    field10: String,
    field11: String,
    field12: String,
    field13: String,
    field14: String,
    field15: String,
    field16: String,
    field17: String,
    clientName: String,
    field18: String,
    field19: String,
    field20: String
});

const PostgresAudit = mongoose.model('PostgresAudit', postgresAuditSchema);
export default PostgresAudit
