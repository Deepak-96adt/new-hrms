import './SideBar.css';
import { FaHome, FaUser,  FaUserPlus, FaClock,  FaFileInvoice,FaAward,FaStopwatch,FaStopwatch20 } from 'react-icons/fa';
import { FaList, FaClipboardList } from 'react-icons/fa';
import {  FaInfoCircle } from 'react-icons/fa';
import {AiOutlineLaptop} from 'react-icons/ai';
import {FaLaptopMedical} from 'react-icons/fa'
import {  FaDollarSign  } from 'react-icons/fa';
import { FaUserAlt, FaBriefcase,  } from 'react-icons/fa';
import { FaPlus,  FaReceipt,FaLock,FaBars } from 'react-icons/fa';
import { FaHandshake } from 'react-icons/fa';
import { FaUserFriends } from 'react-icons/fa';
 import {MdCreateNewFolder} from 'react-icons/md'
 import { useSelector } from 'react-redux';

import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";
const height = `calc(100vh - 80px)`;
const routes = [
  {
    path: "/TimeSheet",
    name: "Time Sheet",
    icon: <FaClock />,
    Permission: "BASIC_HRMS",
  },
  {
    path: "/messages",
    name: "Employee Management",
    icon: <FaUserAlt />,
    subRoutes: [
      {
        path: "/RegisterUser",
        name: "Add Employee",
        icon: <FaUserAlt />,
        Permission: "MANAGE_EMPLOYEE",
      },
      {
        path: "/empfunc",
        name: "View Employee Details",
        icon: <FaUserAlt />,
        Permission: "MANAGE_EMPLOYEE",
      },
      {
        path: "/GetAllEmpAttendance",
        name: "View Employee Attendence",
        icon: <FaClock />,
        Permission: "MANAGE_TIMESHEET", 
      },
      // {
      //   path: "/CreateEmpAssets",
      //   name: "Add Employee Asset",
      //   icon: <FaLaptopMedical />,
      // },
      
      {
        path: "/GetAllAssets",
        name: "Manage Assets",
        icon: <AiOutlineLaptop />,
        Permission:"MANAGE_ASSETS",
      },
      // {
      //   path: "/SearchEmpAssets",
      //   name: "Search Employee Asset",
      //   icon: <FaLaptopMedical />,
      // }
    ],
  },
  {
    path: "/",
    name: "Expense Management",
    icon: <FaDollarSign />,
    subRoutes: [
      {
        path: "/Capex",
        name: "Add Capital Expense",
        icon:  <FaList />,
        Permission:"MANAGE_CAPITAL_EXPENSE",
      },
      {
        path: "/createExpense",
        name: "Add Expense",
        icon: <FaReceipt />,
        Permission:"MANAGE_EXPENSE_SELF",
      },
      {
        path: "/Getallexpenses",
        name: "View Expense",
        icon: <FaLock />,
        Permission:"MANAGE_EXPENSE_SELF",
      },
      {
        path: "/Gstinvoice",
        name: "Add GST Invoice",
        icon: <FaReceipt />,
        Permission:"MANAGE_GST",
      },
      {
        path: "/GetGstDetails",
        name: "View GST Invoice",
        icon: <FaList />,
        Permission:"MANAGE_GST",
      },
    ],
  },
  {
    path: "/file-manager",
    name: "Partner",
    icon: <FaHandshake />,
    subRoutes: [
      {
        path: "/createClientformik",
        name: "Add Client Info",
        icon: <FaUserPlus />,
        Permission:"MANAGE_CLIENT",
      },
      {
        path: "/Getclientinfo",
        name: "View Client Info ",
        icon: <FaInfoCircle />,
        Permission:"MANAGE_CLIENT",
      },
      {
        path: "/CreateProjEng",
        name: "Add Project Engagement",
        icon: <MdCreateNewFolder />,
        Permission:"MANAGE_PROJECT_ENGAGEMENT",
      },
      {
        path: "/GetAllPrEngagement",
        name: "View Project Engagement",
        icon: <FaHandshake />,
        Permission:"MANAGE_PROJECT_ENGAGEMENT",
      }, 
      ],
  },
  {
    path: "/",
    name: "Employee Services",
    icon: <FaUserPlus />,
    subRoutes: [
      // {
      //   path: "/CreatePayslip",
      //   name: "Add Salary Details",
      //   icon: <FaFileInvoice />,
      // },
      {
        path: "/payslip",
        name: "View Payslip ",
        icon: <FaFileInvoice />,
        Permission:"BASIC_HRMS",
      },
      {
        path: "/EmployeeSalary",
        name: "Employee Salary",
        icon: <FaFileInvoice />,
        Permission:"MANAGE_PAYROLL",
      },
      {
        path: "/HolidayCalender",
        name: "Holiday",
        icon: <FaFileInvoice />,
        Permission:"BASIC_HRMS",
       // Permission:"MANAGE_HOLIDAY",
      },
      // {
      //   path: "/HolidayCalender",
      //   name: "View Holiday",
      //   icon: <FaFileInvoice />,
      //   Permission:"BASIC_HRMS",
      // },
      // {
      //   path: "/ViewEmpLeaveBalance",
      //   name: "View Employee Leave Balance",
      //   icon: <FaFileInvoice />,
      //   Permission:"BASIC_HRMS",
      // },
    ],
  },
  {
    path: "/",
    name: "Performance & Rewards",
    icon: <FaAward />,
    subRoutes: [
      {
        path: "/AddAppraisalDetails",
        name: "Add Appraisal Details",
        icon: <FaFileInvoice />,
        Permission:"MANAGE_APPRAISAL",
      },
      {
        path: "/GetAllEmpAppraisalDetails",
        name: "View Appraisal Details",
        icon: <FaFileInvoice />,
        Permission:"MANAGE_APPRAISAL",
      },
    ],
  },
  {
    path: "/",
    name: "Hiring",
    icon: <FaUserFriends />,
    exact: true,
    subRoutes: [
      {
        path: "/createposition",
        name: "Add Position ",
        icon: <FaClipboardList />,
        Permission:"MANAGE_POSITION",
      },
      {
        path: "/positiondetails",
        name: " View Position",
        icon: <FaBriefcase />,
        Permission:"MANAGE_POSITION",
      },
      {
        path: "/createCandidate",
        name: "Add Candidate Details",
        icon:  <FaUserPlus />,
        Permission:"MANAGE_CANDIDATE_DETAILS",
      },
      {
        path: "/getcandidate",
        name: "View Candidate Details ",
        icon: <FaUser />,
        Permission:"MANAGE_CANDIDATE_DETAILS",
      },
      {
        path: "/createinterview",
        name: "Add Interview Details",
        icon: <FaPlus />,
        Permission:"MANAGE_INTERVIEW",
      },
      {
        path: "/getinterviewdetails",
        name: "View Interview Details",
        icon: <FaList />,
        Permission:"MANAGE_INTERVIEW",
      },
    ],
  },
  {
    path: "/",
    name: "Manage Scheduler",
    icon: <FaStopwatch />,
    Permission:"MANAGE_INTERVIEW",
    subRoutes: [
      {
        path: "/getAllScheduler",
        name: "All Scheduler",
        icon: <FaFileInvoice />,
        Permission:"MANAGE_APPRAISAL",
      },
      {
        path: "/addScheduler",
        name: "Add Scheduler",
        icon: <FaFileInvoice />,
        Permission:"MANAGE_APPRAISAL",
      },
    ],
  }
 
];

const SideBar = ({ children }) => {
  const  permission = useSelector((state) => state.auth.permissions);
  console.log(permission);
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: "140px",
      padding: "5px 15px",
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.5,
      },
    },
  };


function filterRoutesByPermissions(routes, permissions) {
  return routes
    .filter(route => {
      // Check if the route's permission is in the permissions array
      const hasPermission = permissions.includes(route.Permission);

      // If the route has subRoutes, filter them based on permission
      if (route.subRoutes && route.subRoutes.length > 0) {
        route.subRoutes = route.subRoutes.filter(subRoute =>
          permissions.includes(subRoute.Permission)
        );
      }

      // Return the route if it has permission or if it has valid subRoutes
      return hasPermission || (route.subRoutes && route.subRoutes.length > 0);
    })
    .map(route => {
      // Ensure subRoutes is an empty array if no valid subRoutes exist
      return {
        ...route,
        // subRoutes: route.subRoutes ? route.subRoutes : [],
        subRoutes: route.subRoutes && route.subRoutes,
      };
    });
}

// Apply the filtering function
const filteredRoutes = filterRoutesByPermissions(routes, permission);

// Log the filtered routes
console.log("-------------------");
console.log(filteredRoutes);
console.log("--------------------");
  


  return (
    <>

      <div className=" main-container1">
      <motion.div
          animate={{
            width: isOpen ? "260px" : "45px",
            maxHeight: height,
            minHeight: height,
            paddingBottom:'20px',
            transition: {
              duration: 0.5,
              type: "spring",
              damping: 10,
            },
            position: "sticky",
            left:0,
            top: "80px",
            zIndex: 1200,
            overflowY:'auto',
          }}
          className={`sidebar1 `}
        >
          <div className="top_section1">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo1"
                >
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars1">
              <FaBars onClick={toggle} />
            </div>
          </div>
          {/* <div className="search1">
            <div className="search_icon1">
              <BiSearch />
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.input
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={inputAnimation}
                  type="text"
                  placeholder="Search"
                />
              )}
            </AnimatePresence>
          </div> */}
          <section className="routes1">
            {filteredRoutes.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink
                  to={route.path}
                  key={index}
                  className="link1"
                  activeClassName="active1"
                >
                  <div className="icon1">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text1"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>
        <main>{children}</main>
      </div>
    </>
  );
};

export default SideBar;

