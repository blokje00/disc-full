import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import '../styles/UserMenu.css';

const UserMenu = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
      setShowMenu(false);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Er is een fout opgetreden bij het uitloggen. Probeer het opnieuw.');
    }
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowMenu(false);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="user-menu-container">
      {isAuthenticated ? (
        <>
          <button className="user-button" onClick={toggleMenu}>
            <img 
              src={currentUser.photoURL || '/icons/user-icon.png'} 
              alt="User" 
              className="user-avatar" 
            />
            <span className="user-name">{currentUser.displayName || 'Gebruiker'}</span>
          </button>

          {showMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <img 
                  src={currentUser.photoURL || '/icons/user-icon.png'} 
                  alt="User" 
                  className="user-avatar-large" 
                />
                <div>
                  <p className="user-display-name">{currentUser.displayName || 'Gebruiker'}</p>
                  <p className="user-email">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <button className="dropdown-item" onClick={handleLogout}>
                Uitloggen
              </button>
              
              {error && <p className="dropdown-error">{error}</p>}
            </div>
          )}
        </>
      ) : (
        <button className="login-button" onClick={openLoginModal}>
          Inloggen
        </button>
      )}

      {showLoginModal && (
        <div className="login-modal" onClick={closeLoginModal}>
          <div onClick={e => e.stopPropagation()}>
            <Login onClose={closeLoginModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
