export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: string;
  duration?: string;
  spinProne?: boolean;
}

export interface ClientReview {
  id: string;
  name: string;
  location: string;
  avatarLetter: string;
  colorClass: string;
  rating: number;
  reviewText: string;
  serviceReceived: string;
}

export interface SpinSegment {
  id: number;
  label: string;
  color: string;
  value: string;
}

export interface ConcertItem {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price: string;
  availableTickets: number;
  description: string;
}
