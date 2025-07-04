import jsPDF from 'jspdf';

interface PaymentCredentials {
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string;
  bic?: string;
  reference: string;
  amount: number;
  currency: string;
  branchAddress?: string;
  instructions?: string;
}

interface CCPCredentials {
  accountName: string;
  ccpNumber: string;
  accountKey: string;
  postOfficeAddress: string;
  reference: string;
  amount: number;
  currency: string;
}

interface CreditCardCredentials {
  processor: string;
  merchantId: string;
  terminalId: string;
  amount: number;
  currency: string;
  reference: string;
  securityNote: string;
}

// Mock credentials until real ones are provided
export const mockBankCredentials: PaymentCredentials = {
  bankName: "Banque d'Algérie",
  accountName: "EURO VISA SERVICES",
  accountNumber: "00400106400013704",
  iban: "DZ58 0040 0106 4000 1370 4854",
  bic: "BADRDZAL",
  reference: "EVS-{CLIENT_ID}-{DATE}",
  amount: 25000,
  currency: "DZD",
  branchAddress: "Agence CPA Blida, 1er Novembre, Place du 1er Novembre",
  instructions: "Veuillez mentionner votre référence dans le libellé du virement"
};

export const mockCCPCredentials: CCPCredentials = {
  accountName: "SEKHRI LYES",
  ccpNumber: "0040010640001370454",
  accountKey: "54",
  postOfficeAddress: "Agence CPA Blida - 1er Novembre, Place du 1er Novembre",
  reference: "EVS-{CLIENT_ID}-{DATE}",
  amount: 25000,
  currency: "DZD"
};

export const mockCreditCardCredentials: CreditCardCredentials = {
  processor: "CIB (Crédit Populaire d'Algérie)",
  merchantId: "TRWIBEB1050",
  terminalId: "16001",
  amount: 250,
  currency: "CAD",
  reference: "EVS-{CLIENT_ID}-{DATE}",
  securityNote: "Paiement sécurisé via terminal POS agréé"
};

export const generatePaymentCredentialsPDF = async (
  paymentMethod: 'bank' | 'ccp' | 'card',
  clientName: string,
  clientId: string,
  applicationId?: string,
  serviceId?: string
): Promise<void> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const currentDate = new Date().toLocaleDateString('fr-FR');
  const reference = `EVS-${clientId.substring(0, 8)}-${Date.now().toString().slice(-6)}`;

  // Header with company logo and info
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("EURO VISA SERVICES", 20, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Entreprise de Travaux de Secrétariat et Consulting", 20, 32);

  // Company details in header
  doc.setFontSize(8);
  doc.text("Cité Fettel Beni Merad N°23, Blida, Algérie", pageWidth - 20, 15, { align: 'right' });
  doc.text("Tél: 0540132817 / 0639594448", pageWidth - 20, 20, { align: 'right' });
  doc.text("Email: eurovisa04@gmail.com", pageWidth - 20, 25, { align: 'right' });
  doc.text("Instagram: @eurovisa00", pageWidth - 20, 30, { align: 'right' });

  // Reset text color for body
  doc.setTextColor(0, 0, 0);
  
  // Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("FACTURE D'ENGAGEMENT", pageWidth / 2, 60, { align: 'center' });

  // Client information
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("INFORMATIONS CLIENT", 20, 80);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Nom du client: ${clientName}`, 20, 90);
  doc.text(`Référence client: ${clientId}`, 20, 95);
  doc.text(`Date d'émission: ${currentDate}`, 20, 100);
  doc.text(`Référence de paiement: ${reference}`, 20, 105);

  let yPosition = 125;

  if (paymentMethod === 'bank') {
    // Bank transfer details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DÉTAILS DU VIREMENT BANCAIRE", 20, yPosition);
    yPosition += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const bankDetails = [
      `Banque: ${mockBankCredentials.bankName}`,
      `Titulaire du compte: ${mockBankCredentials.accountName}`,
      `Numéro de compte: ${mockBankCredentials.accountNumber}`,
      `IBAN: ${mockBankCredentials.iban}`,
      `Code BIC: ${mockBankCredentials.bic}`,
      `Adresse de l'agence: ${mockBankCredentials.branchAddress}`,
      `Montant: ${mockBankCredentials.amount.toLocaleString()} ${mockBankCredentials.currency}`,
      `Référence obligatoire: ${reference}`
    ];

    bankDetails.forEach(detail => {
      doc.text(detail, 20, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCTIONS IMPORTANTES:", 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    doc.text("• Veuillez mentionner la référence dans le libellé du virement", 25, yPosition);
    yPosition += 5;
    doc.text("• Conservez votre reçu de virement pour téléversement", 25, yPosition);
    yPosition += 5;
    doc.text("• Le paiement sera vérifié sous 24-48h ouvrables", 25, yPosition);

  } else if (paymentMethod === 'ccp') {
    // CCP details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DÉTAILS DU COMPTE CCP", 20, yPosition);
    yPosition += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const ccpDetails = [
      `Titulaire du compte: ${mockCCPCredentials.accountName}`,
      `Numéro CCP: ${mockCCPCredentials.ccpNumber}`,
      `Clé: ${mockCCPCredentials.accountKey}`,
      `Bureau de poste: ${mockCCPCredentials.postOfficeAddress}`,
      `Montant: ${mockCCPCredentials.amount.toLocaleString()} ${mockCCPCredentials.currency}`,
      `Référence obligatoire: ${reference}`
    ];

    ccpDetails.forEach(detail => {
      doc.text(detail, 20, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCTIONS IMPORTANTES:", 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    doc.text("• Utilisez un mandat CCP ou virement CCP", 25, yPosition);
    yPosition += 5;
    doc.text("• Indiquez obligatoirement la référence dans l'objet", 25, yPosition);
    yPosition += 5;
    doc.text("• Conservez votre reçu CCP pour téléversement", 25, yPosition);

  } else if (paymentMethod === 'card') {
    // Credit card details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DÉTAILS DU PAIEMENT PAR CARTE", 20, yPosition);
    yPosition += 15;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const cardDetails = [
      `Processeur: ${mockCreditCardCredentials.processor}`,
      `ID Marchand: ${mockCreditCardCredentials.merchantId}`,
      `ID Terminal: ${mockCreditCardCredentials.terminalId}`,
      `Montant: ${mockCreditCardCredentials.amount.toLocaleString()} ${mockCreditCardCredentials.currency}`,
      `Référence: ${reference}`,
      `Note de sécurité: ${mockCreditCardCredentials.securityNote}`
    ];

    cardDetails.forEach(detail => {
      doc.text(detail, 20, yPosition);
      yPosition += 7;
    });

    yPosition += 10;
    doc.setFont("helvetica", "bold");
    doc.text("INSTRUCTIONS IMPORTANTES:", 20, yPosition);
    yPosition += 7;
    doc.setFont("helvetica", "normal");
    doc.text("• Paiement sécurisé via terminal agréé uniquement", 25, yPosition);
    yPosition += 5;
    doc.text("• Conservez votre ticket de caisse pour téléversement", 25, yPosition);
    yPosition += 5;
    doc.text("• Vérification immédiate du paiement", 25, yPosition);
  }

  // Footer with important notes
  yPosition = 250;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPosition, pageWidth - 40, 25, 'F');
  
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("IMPORTANT:", 25, yPosition + 5);
  doc.setFont("helvetica", "normal");
  doc.text("• Ce document constitue une facture d'engagement", 25, yPosition + 10);
  doc.text("• Le paiement doit être effectué dans les 7 jours suivant l'émission", 25, yPosition + 15);
  doc.text("• Tout retard peut entraîner l'annulation de votre dossier", 25, yPosition + 20);

  // Save the PDF
  const fileName = `Facture_Engagement_${paymentMethod.toUpperCase()}_${reference}.pdf`;
  doc.save(fileName);
};