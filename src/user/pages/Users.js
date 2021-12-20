import React from 'react';
import UsersList from '../components/UsersList';

const USERS = [
  {
    id: 'u1',
    name: 'Ali',
    places: 3,
    image:
      'https://image.freepik.com/free-photo/young-handsome-man-listens-music-with-earphones_176420-15616.jpg',
  },
];

export default function Users() {
  return <UsersList items={USERS} />;
}
