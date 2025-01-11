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


export const addProperty = async (formData: FormData) => {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}:`, value , "api log fd data");
  }
  try {
    const response = await axios.post(`${API_BASE_URL}/property`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
    return response.data;
  } catch (error: any) {
    console.error('API Error api catch block:', error);
    if (error.response) {
      // console.error('Error status:', error.response.status);
      console.error('Error data in api catch block:', error.response);
    }
    throw error;
  }
};

export async function updateProperty(propertyId, propertyData) {
  try {
    console.log(propertyData, propertyId, 'Data before sending to backend');

    const response = await axios.put(`${API_BASE_URL}/property/${propertyId}`, propertyData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log('Property updated successfully:', response.data);
      return response.data; // Return response if needed
    } else {
      console.error('Unexpected response status:', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updating property:', error);
    console.log('Data sent to backend:', propertyData);
    throw error; // Re-throw error to handle in the calling function
  }
}




// export async function addProperty(propertyData: any) {
//   try {
//     console.log( "api post data before", propertyData);
//     const response = await fetch(`${API_BASE_URL}/property`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       // body: propertyData,
//       body: JSON.stringify(propertyData),
      
//     });
//     console.log( "api post data", propertyData);

//     if (!response.ok) {
//       console.log( "api post data if response not present", propertyData);
//       throw new Error(`HTTP error! status: ${response.status}`);

//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error adding property: error in catch block', error);
//     console.log( "api post data in catch block", propertyData);
//     throw error;
//   }
// }

// export const addProperty = async (formData:FormData) => {
//   try {
//     console.log(formData , "formdata in try block");
//     const response = await axios.post(`${API_BASE_URL}/property`, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.log(error , 'error in catch block');
    
//     throw error;
//   }
// };
