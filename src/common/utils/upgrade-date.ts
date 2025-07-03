export function upgradeStartDate(date: string): Date {
    return new Date(`${date}:00:00:00`);
}

export function upgradeEndDate(date: string): Date {
    return new Date(`${date}:23:59:59`);
}
