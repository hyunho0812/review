import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from '../firebase/config'
import type { Restaurant, RestaurantSeed, Review } from '../types/models'

export async function ensureRestaurant(place: RestaurantSeed): Promise<void> {
  const restaurantRef = doc(db, 'restaurants', place.id)
  const snap = await getDoc(restaurantRef)
  if (snap.exists()) return

  await setDoc(restaurantRef, {
    name: place.name,
    address: place.address,
    category: place.category,
    lat: place.lat,
    lng: place.lng,
    reviewCount: 0,
    ratingSum: 0,
    ratingAvg: 0,
    createdAt: serverTimestamp(),
  })
}

export function subscribeRestaurant(
  restaurantId: string,
  onChange: (restaurant: Restaurant | null) => void
) {
  return onSnapshot(doc(db, 'restaurants', restaurantId), (snap) => {
    onChange(snap.exists() ? ({ id: snap.id, ...snap.data() } as Restaurant) : null)
  })
}

export function subscribeReviews(restaurantId: string, onChange: (reviews: Review[]) => void) {
  const reviewsQuery = query(
    collection(db, 'restaurants', restaurantId, 'reviews'),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(reviewsQuery, (snap) => {
    onChange(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Review))
  })
}

interface AddReviewInput {
  userId: string
  userName: string
  rating: number
  text: string
  photoFile?: File | null
}

export async function addReview(restaurantId: string, input: AddReviewInput): Promise<void> {
  let photoUrl: string | null = null

  if (input.photoFile) {
    const path = `reviews/${restaurantId}/${Date.now()}_${input.photoFile.name}`
    const photoRef = ref(storage, path)
    await uploadBytes(photoRef, input.photoFile)
    photoUrl = await getDownloadURL(photoRef)
  }

  const restaurantRef = doc(db, 'restaurants', restaurantId)
  const reviewRef = doc(collection(db, 'restaurants', restaurantId, 'reviews'))

  await runTransaction(db, async (tx) => {
    const restaurantSnap = await tx.get(restaurantRef)
    const prevCount = restaurantSnap.exists() ? (restaurantSnap.data().reviewCount ?? 0) : 0
    const prevSum = restaurantSnap.exists() ? (restaurantSnap.data().ratingSum ?? 0) : 0
    const newCount = prevCount + 1
    const newSum = prevSum + input.rating

    tx.set(reviewRef, {
      userId: input.userId,
      userName: input.userName,
      rating: input.rating,
      text: input.text,
      photoUrl,
      createdAt: serverTimestamp(),
    })

    tx.set(
      restaurantRef,
      {
        reviewCount: newCount,
        ratingSum: newSum,
        ratingAvg: newSum / newCount,
      },
      { merge: true }
    )
  })
}
