import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysisPoint {
    headline: string;
    description: string;
}

export interface IInvestmentItem extends Document {
    instrument: string;
    analysisPoints: IAnalysisPoint[];
    followUpDate: string;
    followUpTime: string;
    image: string | null;
    creationDate: string;
    status: 'followUp' | 'executed' | 'closed' | 'archive';
    
    // Execution-specific fields
    executedDate?: string;
    openPrice?: string;
    openReason?: string;
    executedFollowUpDate?: string;
    executedFollowUpTime?: string;
    executedImage?: string | null;
    executedAnalysis?: IAnalysisPoint[];
    
    // Closed-specific fields
    closedDate?: string;
    closePrice?: string;
    closeReason?: string;
    closedImage?: string | null;
    closedAnalysis?: IAnalysisPoint[];
}

const AnalysisPointSchema = new Schema({
    headline: { type: String, required: true },
    description: { type: String, required: true }
}, { _id: false });

const InvestmentItemSchema = new Schema<IInvestmentItem>({
    instrument: { type: String, required: true },
    analysisPoints: { type: [AnalysisPointSchema], required: true },
    followUpDate: { type: String, default: '' },
    followUpTime: { type: String, default: '' },
    image: { type: String, default: null },
    creationDate: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['followUp', 'executed', 'closed', 'archive'],
        default: 'followUp'
    },
    
    // Execution-specific fields
    executedDate: { type: String },
    openPrice: { type: String },
    openReason: { type: String },
    executedFollowUpDate: { type: String },
    executedFollowUpTime: { type: String },
    executedImage: { type: String },
    executedAnalysis: { type: [AnalysisPointSchema] },
    
    // Closed-specific fields
    closedDate: { type: String },
    closePrice: { type: String },
    closeReason: { type: String },
    closedImage: { type: String },
    closedAnalysis: { type: [AnalysisPointSchema] }
}, {
    timestamps: true
});

export default mongoose.model<IInvestmentItem>('InvestmentItem', InvestmentItemSchema);
