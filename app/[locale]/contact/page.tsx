import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Koradius Travel | Contact us',
  description:
    'In this page you can leave any relevant questions, our team will be glad to help you'
};

export default function ContactPage() {
  return <ContactClient/>;
}