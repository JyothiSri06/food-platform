import React from 'react';
import { useSettings } from '../context/SettingsContext';

const PrivacyPolicy = () => {
    const { settings } = useSettings();
    const businessName = settings.business_name || 'Jeji Vantalu';

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-[#213C51] mb-8 border-b-4 border-orange-500 pb-2 inline-block">Privacy Policy</h1>
            
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-[#E8E2D8]/30 p-8 rounded-3xl border border-[#213C51]/5">
                {settings.privacy_policy || `Loading policy...`}
            </div>
            
            <div className="mt-12 p-8 bg-[#213C51]/5 rounded-3xl border border-[#213C51]/10">
                <h2 className="text-xl font-bold text-[#213C51] mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                    If you have any questions about this privacy policy or our privacy practices, please contact us at:
                </p>
                <div className="space-y-2">
                    <p className="font-bold text-[#213C51] flex items-center">
                        <span className="w-20 text-[10px] uppercase tracking-widest opacity-40">Email</span>
                        {settings.business_email || 'info@jejivantalu.com'}
                    </p>
                    <p className="font-bold text-[#213C51] flex items-center">
                        <span className="w-20 text-[10px] uppercase tracking-widest opacity-40">Phone</span>
                        {settings.business_phone || '+91 98765 43210'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
