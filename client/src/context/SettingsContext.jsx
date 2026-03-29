import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        business_name: 'Jeji Vantalu',
        business_address: '12-3-456, Kitchen Lane, Telangana, India',
        business_phone: '+91 90000 00000',
        business_email: 'info@jejivantalu.com',
        business_website: 'jejivantalu.in',
        fssai_reg: 'Registered FSSAI Unit',
        quality_assurance: 'Homemade Quality Assurance',
        address_line_2: 'Commercial Zone 4, Hyderabad',
        logo_url: '/logo.png',
        hero_title: 'From Our Kitchen to Your Cravings',
        hero_description: 'Delicious Homemade Foods',
        hero_video_url: '/videos/Animated video hero section.mp4',
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        privacy_policy: `1. Introduction
Welcome to Jeji Vantalu. We value your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.

2. The Data We Collect
We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
- Identity Data includes first name, last name, username or similar identifier.
- Contact Data includes billing address, delivery address, email address and telephone numbers.
- Financial Data includes bank account and payment card details (processed securely via our payment partners).
- Transaction Data includes details about payments to and from you and other details of products and services you have purchased from us.

3. How We Use Your Data
We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
- To register you as a new customer.
- To process and deliver your order.
- To manage our relationship with you.
- To improve our website, products/services, marketing or customer relationships.

4. Data Security
We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.`,
        terms_service: `1. Terms of Use
By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.

2. Use License
Permission is granted to temporarily download one copy of the materials (information or software) on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.

3. Disclaimer
The materials on our website are provided "as is". We make no warranties, expressed or implied, and hereby disclaim and negates all other warranties, including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.

4. Limitations
In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.

5. Governing Law
Any claim relating to our website shall be governed by the laws of India without regard to its conflict of law provisions.`,
        refund_policy: `1. Order Cancellation
Since our products include fresh bakery items and food products, cancellations are only accepted if the order has not yet been processed or dispatched. Once an order is in the "Processing" or "Shipped" state, it cannot be canceled.

2. Returns and Exchanges
Due to the perishable nature of many of our products (cakes, sweets, etc.), we generally do not accept returns. However, your satisfaction is our priority. If you receive a damaged or incorrect item, please contact us within 24 hours of delivery.

3. Refund Process
In cases where a refund is approved (e.g., damaged products or failed delivery), the amount will be credited back to your original payment method within 5-7 business days. Please note that shipping charges are non-refundable unless the error was on our part.

4. Damaged Products
If you receive a damaged product, please take a photo of the item and its packaging and send it to our support email immediately. We will review the case and offer a replacement or a full refund based on the severity of the damage.`
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            setSettings(prev => ({ ...prev, ...response.data }));
        } catch (err) {
            console.error('Error fetching settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            await api.put('/settings', { settings: newSettings });
            setSettings(prev => ({ ...prev, ...newSettings }));
            return { success: true };
        } catch (err) {
            console.error('Error updating settings:', err);
            return { success: false, error: err.response?.data?.error || 'Failed to update settings' };
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, loading, refreshSettings: fetchSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
