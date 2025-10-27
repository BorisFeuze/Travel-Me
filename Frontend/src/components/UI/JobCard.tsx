import React from "react";
import { useNavigate } from "react-router";



const JobCard: React.FC<JobCardData> = ({ _id, title, image, location }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/job/${_id}`)}
      className="card bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1"
    >
      <figure className="relative w-full h-48 overflow-hidden">
        <img
          src={image || "https://www.pexels.com/photo/aerial-view-of-mountain-peaks-under-a-purple-and-orange-sunset-sky-16635789/"}
          alt={title}
          className="object-cover w-full h-full"
        />
      </figure>
      <div className="card-body p-4">
        <h3 className="card-title text-lg font-semibold text-gray-800">
          {title}
        </h3>
        {location && <p className="text-gray-500">{location}</p>}
      </div>
    </div>
  );
};

export default JobCard;