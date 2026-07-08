import type { Timestamp } from 'firebase/firestore'

export interface RestaurantSeed {
  id: string
  name: string
  address: string
  category: string
  lat: number
  lng: number
}

export interface Restaurant extends RestaurantSeed {
  reviewCount: number
  ratingSum: number
  ratingAvg: number
  createdAt?: Timestamp
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  text: string
  photoUrl: string | null
  createdAt?: Timestamp
}
