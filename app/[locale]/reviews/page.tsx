import type { Metadata } from 'next';
import ReviewsClient from './ReviewsClient';

export const metadata: Metadata = {
  title: 'Kelionių Kampas | Reviews',
  description:
    'Read customer reviews about our trips and services, and share your own experience with Kelionių Kampas.'
};

export default function ReviewPage() {
  return <ReviewsClient/>;
}