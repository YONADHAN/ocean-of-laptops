import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, UserMinusIcon, ShieldIcon as ShieldExclamationIcon, ChevronRightIcon, ShieldCheckIcon } from 'lucide-react';

const AccountPrivacyAndSecurity = () => {
  const navigate = useNavigate();

  const securityCards = [
    {
      icon: <LockIcon className="w-8 h-8 text-blue-500" />,
      title: "Reset Your Password",
      description: "Secure your account by updating your password regularly.",
      link: "/user/features/account/security/change-password"
    },
    {
      icon: <ShieldCheckIcon className="w-8 h-8 text-blue-500" />,
      title: "Forgot Your Password",
      description: "Get in touch with us with our easy process to reset password.",
      link: "/user/features/account/security/verify-email"
    },
    {
      icon: <UserMinusIcon className="w-8 h-8 text-red-500" />,
      title: "Terminate Your Account",
      description: "Permanently delete your account and all associated data.",
      link: "/user/terminate_account"
    },
    {
      icon: <ShieldExclamationIcon className="w-8 h-8 text-yellow-500" />,
      title: "Report Security Issues",
      description: "Help us improve by reporting any security concerns.",
      link: "/user/complaint"
    }
  ];

  const SecurityCard = ({ icon, title, description, link }) => {
    const handleClick = () => {
      navigate(link);
    };

    return (
      <div 
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer flex items-center space-x-4 w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] mb-6"
        onClick={handleClick}
      >
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="flex-grow">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <ChevronRightIcon className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Account Privacy and Security</h1>
        <div className="flex flex-wrap justify-center -mx-3 gap-3">
          {securityCards.map((card, index) => (
            <SecurityCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPrivacyAndSecurity;

