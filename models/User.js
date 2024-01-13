const BASE_URL = 'https://admin.chem-square.com'
// const BASE_URL = 'http://192.168.1.9:5000'

// const BASE_URL = 'https://deloai.com'
// const BASE_URL = 'http://192.168.123.42:5000'
// const BASE_URL = 'http://10.110.5.42:5000'
// const BASE_URL = 'http://192.168.1.3:5000'
// const BASE_URL = 'http://10.100.31.253:5000



export default class User {
    constructor(id, name, ph_no, email, country, elite,role) {
        this.id = id;
        this.name = name;
        this.ph_no = ph_no;
        this.email = email;
        this.country = country;
        this.elite = elite;
        this.role = role;
    }

    // A static function to login
    static async login(identifier, password) {
        try {
            console.log(BASE_URL)
            const response = await fetch(`${BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier: identifier,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to login');
            }

            const user = data.user_details;
            return new User(user.id, user.name, user.ph_no, user.email, user.country, user.elite,user.role);
        } catch (error) {
            throw error; // re-throw to be caught/handled by caller
        }
    }
    // ... rest of the User class ...


    static async sendOtp(phone_number, email) {
        try {
            const response = await fetch(`${BASE_URL}/users/send_otp`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ph_no: phone_number,
                    email: email
                })
            });
    
            const data = await response.json();
            console.log(data)
            
    
            if (!response.ok) {
                // Checking specific error messages to throw custom errors
                if (data.message === 'Phone number already registered') {
                    throw new Error('Phone number already exists!');
                } else if (data.message === 'Email already registered') {
                    throw new Error('Email already exists!');
                }
                
                
                throw new Error('Failed to send OTP');
            }
            return 'OTP sent successfully!';
    
    
            
        } catch (error) {
            throw error; // re-throw to be caught/handled by the caller
        }
    }
    static sendip(){
        return `${BASE_URL}/users/forgot-password/send_otp`
    }
    static async sendOtp2(phone_number) {
        try {
            console.log("kaslklsakdlskdk")
            console.log(phone_number)
            const response = await fetch(`${BASE_URL}/users/forgot-password/send_otp`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ph_no: phone_number,
                })
            });
    
            const data = await response.json();
            console.log(data)
            
    
            if (!response.ok) {
                // Checking specific error messages to throw custom errors
                if (data.message === 'Phone number already registered') {
                    throw new Error('Phone number already exists!');
                } else if (data.message === 'Email already registered') {
                    throw new Error('Email already exists!');
                }
                
                
                throw new Error(data.message || 'Failed to send OTP');
            }
            return true;
    
    
            
        } catch (error) {
            throw error; // re-throw to be caught/handled by the caller
        }
    }
    static async verifyOtp(phone_number) {
        try {
            const response = await fetch(`${BASE_URL}/users/verify_otp`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone_number : phone_number,
                    otp : otp
                })
            });
            console.log(response)
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to send OTP');
            }

            // You can add more logic here depending on the expected response format.
            // For now, I'll just return a success message.
            return 'OTP Verified succesfully!';

        } catch (error) {
            throw error; // re-throw to be caught/handled by caller
        }
    }

    static async register(name,ph_no, email, country, password,otp) {
        console.log("register121 ")
        console.log(country)

        try {
            const response = await fetch(`${BASE_URL}/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name:name,
                    ph_no: ph_no,
                    email: email,
                    country: country,
                    password: password,
                    otp:otp
                })
            });

            const data = await response.json();
            if (response.status == 400) {
            return false
            }
// "User registered successfully"
            return true

        } catch (error) {
            throw error;
        }
    }



    static async changePassword(ph_no, password, otp) {
        try {
            const response = await fetch(`${BASE_URL}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ph_no: ph_no,
                    password: password,
                    otp: otp
                })
            });
    
            const data = await response.json();
            console.log(data);
    
            if (response.ok) {  // Using response.ok to check for success (HTTP status 200-299)
                return true;
            } else {
                // Here we handle specific HTTP errors or generic ones based on the response status or content
                if (response.status === 400 || data.error === 'Invalid OTP') {
                    throw new Error('Invalid OTP');
                } else if (response.status === 401) {
                    throw new Error('Unauthorized access - please login');
                } else if (response.status === 500) {
                    throw new Error('Server error - please try again later');
                } else {
                    // A generic error handling if the status code is not handled specifically
                    throw new Error(`Failed with status: ${response.status}`);
                }
            }
        } catch (error) {
            // Log error for debugging purpose and then rethrow
            // console.error('Error during password change:', error);
            throw error;
        }
    }
    

}
