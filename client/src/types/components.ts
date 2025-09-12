// Types pour les composants réutilisables

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface AddressSuggestion {
    display_name: string;
    clean_address: string;
    latitude: number;
    longitude: number;
}