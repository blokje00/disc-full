import { useState } from 'react';
import { DISC_TYPES } from '../services/constants';
import '../styles/DiscSelector.css';

const DiscSelector = ({ selectedDiscType, onDiscTypeChange }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [infoType, setInfoType] = useState(null);

  const handleInfoClick = (type) => {
    setInfoType(type);
    setShowInfo(true);
  };

  const closeInfo = () => {
    setShowInfo(false);
  };

  return (
    <div className="disc-selector">
      <h2>Kies je DISC persoonlijkheidstype</h2>
      <p className="disc-intro">
        Selecteer het type dat het beste bij jou past voor een gepersonaliseerde coaching ervaring.
      </p>
      
      <div className="disc-types">
        {DISC_TYPES.map(type => (
          <div 
            key={type.id} 
            className={`disc-type ${selectedDiscType.id === type.id ? 'selected' : ''}`}
            style={{ 
              borderColor: type.color,
              backgroundColor: selectedDiscType.id === type.id ? type.color : 'transparent'
            }}
          >
            <div 
              className="disc-color" 
              style={{ backgroundColor: type.color }}
              onClick={() => onDiscTypeChange(type)}
            ></div>
            <div className="disc-info">
              <h3 style={{ color: selectedDiscType.id === type.id ? 'white' : type.color }}>
                {type.label}
              </h3>
              <p style={{ color: selectedDiscType.id === type.id ? 'white' : '#2c2c2c' }}>
                {type.description}
              </p>
              <button 
                className="info-button"
                style={{ 
                  color: selectedDiscType.id === type.id ? 'white' : type.color,
                  borderColor: selectedDiscType.id === type.id ? 'white' : type.color
                }}
                onClick={() => handleInfoClick(type)}
              >
                Meer info
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {showInfo && infoType && (
        <div className="disc-modal-overlay" onClick={closeInfo}>
          <div className="disc-modal" onClick={e => e.stopPropagation()}>
            <button className="close-button" onClick={closeInfo}>×</button>
            <h3 style={{ color: infoType.color }}>{infoType.label}</h3>
            <div className="disc-characteristics">
              <h4>Kenmerken:</h4>
              <ul>
                {getDiscCharacteristics(infoType.id).map((trait, index) => (
                  <li key={index}>{trait}</li>
                ))}
              </ul>
            </div>
            <div className="disc-coaching-style">
              <h4>Coaching stijl:</h4>
              <p>{getDiscCoachingStyle(infoType.id)}</p>
            </div>
            <button 
              className="select-button"
              style={{ backgroundColor: infoType.color }}
              onClick={() => {
                onDiscTypeChange(infoType);
                closeInfo();
              }}
            >
              Kies dit type
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions for DISC characteristics and coaching styles
const getDiscCharacteristics = (discType) => {
  switch (discType) {
    case 'dominant':
      return [
        'Resultaatgericht en doelgericht',
        'Houdt van uitdagingen en competitie',
        'Direct en to-the-point in communicatie',
        'Neemt snel beslissingen',
        'Houdt van controle en autonomie'
      ];
    case 'influential':
      return [
        'Enthousiast en optimistisch',
        'Sociaal en extravert',
        'Creatief en expressief',
        'Overtuigend en inspirerend',
        'Houdt van plezier en interactie'
      ];
    case 'steady':
      return [
        'Geduldig en betrouwbaar',
        'Teamgericht en ondersteunend',
        'Kalm en evenwichtig',
        'Goede luisteraar',
        'Waardeert harmonie en stabiliteit'
      ];
    case 'conscientious':
      return [
        'Analytisch en nauwkeurig',
        'Gestructureerd en georganiseerd',
        'Houdt van details en feiten',
        'Streeft naar kwaliteit en perfectie',
        'Weloverwogen in besluitvorming'
      ];
    default:
      return [];
  }
};

const getDiscCoachingStyle = (discType) => {
  switch (discType) {
    case 'dominant':
      return 'Je coaching zal direct, efficiënt en resultaatgericht zijn. We focussen op doelen en houden het beknopt, zonder onnodige details. De nadruk ligt op wat je kunt bereiken met de oefeningen.';
    case 'influential':
      return 'Je coaching zal enthousiast, optimistisch en interactief zijn. We houden het luchtig met een vleugje humor en benadrukken hoe de oefeningen je helpen je goed te voelen en te verbinden met anderen.';
    case 'steady':
      return 'Je coaching zal geduldig, ondersteunend en geruststellend zijn. We nemen de tijd, creëren een veilige ruimte en benadrukken hoe de oefeningen je helpen balans en harmonie te vinden.';
    case 'conscientious':
      return 'Je coaching zal gestructureerd, gedetailleerd en onderbouwd zijn. We geven duidelijke stappen, leggen uit waarom technieken werken en benadrukken de wetenschappelijke onderbouwing van mindfulness.';
    default:
      return '';
  }
};

export default DiscSelector;
