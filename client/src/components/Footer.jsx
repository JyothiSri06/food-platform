import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const { settings } = useSettings();
  
  return (
    <footer className="bg-[#213C51] text-white pt-12 pb-8 mt-auto shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-[#E8E2D8] rounded-full shadow-sm overflow-hidden p-0.5 flex items-center justify-center h-12 w-12 text-[#E8E2D8]">
                 <img src={settings.logo_url || "/logo.png"} alt={`${settings.business_name || 'Jeji Vantalu'} Logo`} className="h-full w-full object-contain rounded-full bg-[#E8E2D8]" />
              </div>
              <h3 className="text-xl font-black text-[#E8E2D8] tracking-tight drop-shadow-md">{settings.business_name || 'Jeji Vantalu'}</h3>
            </div>
            <p className="text-[#E8E2D8]/80 text-sm">
              {settings.quality_assurance || 'Delivering happiness through fresh bakery items and authentic packaged delicacies.'}
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#E8E2D8]">Follow Us</h4>
            <div className="grid grid-cols-2 gap-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-orange-200 hover:text-white transition-all group">
                  <div className="bg-[#E8E2D8]/10 p-2 rounded-lg group-hover:bg-orange-500 transition-all font-bold">
                    <Facebook size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Facebook</span>
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-orange-200 hover:text-white transition-all group">
                  <div className="bg-[#E8E2D8]/10 p-2 rounded-lg group-hover:bg-pink-600 transition-all font-bold">
                    <Instagram size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Instagram</span>
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-orange-200 hover:text-white transition-all group">
                  <div className="bg-[#E8E2D8]/10 p-2 rounded-lg group-hover:bg-gray-900 transition-all font-bold">
                    <Twitter size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">Twitter</span>
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-orange-200 hover:text-white transition-all group">
                  <div className="bg-[#E8E2D8]/10 p-2 rounded-lg group-hover:bg-red-600 transition-all font-bold">
                    <Youtube size={16} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest">YouTube</span>
                </a>
              )}
            </div>
            {settings.help_message && (
              <p className="text-[#E8E2D8]/60 text-[10px] mt-6 italic border-t border-[#E8E2D8]/10 pt-4">
                {settings.help_message}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-[#E8E2D8]">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-orange-200 hover:text-white transition duration-150">Home</Link></li>
              <li><Link to="/products" className="text-orange-200 hover:text-white transition duration-150">All Products</Link></li>
              <li><Link to="/login" className="text-orange-200 hover:text-white transition duration-150">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <ul className="space-y-2 text-orange-200 font-bold text-xs tracking-tight">
              <li>
                <a href={`mailto:${settings.business_email || 'jejivantalu@gmail.com'}`} className="hover:text-white transition-all flex items-center lowercase font-medium">
                  {settings.business_email || 'jejivantalu@gmail.com'}
                </a>
              </li>
              <li>
                <a href={`tel:${settings.business_phone || '+91 76709 26071'}`} className="hover:text-white transition-all uppercase">
                  {settings.business_phone || '+91 76709 26071'}
                </a>
              </li>
              <li className="whitespace-pre-line opacity-70 font-medium normal-case">{settings.business_address || 'Peddapuram , Andhra Pradesh , India'}</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#E8E2D8]/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-orange-200">
          <p>&copy; {new Date().getFullYear()} {settings.business_name || 'Jeji Vantalu'}. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link to="/privacy" className="hover:text-white transition duration-150">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition duration-150">Terms of Service</Link>
            <Link to="/refund" className="hover:text-white transition duration-150">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
