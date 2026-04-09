import type { Metadata } from 'next';
import GalleryClient from './GalleryClient';

export const metadata: Metadata = {
  title: 'Koradius Travel | Gallery',
  description:
    'In this page you can see trip photos that our customer sent to us.'
};

export default function GalleryPage() {
  return <GalleryClient/>;
}