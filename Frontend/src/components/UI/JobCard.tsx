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
    typeof title === "string" && title.length > 30
      ? `${title.slice(0, 30)}...`
      : title;

  return (
    <div
      onClick={() => navigate(`/job/${_id}`)}
      className="
        bg-white
        shadow-md
        hover:shadow-xl
        rounded-xl
        sm:rounded-2xl
        overflow-hidden
        cursor-pointer
        transition-all
        duration-300
        hover:-translate-y-1
        flex
        flex-col
        w-full
        h-full
      "
    >
      {/* Bild */}
      <figure className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </figure>

      {/* Body */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
        <div className="mb-3">
          <h3
            className="text-base sm:text-lg font-semibold text-gray-800 break-words line-clamp-2 mb-1"
            title={title}
          >
            {preview}
          </h3>
          {location && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words line-clamp-1">
              {location}
            </p>
          )}
        </div>

        {/* Footer: Buttons */}
        <div className="w-full flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => handleViewDetails(e)}
            className="flex-1 w-full text-center rounded-lg bg-black text-white py-2 px-3 text-xs sm:text-sm font-medium hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-black/20 transition-colors"
            aria-label="View job details"
            title="View Details"
          >
            View Details
          </button>

          <button
            type="button"
            onClick={(e) => handleEditClick(e)}
            className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow hover:bg-lime-600 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-black/10 flex-shrink-0"
            aria-label="Edit job"
            title="Edit job"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 sm:w-5 sm:h-5 text-lime-600 hover:text-white transition-colors"
            >
              <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
              <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;