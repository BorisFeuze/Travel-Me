import { useState, useEffect } from "react";

type UserProfileFormData = {
  pictureURL?: string;
  userId: string;
  age?: number;
  continent: string;
  country: string;
  gender: string;
  skills: string[];
  languages: string[];
  educations: string[];
};

const VolunteerAccountPage = () => {
  const [userData, setUserData] = useState<UserProfileFormData | null>(null);
  const [formData, setFormData] = useState<UserProfileFormData | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/auth/volunteer/me", {
          credentials: "include", 
        });
        if (!res.ok) {
          const defaultData = {
            userId: "",
            continent: "",
            country: "",
            gender: "",
            skills: [],
            languages: [],
            educations: [],
          };
          setUserData(defaultData);
          setFormData(defaultData);
          return;
        }
        const data: UserProfileFormData = await res.json();
        setUserData(data);
        setFormData(data);
        if (data.pictureURL) {
          setPreviewUrl(data.pictureURL);
        }
      } catch (err) {
        console.error(err);
        const defaultData = {
          userId: "",
          continent: "",
          country: "",
          gender: "",
          skills: [],
          languages: [],
          educations: [],
        };
        setUserData(defaultData);
        setFormData(defaultData);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field: keyof UserProfileFormData, value: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleArrayInputChange = (field: keyof UserProfileFormData, value: string) => {
    if (!formData) return;
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({
      ...formData,
      [field]: arrayValue
    });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSaveMessage({type: 'error', text: 'File size must be less than 5MB'});
        return;
      }
      if (!file.type.startsWith('image/')) {
        setSaveMessage({type: 'error', text: 'Please select an image file'});
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData) return;
    
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const formDataToSend = new FormData();
      
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }
      
      formDataToSend.append('continent', formData.continent);
      formDataToSend.append('country', formData.country);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('skills', JSON.stringify(formData.skills));
      formDataToSend.append('languages', JSON.stringify(formData.languages));
      formDataToSend.append('educations', JSON.stringify(formData.educations));
      
      if (formData.age) {
        formDataToSend.append('age', formData.age.toString());
      }

      const res = await fetch("http://localhost:8000/user-profiles/:id}", {
        method: "PUT",
        credentials: "include",
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const updatedData = await res.json();
      setUserData(updatedData);
      setFormData(updatedData);
      setSaveMessage({type: 'success', text: 'Profile updated successfully!'});
      setProfilePicture(null);
    } catch (err) {
      console.error(err);
      setSaveMessage({
        type: 'error', 
        text: err instanceof Error ? err.message : 'Failed to save changes'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData) return <div className="p-4">Loading...</div>;

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h2 className="card-title">Account Settings</h2>
            
            {saveMessage && (
              <div className={`alert ${saveMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                <span>{saveMessage.text}</span>
              </div>
            )}

            <fieldset className="fieldset">
              <label className="label">
                <span className="label-text">Profile Picture</span>
              </label>
              {previewUrl && (
                <div className="avatar mb-2">
                  <div className="w-24 rounded-full">
                    <img src={previewUrl} alt="Profile preview" />
                  </div>
                </div>
              )}
              <input 
                type="file" 
                accept="image/*"
                className="file-input file-input-bordered w-full" 
                onChange={handleProfilePictureChange}
              />
              
              <label className="label mt-4">
                <span className="label-text">Country</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                placeholder="Enter Country"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />

          <label className="label">
                <span className="label-text">Continent</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                placeholder="Enter Continent"
                value={formData.continent}
                onChange={(e) => handleInputChange('continent', e.target.value)}
              />

              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                placeholder="Enter Gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
              />

              <label className="label">
                <span className="label-text">Skills</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                placeholder="Enter skills separated by commas"
                value={formData.skills.join(', ')}
                onChange={(e) => handleArrayInputChange('skills', e.target.value)}
              />

              <label className="label">
                <span className="label-text">Languages</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                placeholder="Enter languages separated by commas"
                value={formData.languages.join(', ')}
                onChange={(e) => handleArrayInputChange('languages', e.target.value)}
              />

              <label className="label">
                <span className="label-text">Education</span>
              </label>
              <input 
                type="text" 
                className="input input-bordered" 
                placeholder="Enter education separated by commas"
                value={formData.educations.join(', ')}
                onChange={(e) => handleArrayInputChange('educations', e.target.value)}
              />

              <button 
                className="btn btn-neutral mt-4" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerAccountPage;