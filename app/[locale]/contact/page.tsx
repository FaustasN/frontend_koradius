import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Kelionių Kampas | Contact us',
  description:
    'Leave your questions and contact our team for help with trips, bookings, and travel information.'
};

export default function ContactPage() {
  return <ContactClient/>;
} 