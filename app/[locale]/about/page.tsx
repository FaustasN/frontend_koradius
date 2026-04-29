import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'Kelionių Kampas | About us',
  description:
    'In this page learn more about Kelionių Kampas experience, values and travel services.'
};

export default function AboutPage() {
  return <AboutClient />;
}