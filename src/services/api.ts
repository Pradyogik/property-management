const API_BASE_URL = 'https://bida-new-db.vercel.app';

export async function getProperties() {
  console.log('Fetching properties from API...');
  try {
    const response = await fetch(`${API_BASE_URL}/property`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('API Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status , response.statusText}`);
      // console.log();
      
    }

    const data = await response.json();
    // Extract the data array from the response
    const properties = data.data || [];
    console.log('Extracted properties:', properties);

    // Ensure we return an array
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
