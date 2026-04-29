import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Kelionių Kampas | Gallery',
  description:
    'View trip photos shared by our customers and explore memorable moments from their travels.'
};

export default function GalleryPage() {
  return <GalleryClient/>;
}