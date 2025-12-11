/**
 * Home Page Component
 * Displays channel list and creation form
 */
import React from 'react';
import ChannelList from '../components/ChannelList';

export default function Home() {
  return (
    <div className="home-page">
      <ChannelList />
    </div>
  );
}
