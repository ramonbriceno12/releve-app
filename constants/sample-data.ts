// FILE: constants/sample-data.ts
import type { Venue } from '@/components/VenueCard';

export const featured: Venue[] = [
    { id: '1', title: "Billy's at the Beach", city: 'Caracas', price: 200, image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1200', category: 'Restaurante' },
    { id: '2', title: 'Kokomo Restaurant', city: 'Caracas', price: 180, image: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=1200', category: 'Restaurante' },
];

export const venues: Venue[] = [
    { id: '3', title: 'Amstel x Libertadores', city: 'Caracas', price: 901, image: 'https://images.unsplash.com/photo-1527169402691-feff5539e52c?q=80&w=1200', category: 'Experiencia' },
    { id: '4', title: 'Savage Smile - Orange', city: 'Caracas', price: 750, image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200', category: 'Belleza' },
    { id: '5', title: 'UPKEEP MEDSPA', city: 'Caracas', price: 400, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1200', category: 'Belleza' },
];

export const myOffers: Venue[] = [
    { id: '6', title: 'Brunch Dominical', city: 'Caracas', price: 120, image: 'https://images.unsplash.com/photo-1553867745-b1c2f5c38d5a?q=80&w=1200', category: 'Restaurante' },
    { id: '7', title: 'Spa Day', city: 'Caracas', price: 300, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=1200', category: 'Belleza' },
];