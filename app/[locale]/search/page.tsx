import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Koradius Travel | Novaturas Search',
  description:
    'In this page you can search through flight deals of our partners Novaturas.'
};

export default function SearchPage() {
  return <SearchClient/>;
}