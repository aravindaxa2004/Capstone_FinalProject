import { useState } from 'react';
import './CreateChannelModal.css';

const CreateChannelModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Channel name is required');
      return;
    }

    if (name.trim().length < 2) {
      setError('Channel name must be at least 2 characters');
      return;
    }

    setLoading(true);
    try {
      await onCreate({ name: name.trim(), description: description.trim() });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal">
        <div className="modal-header">
          <h2>Create a Channel</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-description">
            Channels are where your team communicates. They're best organized around a topic or project.
          </p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="channelName">
                Channel Name
              </label>
              <div className="channel-name-input">
                <span className="hash-prefix">#</span>
                <input
                  type="text"
                  id="channelName"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="e.g. general, marketing, engineering"
                  maxLength={50}
                  autoFocus
                />
              </div>
              <span className="input-help">Names must be lowercase without spaces.</span>
            </div>

            <div className="form-group">
              <label className="label" htmlFor="channelDescription">
                Description <span className="optional">(optional)</span>
              </label>
              <textarea
                id="channelDescription"
                className="input textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this channel about?"
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !name.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating...
                  </>
                ) : (
                  'Create Channel'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateChannelModal;
