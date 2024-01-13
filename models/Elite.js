// 
// const BASE_URL = 'https://deloai.com'
const BASE_URL = 'https://admin.chem-square.com'


// const BASE_URL = 'http://192.168.1.9:5000'
// const BASE_URL = 'http://10.110.5.42:5000'
// const BASE_URL = 'http://192.168.1.3:5000'
// const BASE_URL = 'http://10.110.2.188:5000'

// const BASE_URL = 'http://10.100.31.253:5000'

class Elite {
    constructor(id, user, org_mail, organisation_name, org_ph_no, org_Address, org_type, user_role, payment_details, status, remarks,doc1, chemical_id) {
        this.id = id;
        this.user = user;  // This is a User instance
        this.org_mail = org_mail;
        this.organisation_name = organisation_name;
        this.org_ph_no = org_ph_no;
        this.org_Address = org_Address;
        this.org_type = org_type;
        this.user_role = user_role;
        this.payment_details = payment_details;
        this.status = status || 'not verified',  // default value
        this.remarks=remarks;
        this.doc1 = doc1 || [];  // default value
        this.chemical_id = chemical_id || [];  // default value
    }

    static async create(user_id,org_mail,organisation_name,org_ph_no,org_Address,org_type,user_role,payment_details,gst) {
        try {
            const response = await fetch(`${BASE_URL}/elite/create_elite`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: user_id,  // Assuming user instance has an id
                    org_mail: org_mail,
                    organisation_name: organisation_name,
                    org_ph_no: org_ph_no,
                    org_Address: org_Address,
                    org_type: org_type,
                    user_role: user_role,
                    payment_details: payment_details,
                    gst:gst
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create elite member.');
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
    static async findByUserId(user_id) {
        console.log("sdasd")
        console.log(user_id)
        try {
            const response = await fetch(`${BASE_URL}/elite/find_elite_by_user/${user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
           
            if (!response.ok) {
                throw new Error(data.message || 'Failed to retrieve elite member by user ID.');
            }

            const elite = new Elite(
                data.data.id,
                data.data.user,
                data.data.org_mail,
                data.data.organisation_name,
                data.data.org_ph_no,
                data.data.org_Address,
                data.data.org_type,
                data.data.user_role,
                data.data.payment_details,
                data.data.status,
                data.data.remarks,
                data.data.doc1,
                data.data.chemical_id
            );
            console.log("ee")
            const dateRegex = /(\d{1,2}\s[A-Za-z]{3}\s\d{4})/;
            const start_dateMatch = data.data.created_at.match(dateRegex)
            if (start_dateMatch && start_dateMatch.length > 1) {
                elite.start_date = start_dateMatch[1]
            }
            const end_dateMatch = data.data.subscription_end_date.match(dateRegex);
            if (end_dateMatch && end_dateMatch.length > 1) {
                elite.end_date = end_dateMatch[1]
            }
            // console.log(elite.created_at.toISOString().split('T')[0]);


            return elite;
        } catch (error) {
            throw error;
        }
    }
    static async uploadAndSaveDocument(elite_id, file,doc_type) {
        try {
            // console.log(elite_id)
            // console.log(file)
            // 1. Fetch the pre-signed URL
            console.log(doc_type)
            const response = await fetch(`${BASE_URL}/elite/generate_presigned_url/${elite_id}?doctype=${doc_type}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("cam")
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch pre-signed URL.');
            }
    
            const presignedUrl = data.presigned_url;
            console.log(presignedUrl)
    
            // 2. Upload the document to S3 using the pre-signed URL
            const uploadResponse = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,  // Assuming 'file' is a File or Blob object
                headers: {
                    'Content-Type': 'application/pdf'  // Assuming the file is a PDF; adjust if necessary
                }
            });
    
            if (!uploadResponse.ok) {
                throw new Error('Failed to upload document to S3.');
            }
    
            // 3. Update the elite member with the new document's URL on the backend
            // We assume that the document's URL on S3 is the pre-signed URL without the query parameters.
            const docUrl = presignedUrl.split('?')[0];
    
            const updateResponse = await fetch(`${BASE_URL}/elite/update_elite_document/${elite_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    document_url: docUrl,
                    doc_type : doc_type
                })
            });
    
            const updateData = await updateResponse.json();
    
            if (!updateResponse.ok) {
                throw new Error(updateData.message || 'Failed to update elite member with document.');
            }
    
            return updateData;
    
        } catch (error) {
            throw error;
        }
    }

    
}
export default Elite;
