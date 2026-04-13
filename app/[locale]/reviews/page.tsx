import type { Metadata } from 'next';
import ReviewsClient from './ReviewsClient';

export const metadata: Metadata = {
  title: 'Koradius Travel | Reviews',
  description:
    'Read customer reviews about our trips and services, and share your own experience with Koradius Travel.'
};

export default function ReviewPage() {
  return <ReviewsClient/>;
}