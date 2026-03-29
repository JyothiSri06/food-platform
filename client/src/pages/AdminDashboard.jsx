import React, { useEffect, useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Truck, 
  CheckCircle, 
  X, 
  Upload, 
  Edit, 
  Trash2, 
  Plus,
  ArrowRight,
  ClipboardList,
  Layers,
  LogOut,
  Menu,
  RotateCcw,
  Search,
  Settings,
  Tag,
  Printer,
  MapPin,
  PlusCircle,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Invoice from '../components/Invoice';

const SettingsTab = ({ settings, updateSettings }) => {
  const [settingsForm, setSettingsForm] = useState({
    business_name: settings?.business_name || '',
    business_address: settings?.business_address || '',
    address_line_2: settings?.address_line_2 || '',
    business_phone: settings?.business_phone || '',
    business_email: settings?.business_email || '',
    fssai_reg: settings?.fssai_reg || '',
    quality_assurance: settings?.quality_assurance || '',
    support_phone: settings?.support_phone || '',
    help_message: settings?.help_message || '',
    hero_title: settings?.hero_title || '',
    hero_description: settings?.hero_description || '',
    logo_url: settings?.logo_url || '',
    hero_video_url: settings?.hero_video_url || '',
    facebook_url: settings?.facebook_url || '',
    instagram_url: settings?.instagram_url || '',
    twitter_url: settings?.twitter_url || '',
    youtube_url: settings?.youtube_url || '',
    terms_service: settings?.terms_service || '',
    refund_policy: settings?.refund_policy || '',
    company_seal_url: settings?.company_seal_url || ''
  });
  
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(settings?.logo_url || '');
  const [heroVideoFile, setHeroVideoFile] = useState(null);
  const [heroMediaPreview, setHeroMediaPreview] = useState(settings?.hero_video_url || '');
  const [sealFile, setSealFile] = useState(null);
  const [sealPreview, setSealPreview] = useState(settings?.company_seal_url || '');
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        business_name: settings.business_name || '',
        business_address: settings.business_address || '',
        address_line_2: settings.address_line_2 || '',
        business_phone: settings.business_phone || '',
        business_email: settings.business_email || '',
        fssai_reg: settings.fssai_reg || '',
        quality_assurance: settings.quality_assurance || '',
        support_phone: settings.support_phone || '',
        help_message: settings.help_message || '',
        hero_title: settings.hero_title || '',
        hero_description: settings.hero_description || '',
        logo_url: settings.logo_url || '',
        hero_video_url: settings.hero_video_url || '',
        facebook_url: settings.facebook_url || '',
        instagram_url: settings.instagram_url || '',
        twitter_url: settings.twitter_url || '',
        youtube_url: settings.youtube_url || '',
        terms_service: settings.terms_service || '',
        refund_policy: settings.refund_policy || '',
        company_seal_url: settings.company_seal_url || ''
      });
      setLogoPreview(settings.logo_url || '');
      setHeroMediaPreview(settings.hero_video_url || '');
      setSealPreview(settings.company_seal_url || '');
    }
  }, [settings]);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSealChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSealFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSealPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      
      // Append settings as JSON string or flat fields
      // The backend now handles both. Let's send it as individual fields in FormData
      Object.entries(settingsForm).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      if (heroVideoFile) {
        formData.append('hero_video', heroVideoFile);
      }

      if (sealFile) {
        formData.append('company_seal', sealFile);
      }

      // We need to use a custom updateSettings that handles FormData
      // SettingsContext's updateSettings currently takes an object
      // I'll update SettingsContext later or just call api directly here
      await api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Settings updated successfully!');
      window.location.reload(); // Refresh to ensure all context is updated
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#E8E2D8]/60 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-white/20 overflow-hidden">
      <div className="p-8 border-b border-gray-50 bg-gray-50/30">
        <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Site Personalization</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Customize Your Brand & Landing Page</p>
      </div>
      <form onSubmit={handleSubmit} className="p-8 space-y-12">
        
        {/* Brand Identity Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-4 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <div className="w-1 h-4 bg-orange-500 rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Brand Assets</h3>
                </div>
                <div className="group relative aspect-square w-full max-w-[240px] bg-[#E8E2D8] border-2 border-dashed border-gray-200 rounded-[2.5rem] overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer" onClick={() => document.getElementById('logo-upload').click()}>
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-4" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Upload size={32} strokeWidth={1.5} />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-2">Upload Logo</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <Edit className="text-white" size={24} />
                    </div>
                </div>
                <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center max-w-[240px]">Transparent PNG Recommended</p>
            </div>

            <div className="md:col-span-4 space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <div className="w-1 h-4 bg-blue-500 rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Company Seal</h3>
                </div>
                <div className="group relative aspect-square w-full max-w-[240px] bg-[#E8E2D8] border-2 border-dashed border-gray-200 rounded-[2.5rem] overflow-hidden hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => document.getElementById('seal-upload').click()}>
                    {sealPreview ? (
                        <img src={sealPreview} alt="Seal Preview" className="w-full h-full object-contain p-4" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <PlusCircle size={32} strokeWidth={1.5} />
                            <span className="text-[10px] font-black uppercase tracking-widest mt-2">Upload Seal</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <Edit className="text-white" size={24} />
                    </div>
                </div>
                <input id="seal-upload" type="file" accept="image/*" className="hidden" onChange={handleSealChange} />
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center max-w-[240px]">Show on Official Bills</p>
            </div>

            <div className="md:col-span-8 space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <div className="w-1 h-4 bg-[#213C51] rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Basic Information</h3>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Business Name</label>
                        <input 
                            type="text" value={settingsForm.business_name}
                            onChange={e => setSettingsForm({...settingsForm, business_name: e.target.value})}
                            className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:border-[#213C51] transition-all"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Primary Email</label>
                            <input 
                                type="email" value={settingsForm.business_email}
                                onChange={e => setSettingsForm({...settingsForm, business_email: e.target.value})}
                                className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:border-[#213C51] transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Primary Phone</label>
                            <input 
                                type="text" value={settingsForm.business_phone}
                                onChange={e => setSettingsForm({...settingsForm, business_phone: e.target.value})}
                                className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:border-[#213C51] transition-all text-sm"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Hero Section Customization */}
        <div className="space-y-6 pt-8 border-t border-gray-100">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                <div className="w-1 h-4 bg-purple-500 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Hero Section Content</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-12 space-y-4">
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Hero Title (Landing Page)</label>
                        <input 
                            type="text" value={settingsForm.hero_title}
                            placeholder="e.g. From Our Kitchen to Your Cravings"
                            onChange={e => setSettingsForm({...settingsForm, hero_title: e.target.value})}
                            className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-black text-xl outline-none focus:border-purple-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Hero Description</label>
                        <textarea 
                            value={settingsForm.hero_description}
                            placeholder="e.g. Delicious Homemade Foods"
                            onChange={e => setSettingsForm({...settingsForm, hero_description: e.target.value})}
                            className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:border-purple-500 transition-all h-24 resize-none"
                        />
                    </div>
                </div>

                <div className="md:col-span-12">
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-4">Hero Background Media (Video/Image/GIF)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-[#E8E2D8]/30 p-6 rounded-[2rem] border border-white/40">
                        <div 
                            className="group relative aspect-video bg-[#E8E2D8] rounded-[1.5rem] overflow-hidden cursor-pointer border-2 border-dashed border-gray-200 flex items-center justify-center"
                            onClick={() => document.getElementById('hero-media-upload').click()}
                        >
                            {heroMediaPreview ? (
                                (heroMediaPreview.startsWith('data:video') || heroMediaPreview.includes('/video/upload')) ? (
                                    <video key={heroMediaPreview} autoPlay muted loop playsInline className="w-full h-full object-cover">
                                        <source src={heroMediaPreview} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img src={heroMediaPreview} alt="Hero Media" className="w-full h-full object-cover" />
                                )
                            ) : (
                                <div className="text-center">
                                    <Upload size={32} className="mx-auto text-gray-300" />
                                    <span className="text-[10px] font-black uppercase tracking-widest block mt-2">Click to Upload Media</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all">
                                <RotateCcw className="text-white mb-2" size={24} />
                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace Media</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-[#213C51] uppercase tracking-[0.2em]">Media Requirements</h4>
                            <ul className="text-[10px] text-gray-400 font-bold space-y-2">
                                <li className="flex items-center"><div className="w-1 h-1 bg-gray-300 rounded-full mr-2"/> MP4 / JPG / PNG / GIF SUPPORTED</li>
                                <li className="flex items-center"><div className="w-1 h-1 bg-gray-300 rounded-full mr-2"/> ASPECT RATIO 16:9 OR SIMILAR</li>
                                <li className="flex items-center"><div className="w-1 h-1 bg-gray-300 rounded-full mr-2"/> FILE SIZE UNDER 20MB RECOMMENDED</li>
                                <li className="flex items-center"><div className="w-1 h-1 bg-gray-300 rounded-full mr-2"/> HIGH QUALITY GIFS SUPPORTED</li>
                            </ul>
                            <button 
                                type="button"
                                onClick={() => document.getElementById('hero-media-upload').click()}
                                className="mt-4 px-6 py-3 bg-[#213C51]/10 text-[#213C51] text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-[#213C51] hover:text-white transition-all outline-none"
                            >
                                Change Hero Media
                            </button>
                        </div>
                        <input id="hero-media-upload" type="file" accept="video/*,image/*" className="hidden" onChange={handleHeroMediaChange} />
                    </div>
                </div>
            </div>
        </div>

        {/* Existing Compliance & Location Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
              <div className="w-1 h-4 bg-orange-500 rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Compliance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">FSSAI Registration #</label>
                <input 
                  type="text" value={settingsForm.fssai_reg}
                  onChange={e => setSettingsForm({...settingsForm, fssai_reg: e.target.value})}
                  className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:border-[#213C51] transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Quality Assurance Tagline</label>
                <input 
                  type="text" value={settingsForm.quality_assurance}
                  onChange={e => setSettingsForm({...settingsForm, quality_assurance: e.target.value})}
                  className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:border-[#213C51] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
              <div className="w-1 h-4 bg-green-500 rounded-full" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Contact/Location</h3>
            </div>
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Support Phone (Optional)</label>
                    <input 
                    type="text" value={settingsForm.support_phone}
                    onChange={e => setSettingsForm({...settingsForm, support_phone: e.target.value})}
                    className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:border-[#213C51] transition-all"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Business Address</label>
                    <textarea 
                    value={settingsForm.business_address}
                    onChange={e => setSettingsForm({...settingsForm, business_address: e.target.value})}
                    className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-medium outline-none focus:border-[#213C51] transition-all h-24 resize-none text-sm"
                    />
                </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="space-y-6 pt-8 border-t border-gray-100">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <div className="w-1 h-4 bg-sky-500 rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Social Media Presence</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Facebook URL</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-blue-600"><Facebook size={18} /></div>
                <input 
                  type="url" value={settingsForm.facebook_url}
                  placeholder="https://facebook.com/your-page"
                  onChange={e => setSettingsForm({...settingsForm, facebook_url: e.target.value})}
                  className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 pl-12 text-gray-900 font-bold outline-none focus:border-blue-500 transition-all text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Instagram URL</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-pink-600"><Instagram size={18} /></div>
                <input 
                  type="url" value={settingsForm.instagram_url}
                  placeholder="https://instagram.com/your-handle"
                  onChange={e => setSettingsForm({...settingsForm, instagram_url: e.target.value})}
                  className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 pl-12 text-gray-900 font-bold outline-none focus:border-pink-500 transition-all text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Twitter / X URL</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-gray-900"><Twitter size={18} /></div>
                <input 
                  type="url" value={settingsForm.twitter_url}
                  placeholder="https://twitter.com/your-handle"
                  onChange={e => setSettingsForm({...settingsForm, twitter_url: e.target.value})}
                  className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 pl-12 text-gray-900 font-bold outline-none focus:border-gray-900 transition-all text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">YouTube URL</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-red-600"><Youtube size={18} /></div>
                <input 
                  type="url" value={settingsForm.youtube_url}
                  placeholder="https://youtube.com/@your-channel"
                  onChange={e => setSettingsForm({...settingsForm, youtube_url: e.target.value})}
                  className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 pl-12 text-gray-900 font-bold outline-none focus:border-red-600 transition-all text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legal Policies Section */}
        <div className="space-y-6 pt-8 border-t border-gray-100">
          <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
            <div className="w-1 h-4 bg-red-500 rounded-full" />
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Legal Policies</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Privacy Policy</label>
              <textarea 
                value={settingsForm.privacy_policy}
                onChange={e => setSettingsForm({...settingsForm, privacy_policy: e.target.value})}
                className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-medium outline-none focus:border-red-500 transition-all h-48 resize-none text-sm"
                placeholder="Enter your Privacy Policy content here..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Terms of Service</label>
              <textarea 
                value={settingsForm.terms_service}
                onChange={e => setSettingsForm({...settingsForm, terms_service: e.target.value})}
                className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-medium outline-none focus:border-red-500 transition-all h-48 resize-none text-sm"
                placeholder="Enter your Terms of Service content here..."
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 mb-2">Refund Policy</label>
              <textarea 
                value={settingsForm.refund_policy}
                onChange={e => setSettingsForm({...settingsForm, refund_policy: e.target.value})}
                className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-medium outline-none focus:border-red-500 transition-all h-48 resize-none text-sm"
                placeholder="Enter your Refund Policy content here..."
              />
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" disabled={isSaving}
            className="px-12 py-5 bg-[#213C51] text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-[1.8rem] hover:shadow-2xl hover:shadow-[#213C51]/40 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#213C51]/20 disabled:opacity-50"
          >
            {isSaving ? 'UPDATING IDENTITY...' : 'PUBLISH SITE CHANGES'}
          </button>
        </div>
      </form>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const { settings, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingDeliveries: 0,
    cancelledOrders: 0,
    pendingRefunds: 0
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: [],
    product_type: 'fresh',
    stock: '',
    weight: '',
    food_type: 'veg',
    is_available: true,
    price_250g: '',
    price_500g: '',
    price_1kg: '',
    available_250g: true,
    available_500g: true,
    available_1kg: true,
    discount_percentage: 0,
    syncPrices: true,
    customization_ids: []
  });
  const [productImage, setProductImage] = useState({ file: null, preview: null });

  const [categories, setCategories] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [categoryImage, setCategoryImage] = useState({ file: null, preview: null });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderFilter, setOrderFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [customizations, setCustomizations] = useState([]);
  const [deliveryAreas, setDeliveryAreas] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [newPincode, setNewPincode] = useState('');
  const [newAreaName, setNewAreaName] = useState('');
  const [isAddingArea, setIsAddingArea] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustOptions, setNewCustOptions] = useState('');
  const [isAddingCust, setIsAddingCust] = useState(false);
  const [orderUpdateStatus, setOrderUpdateStatus] = useState('');
  const [orderUpdateMessage, setOrderUpdateMessage] = useState('');
  const [refundTransactionId, setRefundTransactionId] = useState('');
  const [isRefundLoading, setIsRefundLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading || !user || user.role?.toLowerCase().trim() !== 'admin') return;
      try {
        const [productsRes, ordersRes, customizationRes, areasRes, partnersRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
          api.get('/customizations'),
          api.get('/delivery-areas'),
          api.get('/delivery/partners').catch(() => ({ data: [] }))
        ]);
        
        const prods = productsRes.data;
        const ords = ordersRes.data;
        
        setProducts(prods);
        setOrders(ords);
        setCustomizations(customizationRes.data);
        setDeliveryAreas(areasRes.data);
        setDeliveryPartners(partnersRes.data);

        const totalRevenue = ords.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
        const pendingDel = ords.filter(o => o.order_status !== 'delivered' && o.order_status !== 'cancelled').length;
        const cancelledCount = ords.filter(o => o.order_status === 'cancelled').length;
        const pendingRefundsCount = ords.filter(o => o.refund_status === 'pending').length;

        setStats({
          totalProducts: prods.length,
          totalOrders: ords.length,
          totalRevenue: totalRevenue,
          pendingDeliveries: pendingDel,
          cancelledOrders: cancelledCount,
          pendingRefunds: pendingRefundsCount
        });
      } catch (error) {
        console.error("Failed to fetch admin data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [authLoading, user]);

  useEffect(() => {
    if (!authLoading && user && user.role?.toLowerCase().trim() === 'admin') {
      fetchCategories();
    }
  }, [authLoading, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#213C51]"></div>
      </div>
    );
  }

  if (!user || user.role?.toLowerCase().trim() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const renderDashboard = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[
        { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: ShoppingBag, color: 'text-[#213C51]', bg: 'bg-[#213C51]/10' },
        { label: 'Total Orders', value: stats.totalOrders, icon: ClipboardList, color: 'text-[#213C51]', bg: 'bg-[#213C51]/10' },
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-[#213C51]', bg: 'bg-[#213C51]/20' },
        { label: 'Pending Deliveries', value: stats.pendingDeliveries, icon: Truck, color: 'text-[#213C51]', bg: 'bg-[#213C51]/20' },
        { label: 'Cancelled Orders', value: stats.cancelledOrders, icon: X, color: 'text-red-600', bg: 'bg-red-50' },
        { label: 'Pending Refunds', value: stats.pendingRefunds, icon: RotateCcw, color: 'text-orange-600', bg: 'bg-orange-50' }
      ].map((stat, i) => (
        <div key={i} className="bg-[#E8E2D8]/60 backdrop-blur-md p-6 rounded-xl shadow-sm flex items-center space-x-4 border border-white/20">
          <div className={`p-4 ${stat.bg} ${stat.color} rounded-lg`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: [],
      product_type: 'fresh',
      stock: '',
      weight: '',
      food_type: 'veg',
      is_available: true,
      price_250g: '',
      price_500g: '',
      price_1kg: '',
      available_250g: true,
      available_500g: true,
      available_1kg: true,
      discount_percentage: 0,
      syncPrices: true,
      customization_ids: []
    });
    setProductImage({ file: null, preview: null });
    setEditingProduct(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewOrder = async (order) => {
    setIsOrderLoading(true);
    try {
      const res = await api.get(`/orders/${order.id}`);
      setSelectedOrder({ ...order, ...res.data });
      setOrderUpdateStatus(res.data.order_status || order.order_status);
      setOrderUpdateMessage('');
      setIsOrderModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch order details", error);
      setSelectedOrder(order);
      setOrderUpdateStatus(order.order_status);
      setIsOrderModalOpen(true);
    } finally {
      setIsOrderLoading(false);
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      setIsOrderLoading(true);
      const response = await api.put(`/orders/${selectedOrder.id}`, {
        order_status: orderUpdateStatus,
        update_message: orderUpdateMessage
      });
      
      setOrders(orders.map(o => o.id === selectedOrder.id ? response.data : o));
      setSelectedOrder(prev => ({ ...prev, ...response.data }));
      setOrderUpdateMessage('');
      alert('Order updated successfully');
    } catch (error) {
      console.error('Error updating order:', error);
      alert(error.response?.data?.message || 'Failed to update order');
    } finally {
      setIsOrderLoading(false);
    }
  };

  const handleConfirmRefund = async () => {
    if (!refundTransactionId.trim()) return alert("Please enter a Refund Transaction ID");
    
    setIsRefundLoading(true);
    try {
      const response = await api.put(`/orders/${selectedOrder.id}/refund`, {
        refund_id: refundTransactionId,
        update_message: `Refund of ₹${selectedOrder.total_amount} completed. TID: ${refundTransactionId}`
      });
      
      setOrders(orders.map(o => o.id === selectedOrder.id ? response.data : o));
      setSelectedOrder(prev => ({ ...prev, ...response.data }));
      setRefundTransactionId('');
      alert('Refund processed successfully');
    } catch (error) {
      console.error('Error processing refund:', error);
      alert(error.response?.data?.message || 'Failed to process refund');
    } finally {
      setIsRefundLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (e) {
      console.error("Failed to fetch categories", e);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect products using this category.')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error("Delete category failed", error);
        alert("Could not delete category. It might be in use.");
      }
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return alert("Category name is required");

    setIsCategoryLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', categoryForm.name.trim());
      
      if (categoryImage.file) {
        formData.append('image', categoryImage.file);
      } else if (editingCategory && editingCategory.image_url) {
        // Keep existing image if no new one is selected
        formData.append('image_url', editingCategory.image_url);
      }

      let response;
      if (editingCategory) {
        response = await api.put(`/categories/${editingCategory.id}`, formData);
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? response.data : c));
      } else {
        response = await api.post('/categories', formData);
        setCategories(prev => [...prev, response.data]);
      }
      
      closeCategoryModal();
    } catch (error) {
      console.error("Category save error:", error);
      alert(error.response?.data?.message || "Failed to save category. Please check if the server is running.");
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const openCategoryModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({ name: category.name });
      setCategoryImage({ file: null, preview: category.image_url });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '' });
      setCategoryImage({ file: null, preview: null });
    }
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryForm({ name: '' });
    setCategoryImage({ file: null, preview: null });
  };

  const onCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) return alert("File size too large (max 5MB)");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategoryImage({ file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!productForm.name.trim() || !productForm.price) {
      return alert("Please fill in the required fields (Name and Price)");
    }

    try {
      const formData = new FormData();
      
      // Append all standard fields
      Object.keys(productForm).forEach(key => {
        if (key === 'category') {
          // Send as comma-separated string for backend compatibility
          formData.append(key, productForm[key].join(', '));
        } else if (key === 'customization_ids') {
          formData.append(key, JSON.stringify(productForm[key]));
        } else {
          formData.append(key, productForm[key]);
        }
      });

      // Append image if present
      if (productImage.file) {
        formData.append('image', productImage.file);
      }

      let res;
      if (editingProduct) {
        res = await api.put(`/products/${editingProduct.id}`, formData);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? res.data : p));
        alert("Product updated successfully!");
      } else {
        res = await api.post('/products', formData);
        setProducts(prev => [res.data, ...prev]);
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
        alert("Product created successfully!");
      }
      
      setIsProductModalOpen(false);
      resetProductForm();
    } catch (error) {
      console.error("Product save failed:", error);
      const errorMsg = error.response?.data?.message || "Failed to save product. Please check your connection and fields.";
      alert(errorMsg);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(prev => prev.filter(p => p.id !== id));
        setStats(prev => ({ ...prev, totalProducts: prev.totalProducts - 1 }));
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const renderProducts = () => (
    <div className="bg-[#E8E2D8]/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Inventory Management</h2>
          <p className="text-xs text-gray-500 mt-0.5">Manage your stock and product details</p>
        </div>
        <button 
          onClick={() => { resetProductForm(); setIsProductModalOpen(true); }}
          className="bg-[#213C51] text-white px-5 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-[#213C51]/20 transition-all flex items-center space-x-2 text-sm"
        >
          <Plus size={18} />
          <span>Add Product</span>
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left min-w-[700px]">
          <thead className="bg-gray-50/50">
            <tr className="text-gray-400 text-[10px] uppercase tracking-widest font-black border-b border-gray-100">
              <th className="p-5">Product</th>
              <th className="p-5">Pricing</th>
              <th className="p-5">Inventory</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center space-x-4">
                    <img src={p.image_url || '/placeholder-food.png'} alt="" className="w-12 h-12 rounded-xl object-cover shadow-sm border border-gray-100" />
                    <div>
                      <p className="font-bold text-gray-900 leading-none mb-1">{p.name}</p>
                      <p className="text-xs text-gray-500 font-medium">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5 whitespace-nowrap">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-x-6">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">250g</span>
                        <p className="font-bold text-[#213C51] text-xs">₹{p.price_250g || p.price}</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">500g</span>
                        <p className="font-bold text-[#213C51] text-xs">₹{p.price_500g || p.price}</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">1kg</span>
                        <p className="font-bold text-[#213C51] text-xs">₹{p.price_1kg || p.price}</p>
                      </div>
                    </div>
                    {p.discount_percentage > 0 && (
                      <div className="flex items-center space-x-1.5">
                        <Tag size={10} className="text-orange-600" />
                        <span className="text-[9px] font-black text-orange-600 uppercase tracking-tight bg-orange-50 px-1.5 py-0.5 rounded">
                          {p.discount_percentage}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-5">
                  <p className="font-bold text-gray-700">{p.stock} <span className="text-[10px] text-gray-400 uppercase tracking-tighter ml-0.5">Units</span></p>
                  <p className="text-[10px] font-black uppercase text-gray-400">{p.product_type}</p>
                </td>
                <td className="p-5">
                  <span className={`px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${p.is_available ? 'bg-green-50 text-[#213C51] border-green-100' : 'bg-[#213C51]/10 text-[#213C51] border-red-100'}`}>
                    {p.is_available ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <div className="flex justify-end space-x-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingProduct(p);
                        setProductForm({
                          name: p.name,
                          description: p.description,
                          price: p.price,
                          category: p.category ? p.category.split(',').map(c => c.trim()) : [],
                          product_type: p.product_type,
                          stock: p.stock,
                          weight: p.weight || '',
                          food_type: p.food_type || 'veg',
                          is_available: p.is_available,
                          price_250g: p.price_250g || p.price,
                          price_500g: p.price_500g || p.price,
                          price_1kg: p.price_1kg || p.price,
                          available_250g: p.available_250g !== false,
                          available_500g: p.available_500g !== false,
                          available_1kg: p.available_1kg !== false,
                          discount_percentage: p.discount_percentage || 0,
                          syncPrices: true,
                          customization_ids: (() => {
                            let ids = p.customization_ids;
                            if (typeof ids === 'string') {
                              try { return JSON.parse(ids); } catch(e) { return []; }
                            }
                            return Array.isArray(ids) ? ids : [];
                          })()
                        });
                        setProductImage({ file: null, preview: p.image_url });
                        setIsProductModalOpen(true);
                      }}
                      className="p-2 text-[#213C51] hover:bg-[#213C51]/10 rounded-lg transition-all"
                    >
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProductModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[10001] flex items-center justify-center p-2 sm:p-4 transition-all animate-in fade-in duration-300">
      <div className="bg-[#E8E2D8]/95 backdrop-blur-3xl rounded-[2.5rem] max-w-4xl w-full max-h-[98vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20 uppercase font-black flex flex-col">
        {/* Modal Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">{editingProduct ? 'EDIT PRODUCT' : 'CREATE NEW PRODUCT'}</h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${editingProduct ? 'bg-[#213C51]/10 text-[#213C51]' : 'bg-[#213C51]/10 text-[#213C51]'}`}>
                {editingProduct ? 'Update Mode' : 'Drafting New'}
              </span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Catalog Entry #{editingProduct?.id || 'NEW'}</span>
            </div>
          </div>
          <button 
            onClick={() => setIsProductModalOpen(false)} 
            className="w-12 h-12 flex items-center justify-center bg-[#E8E2D8] rounded-2xl text-gray-400 hover:text-gray-900 shadow-md border border-gray-100 hover:rotate-90 transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-0 scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-12">
            
            {/* Left Section: Information */}
            <div className="md:col-span-6 p-8 space-y-10 border-r border-gray-50">
              
              {/* General Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                  <div className="w-1 h-4 bg-[#213C51] rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Basic Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Name *</label>
                    <input 
                      type="text" required
                      placeholder="e.g., Homemade Ghee, Spicy Mango Pickle, Fresh Paneer..."
                      value={productForm.name} 
                      onChange={e => setProductForm({...productForm, name: e.target.value})}
                      className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:ring-4 focus:ring-[#213C51]/5 focus:border-[#213C51] transition-all"
                    />
                  </div>
                  
                  <div 
                      onClick={() => document.getElementById('product-upload').click()}
                      className="group cursor-pointer aspect-square bg-[#E8E2D8] border-2 border-dashed border-gray-200 rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#213C51]/50 hover:shadow-xl hover:shadow-[#213C51]/5 relative"
                    >
                      {productImage.preview ? (
                        <img src={productImage.preview} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#213C51]/10 transition-colors">
                            <Upload size={28} className="text-gray-300 group-hover:text-[#213C51] transition-colors" />
                          </div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">Drop Image or <br/>Click to Browse</p>
                        </div>
                      )}
                      
                      {productImage.preview && (
                        <div className="absolute inset-x-4 bottom-4 bg-black/40 backdrop-blur-md border border-white/20 p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center justify-center">
                          <span className="text-white text-[10px] font-black uppercase tracking-widest">Update Visual</span>
                        </div>
                      )}
                    </div>
                    
                    <input 
                      id="product-upload" type="file" accept="image/*" className="hidden" 
                      onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setProductImage({ file, preview: reader.result });
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                </div>

                  {/* Financials & Stock */}
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                      <div className="w-1 h-4 bg-green-500 rounded-full" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Inventory & Pricing</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (Base) *</label>
                        <input 
                          type="number" required value={productForm.price} 
                          onChange={e => {
                            const newPrice = e.target.value;
                            if (productForm.syncPrices) {
                              const num = parseFloat(newPrice) || 0;
                              setProductForm(prev => ({
                                ...prev, 
                                price: newPrice,
                                price_250g: newPrice,
                                price_500g: (num * 2).toFixed(0),
                                price_1kg: (num * 4).toFixed(0),
                              }));
                            } else {
                              setProductForm(prev => ({
                                ...prev, 
                                price: newPrice,
                                price_250g: (prev.price_250g === '' || prev.price_250g === prev.price) ? newPrice : prev.price_250g,
                              }));
                            }
                          }}
                          className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:ring-4 focus:ring-[#213C51]/5 focus:border-[#213C51] transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Current Stock</label>
                        <input 
                          type="number" value={productForm.stock} 
                          onChange={e => setProductForm({...productForm, stock: e.target.value})}
                          className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:ring-4 focus:ring-[#213C51]/5 focus:border-[#213C51] transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-3 bg-[#213C51] rounded-full" />
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900">Price Variants</h4>
                        </div>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2 cursor-pointer group">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#213C51] transition-colors">Sync Prices</span>
                            <div 
                              onClick={() => setProductForm(prev => ({ ...prev, syncPrices: !prev.syncPrices }))}
                              className={`relative w-8 h-4 rounded-full transition-colors duration-300 ${productForm.syncPrices ? 'bg-[#213C51]' : 'bg-gray-200'}`}
                            >
                              <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${productForm.syncPrices ? 'translate-x-4' : 'translate-x-0'}`} />
                            </div>
                          </label>
                          <button 
                            type="button"
                            onClick={() => {
                              const base = parseFloat(productForm.price) || 0;
                              setProductForm(prev => ({
                                ...prev,
                                price_250g: base,
                                price_500g: (base * 2).toFixed(0),
                                price_1kg: (base * 4).toFixed(0)
                              }));
                            }}
                            className="text-[9px] font-black text-[#213C51] uppercase tracking-widest hover:underline flex items-center space-x-1 bg-[#213C51]/5 px-2 py-1 rounded-md"
                          >
                            <span>Auto-Fill</span>
                          </button>
                        </div>
                      </div>

                      {/* Discount Section */}
                      <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-[10px] font-black text-[#213C51] uppercase tracking-widest flex items-center">
                            <Tag className="mr-2 opacity-60" size={14} />
                            Discount Section
                          </label>
                          {productForm.discount_percentage > 0 && (
                            <span className="bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                              {productForm.discount_percentage}% OFF
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <input 
                            type="number" 
                            placeholder="Entet discount percentage (0-100)"
                            min="0" max="100"
                            value={productForm.discount_percentage}
                            onChange={e => setProductForm({...productForm, discount_percentage: e.target.value})}
                            className="w-full bg-[#E8E2D8] border border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-tight ml-1">250g (Base)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                            <input 
                              type="number" value={productForm.price_250g} 
                              onChange={e => {
                                const val = e.target.value;
                                if (productForm.syncPrices) {
                                  const num = parseFloat(val) || 0;
                                  setProductForm({
                                    ...productForm,
                                    price_250g: val,
                                    price: val,
                                    price_500g: (num * 2).toFixed(0),
                                    price_1kg: (num * 4).toFixed(0)
                                  });
                                } else {
                                  setProductForm({...productForm, price_250g: val, price: val});
                                }
                              }}
                              className="w-full bg-[#E8E2D8] border border-gray-200 rounded-xl p-3 pl-6 text-sm font-bold outline-none focus:border-[#213C51] transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-tight ml-1">500g (2x)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                            <input 
                              type="number" value={productForm.price_500g} 
                              onChange={e => {
                                const val = e.target.value;
                                if (productForm.syncPrices) {
                                  const num = parseFloat(val) || 0;
                                  const base = num / 2;
                                  setProductForm({
                                    ...productForm,
                                    price_500g: val,
                                    price: base.toFixed(0),
                                    price_250g: base.toFixed(0),
                                    price_1kg: (base * 4).toFixed(0)
                                  });
                                } else {
                                  setProductForm({...productForm, price_500g: val});
                                }
                              }}
                              className="w-full bg-[#E8E2D8] border border-gray-200 rounded-xl p-3 pl-6 text-sm font-bold outline-none focus:border-[#213C51] transition-all"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-black text-gray-400 uppercase tracking-tight ml-1">1kg (4x)</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                            <input 
                              type="number" value={productForm.price_1kg} 
                              onChange={e => {
                                const val = e.target.value;
                                if (productForm.syncPrices) {
                                  const num = parseFloat(val) || 0;
                                  const base = num / 4;
                                  setProductForm({
                                    ...productForm,
                                    price_1kg: val,
                                    price: base.toFixed(0),
                                    price_250g: base.toFixed(0),
                                    price_500g: (base * 2).toFixed(0)
                                  });
                                } else {
                                  setProductForm({...productForm, price_1kg: val});
                                }
                              }}
                              className="w-full bg-[#E8E2D8] border border-gray-200 rounded-xl p-3 pl-6 text-sm font-bold outline-none focus:border-[#213C51] transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Weight Availability Switches */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        {['250g', '500g', '1kg'].map((w) => {
                          const field = `available_${w}`;
                          return (
                            <div key={w} className="flex flex-col items-center justify-center p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                              <span className="text-[7px] font-black uppercase tracking-widest text-gray-400 mb-2">{w} Status</span>
                              <button
                                type="button"
                                onClick={() => setProductForm({...productForm, [field]: !productForm[field]})}
                                className={`relative w-10 h-5 rounded-full transition-colors duration-300 ${productForm[field] ? 'bg-green-500' : 'bg-red-400'}`}
                              >
                                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-[#E8E2D8] rounded-full shadow-sm transition-transform duration-300 transform ${productForm[field] ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                              <span className={`text-[8px] font-black uppercase mt-1.5 ${productForm[field] ? 'text-[#213C51]' : 'text-red-500'}`}>
                                {productForm[field] ? 'Active' : 'N/A'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <div className="flex border-b border-gray-100">
                        <button
                          type="button"
                          onClick={() => setProductForm({...productForm, food_type: 'veg'})}
                          className={`flex-1 py-3 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${productForm.food_type === 'veg' ? 'border-green-500 text-[#213C51]' : 'border-transparent text-gray-400'}`}
                        >
                          Vegetarian
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductForm({...productForm, food_type: 'non-veg'})}
                          className={`flex-1 py-3 border-b-2 transition-all text-xs font-black uppercase tracking-widest ${productForm.food_type === 'non-veg' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400'}`}
                        >
                          Non-Veg
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-[#E8E2D8] rounded-2xl border border-gray-100">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Public Visibility</span>
                        <button
                          type="button"
                          onClick={() => setProductForm({...productForm, is_available: !productForm.is_available})}
                          className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${productForm.is_available ? 'bg-green-500' : 'bg-[#213C51]'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-[#E8E2D8] rounded-full transition-transform duration-300 transform ${productForm.is_available ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

            {/* Right Section: Details & Config */}
            <div className="md:col-span-6 bg-gray-50/50 p-8 space-y-10">
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <div className="w-1 h-4 bg-purple-500 rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Classification</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Categories (Select Multiple)</label>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map(cat => (
                        <button
                          key={cat.id} type="button"
                          onClick={() => {
                            const current = productForm.category;
                            if (current.includes(cat.name)) {
                              setProductForm({...productForm, category: current.filter(c => c !== cat.name)});
                            } else {
                              setProductForm({...productForm, category: [...current, cat.name]});
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all border ${
                            productForm.category.includes(cat.name) 
                              ? 'bg-[#213C51] text-white border-[#213C51] shadow-lg shadow-[#213C51]/20' 
                              : 'bg-white text-gray-400 border-gray-100 hover:border-[#213C51]/30'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Applied Customizations</label>
                    <div className="flex flex-wrap gap-1.5">
                      {customizations.map(cust => (
                        <button
                          key={cust.id} type="button"
                          onClick={() => {
                            const current = productForm.customization_ids || [];
                            if (current.includes(cust.id)) {
                              setProductForm({...productForm, customization_ids: current.filter(id => id !== cust.id)});
                            } else {
                              setProductForm({...productForm, customization_ids: [...current, cust.id]});
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tight transition-all border ${
                            (productForm.customization_ids || []).includes(cust.id) 
                              ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' 
                              : 'bg-white text-gray-400 border-gray-100 hover:border-orange-500/30'
                          }`}
                        >
                          {cust.name}
                        </button>
                      ))}
                    </div>
                    {customizations.length === 0 && (
                      <p className="text-[10px] font-bold text-gray-400 italic ml-1 lowercase">No customizations defined. Add some in the Customizations tab.</p>
                    )}
                  </div>
                </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Product Type</label>
                    <select 
                      value={productForm.product_type} 
                      onChange={e => setProductForm({...productForm, product_type: e.target.value})}
                      className="w-full bg-[#E8E2D8] border border-gray-200 rounded-2xl p-4 text-gray-900 font-bold outline-none focus:border-[#213C51] appearance-none"
                    >
                      <option value="fresh">Local</option>
                      <option value="packaged">Pan India Delivery</option>
                      <option value="frozen">Frozen</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-100">
                    <div className="w-1 h-4 bg-orange-500 rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Description</h3>
                  </div>
                  <textarea 
                    placeholder="Describe the flavors, ingredients, and preparation..."
                    value={productForm.description} 
                    onChange={e => setProductForm({...productForm, description: e.target.value})}
                    className="w-full bg-[#E8E2D8] border border-gray-200 rounded-3xl p-6 text-gray-900 font-medium outline-none focus:border-[#213C51] h-48 resize-none scrollbar-hide"
                  />
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="sticky bottom-0 bg-[#E8E2D8]/90 backdrop-blur-xl border-t border-gray-100 p-4 md:p-8 flex items-center justify-between gap-2 md:gap-4">
              <button 
                type="button" 
                onClick={() => setIsProductModalOpen(false)} 
                className="px-4 py-3 md:px-8 md:py-4 text-gray-400 font-black uppercase tracking-widest text-[8px] md:text-[10px] hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all whitespace-nowrap"
              >
                Discard
              </button>
              <button 
                type="submit" 
                className="flex-1 max-w-sm py-4 md:py-5 bg-[#213C51] text-white font-black uppercase tracking-[0.2em] text-[9px] md:text-[11px] rounded-[1.8rem] hover:shadow-2xl hover:shadow-[#213C51]/40 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#213C51]/20 truncate"
              >
                <span className="md:hidden">{editingProduct ? 'COMMIT' : 'FINALIZE'}</span>
                <span className="hidden md:inline">{editingProduct ? 'COMMIT PRODUCT UPDATES' : 'FINALIZE NEW PRODUCT'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );

  const renderCategories = () => (
    <div className="bg-[#E8E2D8]/60 backdrop-blur-md rounded-[2.5rem] shadow-sm border border-white/20 overflow-hidden group">
      <div className="p-8 border-b border-gray-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase italic">Categories</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Refine Taxonomy</p>
        </div>
        <button 
          onClick={() => openCategoryModal()}
          className="bg-[#213C51] text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-[0.15em] hover:shadow-lg hover:shadow-[#213C51]/20 transition-all active:scale-95 flex items-center space-x-2 text-[10px]"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Add New</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(c => (
          <div key={c.id} className="bg-[#E8E2D8]/30 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-white/10 flex items-center justify-between group">
             <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100">
                  <img src={c.image_url || '/placeholder-category.png'} alt={c.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{c.name}</h3>
                  <span className="text-xs text-gray-500">ID: #{c.id}</span>
                </div>
             </div>
             <div className="flex space-x-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => openCategoryModal(c)} className="p-2 text-[#213C51] hover:bg-[#213C51]/10 rounded-lg transition-colors"><Edit size={16} /></button>
                <button onClick={() => handleDeleteCategory(c.id)} className="p-2 text-[#213C51] hover:bg-[#213C51]/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
             </div>
          </div>
        ))}
      </div>

    </div>
  );

  const renderCategoryModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#E8E2D8]/95 backdrop-blur-3xl rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              <p className="text-gray-500 text-sm mt-1">Fill in the details for your category</p>
            </div>
            <button onClick={closeCategoryModal} className="w-12 h-12 bg-gray-50 hover:bg-[#213C51]/10 rounded-2xl text-gray-400 hover:text-gray-900 flex items-center justify-center transition-all duration-300">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleCategorySubmit} className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center transition-all group-hover:border-[#213C51]/50 group-hover:bg-[#213C51]/5">
                  {categoryImage.preview ? (
                    <img src={categoryImage.preview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                       <Upload size={32} className="mx-auto text-gray-300 mb-2" />
                    </div>
                  )}
                  <label className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-lg border border-white/20">Change Photo</span>
                    <input type="file" accept="image/*" onChange={onCategoryImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Category Name</label>
                <input 
                  type="text" required autoFocus
                  placeholder="e.g. Sweets, Pickles, Spices"
                  value={categoryForm.name} 
                  onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-[#213C51]/10 focus:border-[#213C51] transition-all text-gray-900 font-medium" 
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button type="button" onClick={closeCategoryModal} className="px-6 py-3 md:py-4 text-gray-500 font-bold hover:bg-gray-50 rounded-2xl transition-all text-sm md:text-base">Cancel</button>
              <button type="submit" disabled={isCategoryLoading} className="flex-1 py-3 md:py-4 bg-[#213C51] text-white font-extrabold rounded-2xl hover:bg-[#39465D] shadow-xl shadow-[#213C51]/30 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 text-sm md:text-base">
                {isCategoryLoading ? 'Saving...' : (editingCategory ? 'Update' : 'Create')}
              </button>
            </div>
        </form>
      </div>
    </div>
  </div>
);

  const renderOrders = () => {
    const filteredOrders = orders.filter(o => {
      if (orderFilter === 'all') return true;
      if (orderFilter === 'pending') return o.order_status === 'processing' || o.order_status === 'pending';
      if (orderFilter === 'shipped') return o.order_status === 'shipped';
      if (orderFilter === 'delivered') return o.order_status === 'delivered';
      if (orderFilter === 'cancelled') return o.order_status === 'cancelled';
      if (orderFilter === 'refunds') return o.refund_status === 'pending';
      if (orderFilter === 'paid') return o.payment_status === 'paid';
      return true;
    });

    return (
      <div className="bg-[#E8E2D8] rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-gray-900">All Orders ({filteredOrders.length})</h2>
          
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'shipped', label: 'Shipped' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled' },
              { id: 'refunds', label: 'Refunds' },
              { id: 'paid', label: 'Paid' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-tight transition-all border ${
                  orderFilter === f.id 
                    ? 'bg-[#213C51] text-[#E8E2D8] border-[#213C51]' 
                    : 'bg-white/50 text-[#213C51]/60 border-[#213C51]/10 hover:border-[#213C51]/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold hidden md:table-cell">Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold hidden md:table-cell">Shipping</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold hidden md:table-cell">Delivery</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">#{o.id}</td>
                  <td className="p-4 text-sm text-gray-500 hidden md:table-cell">
                    <div className="font-bold">{new Date(o.created_at).toLocaleDateString('en-IN')}</div>
                    <div className="text-[10px] opacity-60 font-black uppercase tracking-widest">{new Date(o.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="p-4 text-gray-600">
                      <p className="font-bold">{o.user_name || `User #${o.user_id}`}</p>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                      <div className="text-[10px] text-gray-500 leading-tight max-w-[200px]">
                          {o.shipping_address ? (
                              <>
                                  <div className="font-bold text-gray-800">{o.shipping_address.addressLine1}</div>
                                  <div>{o.shipping_address.city}, {o.shipping_address.pincode}</div>
                                  {o.shipping_address.landmark && <div className="italic text-[9px]">L: {o.shipping_address.landmark}</div>}
                              </>
                          ) : 'No Address'}
                      </div>
                  </td>
                  <td className="p-4 font-bold text-[#213C51]">₹{o.total_amount}</td>
                  <td className="p-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-[10px] font-black rounded-lg uppercase border ${
                        o.order_status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' : 
                        o.order_status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {o.order_status}
                      </span>
                      {o.refund_status && o.refund_status !== 'none' && (
                        <span className={`px-2 py-0.5 text-[8px] font-black rounded-md uppercase border inline-block text-center ${
                          o.refund_status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                        }`}>
                          Refund: {o.refund_status}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 capitalize text-sm hidden md:table-cell">{o.delivery_method}</td>
                  <td className="p-4 text-right">
                      <button 
                          onClick={() => handleViewOrder(o)}
                          className={`text-[10px] font-black uppercase text-[#213C51] hover:underline ${isOrderLoading ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                          {isOrderLoading && selectedOrder?.id === o.id ? 'Loading...' : 'View Details'}
                      </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
    );
  };

  const renderDeliveries = () => (
    <div className="bg-[#E8E2D8] rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <Truck className="mx-auto text-gray-300 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Delivery Management</h2>
        <p className="text-gray-500 max-w-lg mx-auto mb-6">Assign pending local deliveries to active delivery partners and track Shiprocket couriers.</p>
        <button className="bg-[#213C51] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#213C51]/30 hover:bg-[#39465D] transition-all hover:-translate-y-0.5">Auto-Assign Pending</button>
    </div>
  );

  const fetchDeliveryAreas = async () => {
    try {
      const response = await api.get('/delivery-areas');
      setDeliveryAreas(response.data);
    } catch (error) {
      console.error('Error fetching delivery areas:', error);
    }
  };

  const handleAddArea = async (e) => {
    e.preventDefault();
    if (!newPincode) return;
    setIsAddingArea(true);
    try {
      await api.post('/delivery-areas', { pincode: newPincode, area_name: newAreaName });
      setNewPincode('');
      setNewAreaName('');
      fetchDeliveryAreas();
    } catch (error) {
      console.error('Error adding delivery area:', error);
      alert(error.response?.data?.message || 'Failed to add delivery area');
    } finally {
      setIsAddingArea(false);
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm('Are you sure you want to remove this delivery area?')) return;
    try {
      await api.delete(`/delivery-areas/${id}`);
      fetchDeliveryAreas();
    } catch (error) {
      console.error('Error deleting delivery area:', error);
    }
  };

  const renderDeliveryAreas = () => (
    <div className="space-y-6">
      <div className="bg-[#E8E2D8]/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#213C51] tracking-tight uppercase italic">Local Delivery Areas</h2>
            <p className="text-[10px] text-[#213C51]/40 font-black uppercase tracking-[0.2em] mt-1">Manage supported pincodes for fresh items</p>
          </div>
        </div>

        <form onSubmit={handleAddArea} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/40 p-6 rounded-3xl border border-[#213C51]/5 mb-8">
           <div className="space-y-1">
             <label className="text-[10px] font-black text-[#213C51]/40 uppercase tracking-widest ml-1">Pincode *</label>
             <input 
               type="text" required placeholder="e.g. 500032"
               value={newPincode} onChange={e => setNewPincode(e.target.value)}
               className="w-full bg-[#E8E2D8] border border-[#213C51]/10 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#213C51]"
             />
           </div>
           <div className="space-y-1">
             <label className="text-[10px] font-black text-[#213C51]/40 uppercase tracking-widest ml-1">Area Name (Optional)</label>
             <input 
               type="text" placeholder="e.g. Kondapur"
               value={newAreaName} onChange={e => setNewAreaName(e.target.value)}
               className="w-full bg-[#E8E2D8] border border-[#213C51]/10 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#213C51]"
             />
           </div>
           <div className="flex items-end">
             <button 
               type="submit" disabled={isAddingArea}
               className="w-full bg-[#213C51] text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-[#213C51]/20 transition-all flex items-center justify-center space-x-2"
             >
               <PlusCircle size={16} />
               <span>{isAddingArea ? 'Adding...' : 'Add Area'}</span>
             </button>
           </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {deliveryAreas.map(area => (
            <div key={area.id} className="bg-white/60 p-5 rounded-2xl border border-[#213C51]/5 flex items-center justify-between group hover:border-[#213C51]/20 transition-all">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#213C51]/5 rounded-xl flex items-center justify-center text-[#213C51]">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="font-black text-[#213C51] tracking-tight">{area.pincode}</p>
                  <p className="text-[10px] font-bold text-[#213C51]/40 uppercase">{area.area_name || 'N/A'}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDeleteArea(area.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {deliveryAreas.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white/20 rounded-3xl border border-dashed border-[#213C51]/10">
              <MapPin size={48} className="mx-auto text-[#213C51]/10 mb-4" />
              <p className="text-sm font-bold text-[#213C51]/40 uppercase tracking-widest">No local delivery areas defined</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const fetchCustomizations = async () => {
    try {
      const response = await api.get('/customizations/admin');
      setCustomizations(response.data);
    } catch (error) {
      console.error('Error fetching customizations:', error);
    }
  };

  const handleAddCust = async (e) => {
    e.preventDefault();
    if (!newCustName || !newCustOptions) return;
    setIsAddingCust(true);
    try {
      const optionsArray = newCustOptions.split(',').map(o => o.trim()).filter(o => o);
      await api.post('/customizations', { name: newCustName, options: optionsArray });
      setNewCustName('');
      setNewCustOptions('');
      fetchCustomizations();
    } catch (error) {
      console.error('Error adding customization:', error);
    } finally {
      setIsAddingCust(false);
    }
  };

  const handleToggleCust = async (cust) => {
    try {
      await api.put(`/customizations/${cust.id}`, { 
        ...cust, 
        is_active: !cust.is_active 
      });
      fetchCustomizations();
    } catch (error) {
      console.error('Error toggling customization:', error);
    }
  };

  const handleDeleteCust = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/customizations/${id}`);
      fetchCustomizations();
    } catch (error) {
      console.error('Error deleting customization:', error);
    }
  };

  const renderCustomizations = () => (
    <div className="space-y-6">
      <div className="bg-[#E8E2D8]/60 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/20 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-[#213C51] tracking-tight uppercase italic">Customization Options</h2>
          <p className="text-[10px] text-[#213C51]/40 font-black uppercase tracking-[0.2em] mt-1">Control order preferences available to customers</p>
        </div>

        <form onSubmit={handleAddCust} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/40 p-6 rounded-3xl border border-[#213C51]/5 mb-8">
           <div className="space-y-1">
             <label className="text-[10px] font-black text-[#213C51]/40 uppercase tracking-widest ml-1">Category Name *</label>
             <input 
               type="text" required placeholder="e.g. Spice Level"
               value={newCustName} onChange={e => setNewCustName(e.target.value)}
               className="w-full bg-[#E8E2D8] border border-[#213C51]/10 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#213C51]"
             />
           </div>
           <div className="space-y-1">
             <label className="text-[10px] font-black text-[#213C51]/40 uppercase tracking-widest ml-1">Options (Comma separated) *</label>
             <input 
               type="text" required placeholder="e.g. Mild, Medium, Spicy"
               value={newCustOptions} onChange={e => setNewCustOptions(e.target.value)}
               className="w-full bg-[#E8E2D8] border border-[#213C51]/10 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#213C51]"
             />
           </div>
           <div className="flex items-end">
             <button 
               type="submit" disabled={isAddingCust}
               className="w-full bg-[#213C51] text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-[#213C51]/20 transition-all flex items-center justify-center space-x-2"
             >
               <PlusCircle size={16} />
               <span>{isAddingCust ? 'Adding...' : 'Add Category'}</span>
             </button>
           </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customizations.map(cust => (
            <div key={cust.id} className={`bg-white/60 p-6 rounded-[2rem] border transition-all ${cust.is_active ? 'border-[#213C51]/5' : 'border-gray-200 opacity-60'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-black text-[#213C51] uppercase tracking-tight">{cust.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {cust.options.map((opt, i) => (
                      <span key={i} className="px-3 py-1 bg-[#E8E2D8] rounded-full text-[10px] font-bold text-[#213C51] border border-[#213C51]/5">{opt}</span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleToggleCust(cust)}
                    className={`p-2 rounded-xl transition-all ${cust.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                    title={cust.is_active ? 'Deactivate' : 'Activate'}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCust(cust.id)}
                    className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrderDetailModal = () => (
    <div className="fixed inset-0 bg-[#213C51]/80 backdrop-blur-sm flex items-center justify-center z-[10001] p-4">
      <div className="bg-[#E8E2D8] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20">
        <div className="p-6 border-b border-[#213C51]/10 flex justify-between items-center bg-[#E8E2D8]/50">
          <h2 className="text-xl font-black text-[#213C51] uppercase tracking-tight">Order #{selectedOrder.id} Details</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest text-[#213C51] shadow-sm hover:shadow-md transition-all active:scale-95 border border-[#213C51]/10"
            >
              <Printer size={16} />
              <span>Download Bill</span>
            </button>
            <button onClick={() => setIsOrderModalOpen(false)} className="p-2 hover:bg-[#213C51]/10 rounded-full transition-colors">
              <X size={24} className="text-[#213C51]" />
            </button>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
            {/* Customer & Contact */}
            <section>
                <h3 className="text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-4 flex items-center">
                    <ShoppingBag size={14} className="mr-2" /> Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/40 p-5 rounded-2xl border border-[#213C51]/10">
                    <div>
                        <p className="text-[10px] font-black text-[#213C51]/50 uppercase">Name</p>
                        <p className="font-bold text-[#213C51] text-lg">
                            {selectedOrder.shipping_address?.firstName 
                                ? `${selectedOrder.shipping_address.firstName} ${selectedOrder.shipping_address.lastName || ''}` 
                                : (selectedOrder.user_name || 'N/A')}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#213C51]/50 uppercase">Email</p>
                        <p className="font-bold text-[#213C51]">
                            {selectedOrder.shipping_address?.email || selectedOrder.user_email || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#213C51]/50 uppercase">Phone</p>
                        <p className="font-bold text-[#213C51]">
                            {selectedOrder.shipping_address?.phone || selectedOrder.user_phone || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-[#213C51]/50 uppercase">Alt Phone</p>
                        <p className="font-bold text-[#213C51]">
                            {selectedOrder.shipping_address?.altPhone || selectedOrder.shipping_address?.alt_phone || 'None Provided'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Shipping Address */}
            <section>
                <h3 className="text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-4 flex items-center">
                    <Truck size={14} className="mr-2" /> Shipping Address
                </h3>
                <div className="bg-white/40 p-5 rounded-2xl border border-[#213C51]/10 space-y-2">
                    <p className="font-bold text-[#213C51]">{selectedOrder.shipping_address?.addressLine1}</p>
                    {selectedOrder.shipping_address?.addressLine2 && <p className="text-sm font-medium text-[#213C51]">{selectedOrder.shipping_address?.addressLine2}</p>}
                    {selectedOrder.shipping_address?.landmark && <p className="text-sm italic text-[#213C51]/60 font-medium">Landmark: {selectedOrder.shipping_address?.landmark}</p>}
                    {selectedOrder.shipping_address?.village && <p className="text-sm font-medium text-[#213C51]">Village/Area: {selectedOrder.shipping_address?.village}</p>}
                    <p className="font-bold text-[#213C51]">{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}</p>
                </div>
            </section>

            {/* Order Items */}
            <section>
                <h3 className="text-xs font-black text-[#213C51]/60 uppercase tracking-widest mb-4 flex items-center">
                    <ClipboardList size={14} className="mr-2" /> Order Items
                </h3>
                <div className="bg-white/40 rounded-2xl border border-[#213C51]/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-[#213C51]/5 text-[10px] font-black uppercase text-[#213C51]/50">
                            <tr>
                                <th className="p-4">Item</th>
                                <th className="p-4 text-center">Weight</th>
                                <th className="p-4 text-center">Qty</th>
                                <th className="p-4 text-right">Price</th>
                                <th className="p-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#213C51]/5">
                            {selectedOrder.order_items?.map((item, idx) => (
                                <tr key={idx} className="text-sm">
                                    <td className="p-4 font-bold text-[#213C51] capitalize">
                                        {item.name}
                                        {item.customization_choices && Object.entries(item.customization_choices).length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {Object.entries(item.customization_choices).map(([k, v]) => (
                                                    <span key={k} className="text-[8px] px-1.5 py-0.5 bg-[#213C51]/5 rounded border border-[#213C51]/10 text-[#213C51]/70">{k}: {v}</span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-center font-medium text-[#213C51]/70">{item.weight || 'N/A'}</td>
                                    <td className="p-4 text-center font-bold text-[#213C51]/70">{item.quantity}</td>
                                    <td className="p-4 text-right">₹{item.price}</td>
                                    <td className="p-4 text-right font-bold">₹{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
            
            {/* Order Preferences (Structured Customization) */}
            {selectedOrder.customization_choices && Object.keys(selectedOrder.customization_choices).length > 0 && (
                <section className="bg-white/40 p-5 rounded-2xl border border-[#213C51]/10 mb-6 shadow-sm">
                    <h3 className="text-[10px] font-black text-[#213C51]/60 uppercase tracking-widest mb-4 flex items-center">
                        <Settings size={14} className="mr-2" /> Order Preferences
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {selectedOrder.customization_choices.spiceLevel && (
                            <div className="bg-white/80 p-3 rounded-xl border border-[#213C51]/5">
                                <p className="text-[8px] font-black text-[#213C51]/40 uppercase tracking-widest mb-1">Spice Level</p>
                                <p className="text-xs font-black text-[#213C51] uppercase tracking-tight">{selectedOrder.customization_choices.spiceLevel}</p>
                            </div>
                        )}
                        {selectedOrder.customization_choices.oilPreference && (
                            <div className="bg-white/80 p-3 rounded-xl border border-[#213C51]/5">
                                <p className="text-[8px] font-black text-[#213C51]/40 uppercase tracking-widest mb-1">Oil Preference</p>
                                <p className="text-xs font-black text-[#213C51] uppercase tracking-tight">{selectedOrder.customization_choices.oilPreference}</p>
                            </div>
                        )}
                        {selectedOrder.customization_choices.packaging && (
                            <div className="bg-white/80 p-3 rounded-xl border border-[#213C51]/5">
                                <p className="text-[8px] font-black text-[#213C51]/40 uppercase tracking-widest mb-1">Packaging Type</p>
                                <p className="text-xs font-black text-[#213C51] uppercase tracking-tight">{selectedOrder.customization_choices.packaging}</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Customization Notes */}
            {selectedOrder.customization_notes && (
                <section>
                    <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center">
                        <Edit size={14} className="mr-2" /> Customization Notes
                    </h3>
                    <div className="bg-orange-50 p-5 rounded-2xl border border-orange-100">
                        <p className="text-sm font-bold text-[#213C51] whitespace-pre-wrap">{selectedOrder.customization_notes}</p>
                    </div>
                </section>
            )}
            {/* Admin Order Updates */}
            <section className="bg-white/60 p-6 rounded-2xl border border-[#213C51]/10 space-y-6">
                <h3 className="text-xs font-black text-[#213C51] uppercase tracking-widest flex items-center">
                    <Edit size={14} className="mr-2" /> Admin Order Management
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Update Status</label>
                        <select 
                            value={orderUpdateStatus}
                            onChange={e => setOrderUpdateStatus(e.target.value)}
                            disabled={selectedOrder.order_status === 'cancelled'}
                            className={`w-full bg-[#E8E2D8] border border-[#213C51]/10 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#213C51] ${selectedOrder.order_status === 'cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <option value="processing">Processing</option>
                            <option value="food prepared">Food Prepared</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Status Message (Optional)</label>
                        <input 
                            type="text"
                            placeholder="e.g. Out for delivery"
                            value={orderUpdateMessage}
                            onChange={e => setOrderUpdateMessage(e.target.value)}
                            className="w-full bg-[#E8E2D8] border border-[#213C51]/10 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#213C51]"
                        />
                    </div>
                </div>
                <button 
                    onClick={handleUpdateOrder}
                    disabled={isOrderLoading || selectedOrder.order_status === 'cancelled'}
                    className={`w-full py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
                        selectedOrder.order_status === 'cancelled' 
                        ? 'bg-gray-400 text-white cursor-not-allowed' 
                        : 'bg-[#213C51] text-white hover:shadow-lg'
                    }`}
                >
                    {isOrderLoading ? 'Updating...' : selectedOrder.order_status === 'cancelled' ? 'Order Finalized (Cancelled)' : 'Update Order Status'}
                </button>

                {/* Refund Management */}
                {selectedOrder.refund_status !== 'none' && (
                    <div className={`p-5 rounded-2xl border ${
                        selectedOrder.refund_status === 'pending' 
                        ? 'bg-orange-50 border-orange-100' 
                        : 'bg-green-50 border-green-100'
                    }`}>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className={`text-xs font-black uppercase tracking-widest flex items-center ${
                                selectedOrder.refund_status === 'pending' ? 'text-orange-700' : 'text-green-700'
                            }`}>
                                <RotateCcw size={14} className="mr-2" /> Refund Management
                            </h4>
                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase border ${
                                selectedOrder.refund_status === 'pending' 
                                ? 'bg-orange-100 text-orange-700 border-orange-200' 
                                : 'bg-green-100 text-green-700 border-green-200'
                            }`}>
                                {selectedOrder.refund_status}
                            </span>
                        </div>

                        {selectedOrder.refund_status === 'pending' ? (
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest ml-1">Refund Transaction ID</label>
                                    <input 
                                        type="text"
                                        placeholder="Enter Refund Reference ID"
                                        value={refundTransactionId}
                                        onChange={e => setRefundTransactionId(e.target.value)}
                                        className="w-full bg-white/80 border border-orange-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-orange-500"
                                    />
                                </div>
                                <button 
                                    onClick={handleConfirmRefund}
                                    disabled={isRefundLoading}
                                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all font-bold"
                                >
                                    {isRefundLoading ? 'Processing...' : 'Confirm Refund Processed'}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-white/40 p-3 rounded-xl border border-green-200/50">
                                <p className="text-[10px] font-black text-green-700/60 uppercase tracking-widest mb-1">Refund ID</p>
                                <p className="text-xs font-black text-green-800 uppercase tracking-tight">{selectedOrder.refund_id}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Status History */}
                {selectedOrder.status_updates && selectedOrder.status_updates.length > 0 && (
                    <div className="pt-4 border-t border-[#213C51]/5">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Update History</p>
                        <div className="space-y-3">
                            {selectedOrder.status_updates.slice().reverse().map((update, idx) => (
                                <div key={idx} className="flex items-start space-x-3 text-xs bg-white/40 p-3 rounded-xl border border-[#213C51]/5">
                                    <div className="w-2 h-2 rounded-full bg-[#213C51]/20 mt-1" />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-black text-[#213C51] uppercase tracking-tight">{update.status}</span>
                                            <span className="text-[10px] text-gray-400 font-bold">{new Date(update.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-gray-600 mt-1 font-medium">{update.message}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#213C51] p-6 rounded-2xl text-[#E8E2D8] shadow-lg space-y-4 sm:space-y-0">
                <div>
                    <p className="text-[10px] font-black uppercase opacity-60">Grand Total</p>
                    <p className="text-3xl font-black">₹{selectedOrder.total_amount}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase opacity-60">Status</p>
                    <span className="text-sm font-black uppercase px-3 py-1 bg-[#E8E2D8] text-[#213C51] rounded-lg">{selectedOrder.order_status}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Inventory', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'delivery-areas', label: 'Delivery Areas', icon: MapPin },
    { id: 'customizations', label: 'Customizations', icon: Edit },
    { id: 'deliveries', label: 'Logistics', icon: Truck },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-[#213C51]/20 border-t-[#213C51] rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-gray-400">Synchronizing Engine</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E8E2D8]/30">
      {/* Mobile Header */}
      <div className="md:hidden bg-[#E8E2D8] border-b border-[#213C51]/10 p-4 flex justify-between items-center sticky top-0 z-[60] backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-[#213C51] rounded-lg flex items-center justify-center text-white">
            <ShoppingBag size={18} />
          </div>
          <h1 className="text-lg font-bold text-[#213C51]">Jeji Vantalu Admin</h1>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-[#213C51]/10 rounded-xl text-[#213C51]"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 gap-4 md:gap-8 relative">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-[#213C51]/80 backdrop-blur-md z-[80] md:hidden transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-[100] w-[300px] h-full transition-transform duration-500 ease-out transform md:relative md:translate-x-0 md:z-auto md:w-1/4 md:p-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="bg-[#E8E2D8] md:bg-[#E8E2D8]/60 backdrop-blur-xl h-full md:h-auto overflow-y-auto p-8 md:rounded-2xl border-r md:border border-[#213C51]/10 md:border-white/20">
             <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#213C51] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#213C51]/20">
                      <ShoppingBag size={24} />
                    </div>
                    <h1 className="text-xl font-black text-[#213C51] tracking-tight">Jeji Vantalu</h1>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="md:hidden p-2 bg-[#213C51]/5 hover:bg-[#213C51]/10 rounded-xl text-[#213C51] transition-colors"
                >
                    <X size={20} />
                </button>
             </div>
  
             <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-5 py-4 rounded-2xl transition-all duration-300 ${
                    activeTab === item.id 
                    ? 'bg-[#213C51] text-[#E8E2D8] shadow-lg shadow-[#213C51]/20 scale-[1.02]' 
                    : 'text-[#213C51]/60 hover:bg-[#213C51]/5 hover:text-[#213C51]'
                  }`}
                >
                  <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                  <span className="font-bold tracking-tight">{item.label}</span>
                </button>
              ))}
              <div className="pt-8 mt-8 border-t border-[#213C51]/5">
                <button 
                  onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
                  className="w-full flex items-center space-x-3 px-5 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition-all font-bold"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
             </nav>

             <div className="mt-12 bg-[#213C51]/5 p-6 rounded-[2rem] border border-[#213C51]/5">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#213C51]/40 mb-3 ml-1">Account</p>
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#213C51] rounded-xl flex items-center justify-center text-white font-black">
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-bold text-[#213C51] truncate">{user?.name}</p>
                        <p className="text-[10px] font-medium text-[#213C51]/60 truncate uppercase">{user?.role}</p>
                    </div>
                </div>
             </div>
          </div>
        </aside>
  
        {/* Main Content Area */}
        <div className="flex-1 space-y-6 w-full overflow-hidden">
          <div className="bg-[#E8E2D8]/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-white/20 flex justify-between items-center">
             <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeTab}</h2>
          </div>
  
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'products' && renderProducts()}
            {activeTab === 'categories' && renderCategories()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'delivery-areas' && renderDeliveryAreas()}
            {activeTab === 'customizations' && renderCustomizations()}
            {activeTab === 'deliveries' && renderDeliveries()}
            {activeTab === 'settings' && <SettingsTab settings={settings} updateSettings={updateSettings} />}
          </div>
        </div>
  
        {isProductModalOpen && renderProductModal()}
        {isCategoryModalOpen && renderCategoryModal()}
        {isOrderModalOpen && selectedOrder && renderOrderDetailModal()}
      </div>
      {isOrderModalOpen && selectedOrder && !isOrderLoading && <Invoice order={selectedOrder} />}
    </div>
  );
};

export default AdminDashboard;
