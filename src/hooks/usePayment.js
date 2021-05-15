import { useState } from 'react';

const usePayment = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const hidePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const showPayment = () => {
    setIsPaymentModalOpen(true);
  };

  return { isPaymentModalOpen, hidePaymentModal, showPayment };
};

export { usePayment };
