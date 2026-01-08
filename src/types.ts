export interface AnalysisPoint {
    headline: string;
    description: string;
}

export interface InvestmentItem {
    _id?: string; // MongoDB ID
    id: string;
    instrument: string;
    analysisPoints: AnalysisPoint[];
    followUpDate: string;
    followUpTime: string;
    image: string | null;
    creationDate: string;
    status: 'followUp' | 'executed' | 'closed' | 'archive';
    
    // Execution-specific fields (filled when moved to executed)
    executedDate?: string;
    openPrice?: string;
    openReason?: string;
    executedFollowUpDate?: string;
    executedFollowUpTime?: string;
    executedImage?: string | null;
    executedAnalysis?: AnalysisPoint[];
    
    // Closed-specific fields (filled when moved to closed)
    closedDate?: string;
    closePrice?: string;
    closeReason?: string;
    closedImage?: string | null;
    closedAnalysis?: AnalysisPoint[];
}
