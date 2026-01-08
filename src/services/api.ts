import type { InvestmentItem } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Convert MongoDB _id to id for frontend compatibility
const normalizeItem = (item: any): InvestmentItem => {
    if (item._id && !item.id) {
        item.id = item._id;
    }
    return item;
};

const normalizeItems = (items: any[]): InvestmentItem[] => {
    return items.map(normalizeItem);
};

// Helper function for fetch requests
const fetchWithError = async (url: string, options?: RequestInit) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// Get all investment items grouped by status
export const getAllItems = async (): Promise<{
    followUp: InvestmentItem[];
    executed: InvestmentItem[];
    closed: InvestmentItem[];
    archive: InvestmentItem[];
}> => {
    const data = await fetchWithError(`${API_BASE_URL}/investments`);
    return {
        followUp: normalizeItems(data.followUp || []),
        executed: normalizeItems(data.executed || []),
        closed: normalizeItems(data.closed || []),
        archive: normalizeItems(data.archive || [])
    };
};

// Get single item by ID
export const getItemById = async (id: string): Promise<InvestmentItem> => {
    const item = await fetchWithError(`${API_BASE_URL}/investments/${id}`);
    return normalizeItem(item);
};

// Create new investment item
export const createItem = async (item: Omit<InvestmentItem, 'id' | 'creationDate' | 'status'>): Promise<InvestmentItem> => {
    const created = await fetchWithError(`${API_BASE_URL}/investments`, {
        method: 'POST',
        body: JSON.stringify(item),
    });
    return normalizeItem(created);
};

// Update investment item
export const updateItem = async (id: string, item: Partial<InvestmentItem>): Promise<InvestmentItem> => {
    const updated = await fetchWithError(`${API_BASE_URL}/investments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(item),
    });
    return normalizeItem(updated);
};

// Update item status (for drag and drop)
export const updateItemStatus = async (id: string, status: InvestmentItem['status']): Promise<InvestmentItem> => {
    const updated = await fetchWithError(`${API_BASE_URL}/investments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    });
    return normalizeItem(updated);
};

// Delete investment item
export const deleteItem = async (id: string): Promise<{ message: string; id: string }> => {
    return fetchWithError(`${API_BASE_URL}/investments/${id}`, {
        method: 'DELETE',
    });
};

// Health check
export const checkHealth = async (): Promise<{ status: string; message: string }> => {
    return fetchWithError(`${API_BASE_URL}/health`);
};
