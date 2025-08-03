import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const routeTitles = {
  '/': 'HealthCare - Home',
  '/doctors': 'HealthCare - Doctors List',
  '/doctors/:id': 'HealthCare - Doctor Profile',
  '/book-appointment/:doctorId': 'HealthCare - Book Appointment',
  '/about': 'HealthCare - About Us',
  '/contact': 'HealthCare - Contact',
  '/login': 'HealthCare - Login',
  '/register': 'HealthCare - Register',
  '/dashboard': 'HealthCare - Dashboard',
  '/admin/dashboard': 'HealthCare - Admin Dashboard',
  '/admin/manage-users': 'HealthCare - Manage Users',
  '/doctor/dashboard': 'HealthCare - Doctor Dashboard',
  '/doctor/schedule': 'HealthCare - Doctor Schedule',
  '/patient/dashboard': 'HealthCare - Patient Dashboard',
  '/receptionist/dashboard': 'HealthCare - Receptionist Dashboard',
  '/lab/dashboard': 'HealthCare - Lab Dashboard',
};

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    
    const path = location.pathname;
    
    
    let title = 'HealthCare - Page Not Found';
    
  
    if (routeTitles[path]) {
      title = routeTitles[path];
    } else {
     
      const pathKeys = Object.keys(routeTitles);
      for (const key of pathKeys) {
        
        const regexPattern = key.replace(/:[^\s/]+/g, '[^/]+');
        const regex = new RegExp(`^${regexPattern}$`);
        
        if (regex.test(path)) {
          title = routeTitles[key];
          break;
        }
      }
    }
    
    
    document.title = title;
  }, [location]);
};

export default useDocumentTitle;
