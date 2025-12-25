import { observer } from "mobx-react-lite";
import { useState } from "react";
import ProfilePhotoTabContent from "./ProfilePhotosTab";
import { useStore } from "../../stores/Store";
import type ProfileStore from "../../stores/ProfileStore";

function ProfileContent() {
  const { profileStore } = useStore();
  const tabContents = getTabContents(profileStore);
  const [activeTabContent, setActiveTabContent] = useState(tabContents[0]);

  return (
    <div className="flex items-start gap-5 mt-5">
      <div className="flex-[2] bg-base-100 inset-ring inset-ring-gray-300 shadow-lg rounded rounded-lg min-h-50 mb-5">
        {activeTabContent.renderTabContent()}
      </div>
      <ul className="items-start bg-base-100 inset-ring inset-ring-gray-300 shadow-lg rounded rounded-lg">
        {tabContents.map((tabContent) => (
          <li
            key={tabContent.id}
            className={`flex-[1] w-40 p-2 transition-all duration-300 cursor-pointer hover:bg-base-300
              ${
                activeTabContent.id === tabContent.id
                  ? "bg-base-300 text-blue-600"
                  : ""
              }`}
            onClick={() => setActiveTabContent(tabContent)}
          >
            {tabContent.menuItem}
          </li>
        ))}
      </ul>
    </div>
  );
}

function getTabContents(profileStore: ProfileStore) {
  return [
    {
      id: 1,
      menuItem: "About",
      renderTabContent: () => "User profile information",
    },
    {
      id: 2,
      menuItem: "Photos",
      renderTabContent: () => (
        <ProfilePhotoTabContent photos={profileStore.profile?.photos} />
      ),
    },
    {
      id: 3,
      menuItem: "Events",
      renderTabContent: () => "Security and passwords",
    },
    {
      id: 4,
      menuItem: "Followers",
      renderTabContent: () => "Security and passwords",
    },
    {
      id: 5,
      menuItem: "Following",
      renderTabContent: () => "Security and passwords",
    },
  ];
}

export default observer(ProfileContent);
