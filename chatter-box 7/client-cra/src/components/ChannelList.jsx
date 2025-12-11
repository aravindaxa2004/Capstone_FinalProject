import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Components.css';

export default function ChannelList() {
  const [channels, setChannels] = useState([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const navigate = useNavigate();

  // Fetch public channels on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found. Redirecting to /login...");
      navigate("/login");
      return;
    }

    const fetchChannels = async () => {
      try {
        const res = await api.get("/channels/public", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ✅ Unwrap the `data` field and default to empty array
        setChannels(res.data?.data || []);
      } catch (err) {
        console.error("Error fetching public channels:", err);
        if (err.response?.status === 401) navigate("/login");
      }
    };

    fetchChannels();
  }, [navigate]);

  // Create new channel
  const createChannel = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/channels', { name, description: desc });
      // ✅ unwrap backend response
      setChannels([res.data?.data || res.data, ...channels]);
      setName('');
      setDesc('');
    } catch (err) {
      console.error("Failed to create channel:", err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="channel-container">
      <h2 className="channel-title">Public Channels</h2>

      <form className="channel-form" onSubmit={createChannel}>
        <input
          className="channel-form-input"
          required
          placeholder="Channel name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          className="channel-form-input"
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <button className="channel-button" type="submit">Create</button>
      </form>

      <ul className="channel-list">
        {Array.isArray(channels) && channels.length > 0 ? (
          channels.map(ch => (
            <li key={ch._id}>
              <Link to={`/channels/${ch._id}`} className="channel-link">
                {ch.name}
              </Link>
            </li>
          ))
        ) : (
          <li className="text-muted">No channels available.</li>
        )}
      </ul>
    </div>
  );
}