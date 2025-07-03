import { STATS_RANGE } from 'contracts-green-shop';

export interface IGetStatsUsersData {
    range: STATS_RANGE;
    startDay: Date;
    endDay: Date;
    raw: {
        startDay: string;
        endDay: string;
    };
}
