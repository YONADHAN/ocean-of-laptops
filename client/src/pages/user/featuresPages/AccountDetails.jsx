import React from "react";
import {
  UserCircle,
  MapPin,
  CreditCard,
  Settings,
  Shield,
  ChevronRight,
} from "lucide-react";
const baseURL = "/user/features/account"
const AccountSettings = () => {
  const sections = [
    {
      title: "Personal Information",
      description: "Manage your personal details and preferences",
      icon: <UserCircle className="w-8 h-8 text-blue-500" />,
      link: baseURL+"/personal_info",
    },
    {
      title: "Address Management",
      description: "Add or edit your delivery addresses",
      icon: <MapPin className="w-8 h-8 text-blue-500" />,
      link: baseURL+"/addresses",
    },
    // {
    //   title: "Payment Information",
    //   description: "Manage your payment methods and billing details",
    //   icon: <CreditCard className="w-8 h-8 text-blue-500" />,
    //   link: baseURL+"/payment",
    // },
    // {
    //   title: "Account Preferences",
    //   description: "Customize your account settings and notifications",
    //   icon: <Settings className="w-8 h-8 text-blue-500" />,
    //   link: baseURL+"/preferences",
    // },
    {
      title: "Account Privacy and Security",
      description: "Manage your security settings and privacy controls",
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      link: baseURL+"/security",
    },
  ];

  return (
    <div className="min-h-11/12 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Account</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <a key={index} href={section.link} className="block group">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 min-h-[120px]">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">{section.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                        {section.title}
                      </h2>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
