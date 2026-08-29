export interface City {
  id: string
  name: string
  country: string
  timeZone: string
  lat: number
  code: string 
  lng: number
}
export const CITIES: City[] = [
  { id: "london", name: "London", country: "United Kingdom", timeZone: "Europe/London", lat: 51.5074, lng: -0.1278, code: "gb" },
  { id: "new-york", name: "New York", country: "United States", timeZone: "America/New_York", lat: 40.7128, lng: -74.006, code: "us" },
  { id: "los-angeles", name: "Los Angeles", country: "United States", timeZone: "America/Los_Angeles", lat: 34.0522, lng: -118.2437, code: "us" },
  { id: "tokyo", name: "Tokyo", country: "Japan", timeZone: "Asia/Tokyo", lat: 35.6762, lng: 139.6503, code: "jp" },
  { id: "paris", name: "Paris", country: "France", timeZone: "Europe/Paris", lat: 48.8566, lng: 2.3522, code: "fr" },
  { id: "sydney", name: "Sydney", country: "Australia", timeZone: "Australia/Sydney", lat: -33.8688, lng: 151.2093, code: "au" },
  { id: "dubai", name: "Dubai", country: "UAE", timeZone: "Asia/Dubai", lat: 25.2048, lng: 55.2708, code: "ae" },
  { id: "singapore", name: "Singapore", country: "Singapore", timeZone: "Asia/Singapore", lat: 1.3521, lng: 103.8198, code: "sg" },
  { id: "san-francisco", name: "San Francisco", country: "United States", timeZone: "America/Los_Angeles", lat: 37.7749, lng: -122.4194, code: "us" },
  { id: "berlin", name: "Berlin", country: "Germany", timeZone: "Europe/Berlin", lat: 52.52, lng: 13.405, code: "de" },
  { id: "mumbai", name: "Mumbai", country: "India", timeZone: "Asia/Kolkata", lat: 19.076, lng: 72.8777, code: "in" },
  { id: "toronto", name: "Toronto", country: "Canada", timeZone: "America/Toronto", lat: 43.6532, lng: -79.3832, code: "ca" },
  { id: "hong-kong", name: "Hong Kong", country: "Hong Kong", timeZone: "Asia/Hong_Kong", lat: 22.3193, lng: 114.1694, code: "hk" },
  { id: "sao-paulo", name: "São Paulo", country: "Brazil", timeZone: "America/Sao_Paulo", lat: -23.5505, lng: -46.6333, code: "br" },
  { id: "moscow", name: "Moscow", country: "Russia", timeZone: "Europe/Moscow", lat: 55.7558, lng: 37.6173, code: "ru" },
  { id: "cape-town", name: "Cape Town", country: "South Africa", timeZone: "Africa/Johannesburg", lat: -33.9249, lng: 18.4241, code: "za" },
]

export function flagUrl(code: string, size: 24 | 40 | 80 = 40) {
  return `https://flagcdn.com/w${size}/${code}.png`
}

export function findCity(id: string) {
  return CITIES.find((c) => c.id === id)
}

/** lat/lng -> percentage position on an equirectangular map div */
export function projectToPercent(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 100
  const y = ((90 - lat) / 180) * 100
  return { x, y }
}
