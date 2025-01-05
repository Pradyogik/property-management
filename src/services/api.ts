import axios from 'axios';
const API_BASE_URL = 'https://bida-new-db.vercel.app';




interface Property {
  id: number;
  schemeName: string;
  propertyCategory: string;
  allotteName: string;
  fatherHusbandName: string;
  permanentAddress: string;
  currentAddress: string;
  mobileNumber: string;
  propertyNumber: number;
  registrationAmount?: number;
  registrationDate?: string;
  allotmentAmount?: number;
  allotmentDate?: string;
  salePrice?: number;
  freeholdAmount?: number;
  leaseRentAmount?: number;
  parkCharge?: number;
  cornerCharge?: number;
  remainingSalePriceLumpSum?: number;
  remainingSalePriceInstallment?: number;
  interestAmount?: number;
  remainingInstallmentDate?: string;
  areaSquareMeter?: number;
  possessionDate?: string;
  additionalLandAmount?: number;
  restorationCharges?: number;
  certificateCharges?: number;
  registrationCharges?: number;
  registrationDate2?: string;
  transferName?: string;
  transferorFatherHusbandName?: string;
  transferorAddress?: string;
  inheritance?: string;
  transferCharges?: number;
  documentationCharges?: number;
  transferDate?: string;
  buildingPlanApprovalDate?: string;
  buildingConstruction?: string;
  depositDateReceiptNumber?: string;
  changeFee?: number;
  advertisementFee?: number;
  installments?: {
    installment_date: string;
    delayed_interest_amount: number;
    installment_interest_amount: number;
    installment_payment_amount: number;
  }[];
  service_charges?: {
    service_charges_date: string;
    service_charges_late_fee: number;
    service_charge_amount: number;
    service_charge_financial_year: string;
  }[];
}

export async function getProperties(): Promise<Property[]> {
  console.log('Fetching properties from API...');
  try {
    const response = await axios.get(`${API_BASE_URL}/property`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API Response:', response.status, response.data);

    // Extract and validate the data
    const properties = response.data?.data || [];
    console.log('Extracted properties:', properties);

    // Ensure the result is an array of properties
    return Array.isArray(properties) ? properties : [];
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
}



export async function addProperty(propertyData: any) {
  try {
    console.log( "api post data before", propertyData);
    const response = await fetch(`${API_BASE_URL}/property`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: propertyData,
      body: JSON.stringify(propertyData),
      
    });
    console.log( "api post data", propertyData);

    if (!response.ok) {
      console.log( "api post data if response not present", propertyData);
      throw new Error(`HTTP error! status: ${response.status}`);

    }

    return await response.json();
  } catch (error) {
    console.error('Error adding property: error in catch block', error);
    console.log( "api post data in catch block", propertyData);
    throw error;
  }
}
