import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Koradius Travel | About us',
  description:
    'In this page learn more about Koradius Travel experience, values and travel services.'
};

export default function AboutPage() {
  return <AboutClient />;
}