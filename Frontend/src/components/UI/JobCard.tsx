import React from "react";
import { useNavigate } from "react-router";

const JobCard: React.FC<JobCardData> = ({ _id, title, image, location }) => {
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-job/${_id}`);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/job/${_id}`);
  };

  const preview =
    typeof title === "string" && title.length > 4
      ? `${title.slice(0, 20)}...`
      : title;

  return (
    <div
      onClick={() => navigate(`/job/${_id}`)}
      className="card bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 relative"
    >
      <figure className="relative w-full h-48 overflow-hidden">
        <img src={image} alt={title} className="object-cover w-full h-full" />
      </figure>

      <div className="card-body p-4">
        <h3
          className="card-title text-lg font-semibold text-gray-800"
          title={title}
        >
          {preview}
        </h3>

        {location && <p className="text-gray-500 mt-1">{location}</p>}

        {/* Footer: responsive buttons - View Details + Edit */}
        <div className="mt-3 w-full">
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(e);
              }}
              className="flex-1 w-full sm:w-auto text-center rounded-lg bg-black text-white py-2 text-sm font-medium hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-black/20"
              aria-label="View job details"
              title="View Details"
            >
              View Details
            </button>

            {/* Edit as icon on sm+ */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(e);
              }}
              className="hidden sm:inline-flex items-center justify-center p-2 bg-white rounded-full shadow hover:bg-lime-600 transform focus:outline-none focus:ring-2 focus:ring-black/10"
              aria-label="Edit job"
              title="Edit job"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-lime-600 hover:text-white"
              >
                <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
              </svg>
            </button>

            {/* Edit text link for xs screens */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(e);
              }}
              className="sm:hidden w-full text-sm text-lime-600 underline text-center"
              aria-label="Edit job"
              title="Edit job"
            >
              Edit Job
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
