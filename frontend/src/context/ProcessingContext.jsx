import { createContext, useContext, useState } from 'react';

const ProcessingContext = createContext();

export const useProcessing = () => {
  const context = useContext(ProcessingContext);
  if (!context) {
    throw new Error('useProcessing must be used within a ProcessingProvider');
  }
  return context;
};

export const ProcessingProvider = ({ children }) => {
  const [processing, setProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');

  return (
    <ProcessingContext.Provider value={{ processing, setProcessing, extractedText, setExtractedText }}>
      {children}
    </ProcessingContext.Provider>
  );
}; 