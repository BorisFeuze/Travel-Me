import React from "react";
import { useNavigate } from "react-router";

const JobCard: React.FC<JobCardData> = ({ _id, title, image, location }) => {
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    navigate(`/job/edit/${_id}`);
  };

  return (
    <div
      onClick={() => navigate(`/job/${_id}`)}
      className="card bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 relative"
    >
      <figure className="relative w-full h-48 overflow-hidden">
        <img src={image} alt={title} className="object-cover w-full h-full" />
      </figure>

      <div className="card-body p-4">
        <h3 className="card-title text-lg font-semibold text-gray-800">{title}</h3>
        {location && <p className="text-gray-500">{location}</p>}
      </div>

      <button
        onClick={handleEditClick}
        className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 text-gray-700"
        >
          <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
          <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
        </svg>
      </button>
    </div>
  );
};

export default JobCard;
