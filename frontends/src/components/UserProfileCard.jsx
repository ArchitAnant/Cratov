import React from "react";
import { Button } from "./Action";

const UserProfileCard = ({
  name,
  username,
  userType,
  votesLeft,
  onEditProfile,
  onAddPothole,
  onDownloadPreRepair,
  profileImage = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  showVotes = false
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between mb-12 relative font-poppins">
      <div className="flex flex-col gap-4">
        <h2 className="text-[26px] md:text-[30px] font-medium text-black">Profile</h2>
        <div className="flex items-center gap-5 pt-10">
          <img
            src={profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="space-y-1">
            <h3 className="text-xl font-medium text-black">{name}</h3>
            <p className="text-sm text-gray-600">@{username}</p>
            <p className="text-sm text-gray-700">
              {userType}
              {showVotes && (
                <span className="font-medium"> Votes Left : {votesLeft}</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Using standardized Button component */}
      <div className="absolute top-12 right-0 flex flex-col gap-4 w-[180px] z-10">
        <Button
          variant="secondary"
          size="profile"
          onClick={onEditProfile}
          icon="✏️"
        >
          Edit Profile
        </Button>

        <Button
          variant="secondary"
          size="profile"
          onClick={onAddPothole}
          icon="➕"
        >
          Add Pothole
        </Button>

        {onDownloadPreRepair && (
          <Button
            variant="secondary"
            size="profile"
            onClick={onDownloadPreRepair}
            icon="📥"
          >
            Download Pre-repair Road
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;
