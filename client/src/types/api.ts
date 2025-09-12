// Types liés aux entités API du projet Mellisync

export interface Apiary {
    id: number;
    name: string;
    address: string;
    city: string;
    location?: string; // Pour PDF template
}

export interface Hive {
    id: number;
    name: string;
    type: string;
    framecount: string;
    status: string;
    color: string;
    yearBuilt: string;
    qrCodeDataUrl?: string;
    statusReason?: string;
    statusChangedAt?: string;
    apiary_hives?: Array<{
        apiary?: Apiary;
    }>;
}

// Type pour les ruches créées (subset de Hive)
export type CreatedHive = Pick<Hive, 'id' | 'name' | 'type' | 'color' | 'qrCodeDataUrl'>;

export interface HiveAlert extends Pick<Hive, 'id' | 'name'> {
    daysSinceLastVisit?: number;
    apiary_hives?: Array<{
        apiary?: Pick<Apiary, 'id' | 'name'>;
    }>;
}

export interface Visit {
    id: number;
    createdAt: string;
    date: string;
    visitActions: Record<string, unknown>;
    hive?: Hive;
}

// Extension pour PDF Template
export interface VisitWithDetails extends Omit<Visit, 'visitActions' | 'hive'> {
    hive: {
        id: number;
        name: string;
        apiary?: {
            name: string;
            location: string;
        };
    };
    visitActions: Array<{
        id: number;
        value: string;
        action: {
            id: number;
            name: string;
            actionType: 'CYCLE' | 'INCREMENT';
            description?: string;
        };
    }>;
}

export interface Transhumance {
    id: number;
    fromApiaryId: number;
    toApiaryId: number;
    reason: string;
    note: string;
    createdAt: string;
    startDate: string;
    endDate: string;
    fromApiary: Apiary;
    toApiary: Apiary;
    apiary?: Apiary;
}