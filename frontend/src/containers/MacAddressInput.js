import React, { useState } from 'react';

const MacAddressInput = ({ value, onChange, labelTitle, labelStyle, containerStyle }) => {
    const [formattedValue, setFormattedValue] = useState(value);

    // Fonction pour formater et valider l'adresse MAC
    const formatMacAddress = (input) => {
        // Supprimer tous les caractères non valides
        const formattedInput = input.replace(/[^0-9A-Fa-f]/g, '');
      
        // Insérer automatiquement des deux-points (:) aux positions appropriées
        let formattedMac = '';
        for (let i = 0; i < formattedInput.length; i++) {
          if (i > 0 && i % 2 === 0) {
            formattedMac += ':';
          }
          formattedMac += formattedInput[i];
        }
      
        return formattedMac.toUpperCase();
      };
      


    const handleChange = (e) => {
        const inputValue = e.target.value;
        const formattedMac = formatMacAddress(inputValue);
        // Limit the input to the length of a MAC address (17 characters)
        if (formattedMac.length <= 17) {
            setFormattedValue(formattedMac);
            onChange(formattedMac);
        }
    };

    return (
        <div className={`form-control w-full ${containerStyle}`}>
            <label className="label">
                <span className={`label-text text-base-content ${labelStyle}`}>{labelTitle}</span>
            </label>
            <input
                type="text"
                value={formattedValue}
                onChange={handleChange}
                placeholder="00:00:00:00:00:00" // Placeholder pour montrer le format attendu
                className="input input-bordered w-full"
            />
        </div>
    );
};

export default MacAddressInput;
