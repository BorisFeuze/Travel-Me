import { useState, useEffect } from "react";
import { addUserDetails } from "@/data/auth"

const VolunteerAccountPage = () => {
  const [userData, setUserData] = useState<UserProfileFormData | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null); 
  const token = "DEIN_JWT_TOKEN"; 

  useEffect(() => {
    // Daten vom Backend holen
    const fetchData = async () => {
      try {
        const res = await fetch("/auth/volunteer/me"); 
        const data: UserProfileFormData = await res.json();
        setUserData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

    if (!userData) return <div>Loading...</div>;

  const handleFieldChange = <K extends keyof UserProfileFormData>(
  field: K,
  value: UserProfileFormData[K]
  ) => {
  setUserData({ ...userData, [field]: value });
  };

  const handleSave = async () => {
    try {
      await addUserDetails(userData, token);
      setEditingField(null);
      alert("Daten gespeichert!");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Speichern");
    }
  };

  return (
    <div>
      {Object.entries(userData).map(([key, value]) => (
        <div key={key} style={{ marginBottom: "10px" }}>
          <strong>{key}:</strong>{" "}
          {editingField === key ? (
            <input
              type="text"
              value={value as string}
              onChange={(e) => handleFieldChange(key as keyof UserProfileFormData, e.target.value)}
              onBlur={handleSave} // speichert bei verlassen
              autoFocus
            />
          ) : (
            <span onDoubleClick={() => setEditingField(key)}>{Array.isArray(value) ? value.join(", ") : value}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default VolunteerAccountPage;
