import React from "react";
import { Button } from "./Action";
import {Pencil,Plus} from "lucide-react"

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
        <div className="flex items-center gap-5 pt-10 ps-5">
          <img
            src={profileImage}
            alt="Profile"
            className="w-[116px] h-[116px] rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="text-[25px] font-medium text-black">{name}</h3>
            <p className="mt-1 text-sm text-black">@{username}</p>
            <div className="mt-5 flex flex-row items-center">
            <p className=" text-[15px] opacity-50 text-black">
              {userType}
            </p>
            {userType==="user" && (
                <span className="ps-5 text-[15px] font-medium"> Votes Left : {votesLeft}</span>
              )}
              </div> 
          </div>
        </div>
      </div>

      {/* Action Buttons - Using standardized Button component */}
      <div className="mt-10 flex flex-col justify-end items-center gap-4 w-[180px] z-10 pe-5">
        <Button
          variant="text"
          size="profile"
          onClick={onEditProfile}
          icon={<Pencil size={16} fill={true} />}
          className="text-regular"
        >
          
          Edit Profile
        </Button>

        {userType==="user" &&<Button
          variant="text"
          size="profile"
          onClick={onAddPothole}
          icon={<Plus size={18} fill={true} />}
        >
          Add Pothole
        </Button>}

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
