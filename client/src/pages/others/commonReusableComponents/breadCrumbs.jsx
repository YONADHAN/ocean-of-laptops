import React from "react";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ breadcrumbs }) => {
  return (
    <nav className="flex text-sm text-gray-600 dark:text-gray-300" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="inline-flex items-center">
            {index !== breadcrumbs.length - 1 ? (
              <Link
                to={breadcrumb.path}
                className="inline-flex items-center text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {breadcrumb.icon && <breadcrumb.icon className="mr-2 h-4 w-4" />}
                {breadcrumb.label}
              </Link>
            ) : (
              <span className="inline-flex items-center text-gray-700 dark:text-gray-200 font-medium">
                {breadcrumb.icon && <breadcrumb.icon className="mr-2 h-4 w-4" />}
                {breadcrumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
