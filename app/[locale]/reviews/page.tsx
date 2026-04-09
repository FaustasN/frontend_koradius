import type { Metadata } from 'next';
import ReviewsClient from './ReviewsClient';

export const metadata: Metadata = {
  title: 'Koradius Travel | Reviews',
  description:
    'In this page you can share expierence about our services, trips.'
};

export default function ReviewPage() {
  return <ReviewsClient/>;
}