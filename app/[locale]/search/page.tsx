import type { Metadata } from 'next';
import SearchClient from './SearchClient';

export const metadata: Metadata = {
  title: 'Kelionių Kampas | Novaturas Search',
  description:
    'Browse flight deals from our partner Novaturas and discover convenient travel options for your next trip.'
};

export default function SearchPage() {
  return <SearchClient/>;
}