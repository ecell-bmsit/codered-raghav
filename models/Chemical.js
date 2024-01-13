import { Alert } from 'react-native';
import Elite from './Elite';
import User from './User';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const BASE_URL = 'http://192.168.1.9:5000'
const BASE_URL = 'https://admin.chem-square.com'

// const BASE_URL = 'https://deloai.com'
// const BASE_URL = 'http://10.100.31.253:5000'
const storeDataByUrl = async (url, data) => {
    try {
        console.log("yeysyse")
      await AsyncStorage.setItem(url, JSON.stringify(data));
    } catch (error) {
      console.error(`Error storing data for URL ${url}:`, error);
    }
  };
  
  const getDataByUrl = async (url) => {
    try {
      const cachedData = await AsyncStorage.getItem(url);

      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
    //   console.error(`Error retrieving data for URL ${url}:`, error);
      return null;
    }
  };

  

class Chemical {
    constructor(id, name, cas_no, category, appearance, synonyms, desc, supplier, status, remarks, created_at, unique_id, image_url,visibility) {
        this.id = id;
        this.name = name;
        this.cas_no = cas_no;
        this.category = category;
        this.appearance = appearance;
        this.synonyms = synonyms;
        this.desc = desc;
        this.supplier = supplier;  // This is an Elite instance
        this.status = status;
        this.remarks = remarks;
        this.created_at = created_at;
        this.unique_id = unique_id;
        this.image_url = image_url;  // base64 encoded image string
        this.visibility =visibility;
    }

    // Convert the instance data into a JSON string
  
 // Helper function to fetch data and update cache based on URL
 static async fetchDataAndUpdateCache(url) {
    try {
      let cachedData = await getDataByUrl(url);

      if (!cachedData) {
        console.log("start")
        // Fetch the data from the server if cache is not available
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}`);
        }

        const data = await response.json();
          
          const data2= data.data.map(chemical => new Chemical(
               
                chemical.id, chemical.name, chemical.cas_no, 
                chemical.category, chemical.appearance, chemical.synonyms,
                chemical.desc, chemical.supplier, chemical.status,
                chemical.remarks, chemical.created_at, chemical.unique_id,
                chemical.image_url,chemical.visibility
            ));

        // Store the fetched data in AsyncStorage based on the URL
        await storeDataByUrl(url, data2);

        cachedData = data;
        console.log("stop")
      }

      return cachedData;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  }
  // Helper function to fetch data and update cache based on URL
  static async fetchDataAndUpdateCachegen(url) {
    try {
      let cachedData = await getDataByUrl(url);

      if (!cachedData) {
        // Fetch the data from the server if cache is not available
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data from ${url}`);
        }

        const data = await response.json();

        // Store the fetched data in AsyncStorage based on the URL
        await storeDataByUrl(url, data);

        cachedData = data;
      }

      return cachedData;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      throw error;
    }
  }


    // Add a static method to create a new chemical
    static async create(data) {
        try {
            console.log("sdksdjgfj")
            console.log(`${BASE_URL}/chemicals/chemical`)
            const response = await fetch(`${BASE_URL}/chemicals/chemical`, {
                method: 'POST',
                headers: {
                    // 'Content-Type': 'application/json'
                },
                body: data  // Convert the data object to a JSON string
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonData = await response.json();
            console.log(jsonData)
            return jsonData
           
        } catch (error) {
         Alert.alert("Error" , "Failed to add chemical")
        }
    }
    static async getChemicalsByEliteId(eliteId) {
        
        try {
            const response = await fetch(`${BASE_URL}/elite/${eliteId}/chemicals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chemicals');
            }

            const data = await response.json();
          
          return data.data.map(chemical => new Chemical(
               
                chemical.id, chemical.name, chemical.cas_no, 
                chemical.category, chemical.appearance, chemical.synonyms,
                chemical.desc, chemical.supplier, chemical.status,
                chemical.remarks, chemical.created_at, chemical.unique_id,
                chemical.image_url,chemical.visibility
            ));
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
    // static async getallChemicals() {
        
    //     try {
    //         console.log(BASE_URL)
    //         const response = await fetch(`${BASE_URL}/chemicals/getall`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });

    //         if (!response.ok) {
    //             throw new Error('Failed to fetch chemicals');
    //         }

    //         const data = await response.json();
          
    //       return data.data.map(chemical => new Chemical(
               
    //             chemical.id, chemical.name, chemical.cas_no, 
    //             chemical.category, chemical.appearance, chemical.synonyms,
    //             chemical.desc, chemical.supplier, chemical.status,
    //             chemical.remarks, chemical.created_at, chemical.unique_id,
    //             chemical.image_url,chemical.visibility
    //         ));
            
    //     } catch (error) {
    //         console.error('There was a problem with the fetch operation:', error);
    //         throw error;
    //     }
    // }

    static async getallChemicals() {
        try {
          const url = `${BASE_URL}/chemicals/getall`;
          const data = await this.fetchDataAndUpdateCache(url);
          return data;
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          throw error;
        }
      }
    static async getlist1images() {
        
        try {
            console.log(BASE_URL)
            const response = await fetch(`${BASE_URL}/chemicals/list1_chemicals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chemicals');
            }

            const data = await response.json();
            
          
          return data.image
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
    static async getlist1Chemicals() {
        
        try {
            console.log(BASE_URL)
            const response = await fetch(`${BASE_URL}/chemicals/list1_chemicals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chemicals');
            }

            const data = await response.json();
            
          
          return data.data.map(chemical => new Chemical(
               
                chemical.id, chemical.name, chemical.cas_no, 
                chemical.category, chemical.appearance, chemical.synonyms,
                chemical.desc, chemical.supplier, chemical.status,
                chemical.remarks, chemical.created_at, chemical.unique_id,
                chemical.image_url,chemical.visibility
            ));
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
    static async getlist2Chemicals() {
        
        try {
            console.log(BASE_URL)
            const response = await fetch(`${BASE_URL}/chemicals/list2_chemicals`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chemicals');
            }

            const data = await response.json();
          
          return data.data.map(chemical => new Chemical(
               
                chemical.id, chemical.name, chemical.cas_no, 
                chemical.category, chemical.appearance, chemical.synonyms,
                chemical.desc, chemical.supplier, chemical.status,
                chemical.remarks, chemical.created_at, chemical.unique_id,
                chemical.image_url,chemical.visibility
            ));
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
    static async getallChemicalrequests() {
        
        try {
            console.log(BASE_URL)
            const response = await fetch(`${BASE_URL}/chemicals/chemicals/requests`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch chemicals');
            }

            const data = await response.json();
          
          return data.data.map(chemical => new Chemical(
               
                chemical.id, chemical.name, chemical.cas_no, 
                chemical.category, chemical.appearance, chemical.synonyms,
                chemical.desc, chemical.supplier, chemical.status,
                chemical.remarks, chemical.created_at, chemical.unique_id,
                chemical.image_url,chemical.visibility
            ));
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
    static async updateVisibility(uniqueId, visibility) {
        try {
            const response = await fetch(`${BASE_URL}/chemicals/${uniqueId}/visibility`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({visibility: visibility})  // Convert the visibility to a JSON string
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }
    static async getChemicalsByCategory(category) {
        try {
           
            const data = await this.fetchDataAndUpdateCachegen(`${BASE_URL}/chemicals/category/${category}`);

           
            if (data.success) {
                console.log(" trrt")
                return data.data.map(chemical => new Chemical(
               
                    chemical.id, chemical.name, chemical.cas_no, 
                    chemical.category, chemical.appearance, chemical.synonyms,
                    chemical.desc, chemical.supplier, chemical.status,
                    chemical.remarks, chemical.created_at, chemical.unique_id,
                    chemical.image_url,chemical.visibility
                ));
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        }
    }
    static async approveChemical(uniqueId) {
        try {
          const response = await fetch(`${BASE_URL}/chemicals/chemical/${uniqueId}/approve`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            // If additional data is needed, include it in the body
            // body: JSON.stringify({ additionalData: 'value' })
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const jsonData = await response.json();
          return jsonData;
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      }
    
      static async rejectChemical(uniqueId) {
        try {
          const response = await fetch(`${BASE_URL}/chemicals/chemical/${uniqueId}/reject`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            // If additional data is needed, include it in the body
            // body: JSON.stringify({ additionalData: 'value' })
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
    
          const jsonData = await response.json();
          return jsonData;
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }
      }


}

export default Chemical;
