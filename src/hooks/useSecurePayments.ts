
// This file is deprecated - secure payments functionality has been removed
// Use the regular payments functionality in usePayments.ts instead

export const useSecurePayments = () => {
  console.warn('useSecurePayments is deprecated. Use usePayments instead.');
  return {
    securePayments: [],
    verificationHistory: [],
    isLoading: false,
    error: null,
    createPayment: () => {},
    isCreatingPayment: false,
    uploadReceipt: () => {},
    isUploadingReceipt: false,
  };
};
