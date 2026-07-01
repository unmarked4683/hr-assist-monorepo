export enum Location {
  OFFICE = 'Biuro',
  HALL = 'Hala',
}

export const LOCATION_OPTIONS: readonly Location[] = Object.values(Location)

export const getLocationLabel = (location: Location): string => location
