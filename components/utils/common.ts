import { AUTH_API } from "./serverURL";

export default function formatDateString(isoDateString: string): string {
    if (!isoDateString) {
        return "";
    }
    const date = new Date(isoDateString);

    // Get day, month, year, hours, and minutes
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Construct the new date format
    return `${hours}:${minutes} ${day}/${month}/${year}`;
   
   
}

export function formatDateStringOnly(isoDateString: string): string {
    const date = new Date(isoDateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(date.getDate()).padStart(2, '0');
    const monthIndex = date.getMonth(); // getMonth() returns month index starting from 0 for January
    const year = date.getFullYear();
    console.log(day, monthNames[monthIndex])
    return `${day} ${monthNames[monthIndex]} ${year}`;
}

export function formatTimeStringOnly(isoDateString: string): string {
    if (!isoDateString) {
        return "";
    }
    const date = new Date(isoDateString);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    // Construct the new date format
    return `${hours}:${minutes}`;
   
}

export async function loginUser(email: string, password: string,) {
    const response = await fetch((`${AUTH_API.LOGIN}`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': "1",
        },
        body: JSON.stringify({ email, password})
    });

    const data = await response.json();
    if (response.ok) {
        const { accessToken, refreshToken, userId, userIndex,firstName, plan, lastName, role, status, isVerified } = data;
        if (isVerified.toString() === "true") {
            localStorage.setItem('token', accessToken);
            localStorage.setItem('userIndex', userIndex);
            localStorage.setItem("name", `${firstName} ${lastName[0]}`)
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('userID', userId);
            localStorage.setItem('role', role);
            localStorage.setItem('status', status);
            localStorage.setItem('email', email);
            localStorage.setItem('plan', plan);
            localStorage.setItem('token_expiry', (new Date().getTime() + (60 * 60 * 1000)).toString()); // Store expiration time
            localStorage.setItem('isVerified', isVerified.toString());
            return isVerified.toString();
        }
        localStorage.setItem('email', email);
        localStorage.setItem('isVerified', isVerified.toString());
        return isVerified.toString();
        
    }
    return "error";
}

export function isTimeBetween(startTime: string, endTime: string): boolean {
    const now = new Date();
    const start = new Date(`${now.toDateString()} ${startTime}`);
    const end = new Date(`${now.toDateString()} ${endTime}`);

    return now.getTime() >= start.getTime() && now.getTime() <= end.getTime();
}

export function logOut() {
    try {
        localStorage.setItem('token', "");
        localStorage.setItem('refresh_token', "");
        localStorage.setItem('userIndex', "");
        localStorage.setItem('userID', "");
        localStorage.setItem('token_expiry', "");
        localStorage.setItem('role', "");
        localStorage.setItem('status', "");
        localStorage.setItem('plan', "");
        localStorage.setItem('isVerified',"");
        return true
    } catch (e) {
        return false
    }
}

export function setExpiryTime() {
    const expiryTime = new Date().getTime() + (60 * 60 * 1000); // Current time + 60 mins
    localStorage.setItem('token_expiry', expiryTime.toString()); // Store expiration time
}

export enum HttpMethod {
    GET = 'GET',
    POST = 'POST'
}

// Define the type for the function parameters
export interface RequestOptions {
    url: string;
    method: HttpMethod;
    data?: any;  // Use a more specific type for `data` if possible, depending on your data structure
}

/**
 * A function to make HTTP requests to a given API endpoint.
 * @param options - The options containing URL, method, and optional data for the request.
 * @returns A promise that resolves to the JSON response.
 */
export async function makeRequest(options: RequestOptions): Promise<any> {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Assuming you store your token in localStorage
    });

    const config: RequestInit = {
        method: options.method,
        headers,
    }

    if (options.method === HttpMethod.POST && options.data) {
        config.body = JSON.stringify(options.data);
    }

    try {
        const response = await fetch(options.url, config);
        const jsonResponse = await response.json();
        if (!response.ok) {
            throw new Error(jsonResponse.message || 'Something went wrong with the API');
        }
        return jsonResponse;
    } catch (error) {
        console.error('Error making the request:', error);
        throw error;
    }
}

export async function getBillingInfo(email:string) {
    const response = await fetch((`${AUTH_API.GET_BILLING_INFO}`), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': "1",
        },
        body: JSON.stringify({ email})
    });
    const data = await response.json();
    if (response.ok) {
        const { plan, status } = data;
        localStorage.setItem('status', status);
        localStorage.setItem('plan', plan);
        console.log("This is getBillingInfo Function.");
    } else {
        throw new Error(data.error);
    }
}
