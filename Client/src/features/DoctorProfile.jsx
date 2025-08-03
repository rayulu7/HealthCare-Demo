import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Award, 
  GraduationCap, 
  Star, 
  ChevronLeft,
  User
} from 'lucide-react';
import { usersAPI } from '../services/api';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getById(id);
      setDoctor(response.data.user);
    } catch (err) {
      setError('Failed to fetch doctor details');
      console.error('Error fetching doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading doctor profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">{error}</div>
          <Button onClick={fetchDoctor}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">Doctor not found</div>
          <Button onClick={() => navigate('/doctors')}>Back to Doctors</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/doctors')}
          className="mb-6 flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Button>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                {doctor.profileImage ? (
                  <img 
                    className="h-24 w-24 rounded-full object-cover" 
                    src={doctor.profileImage} 
                    alt={doctor.name} 
                  />
                ) : (
                  <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-24 w-24 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-semibold">
                      {doctor.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{doctor.name}</h1>
                <p className="text-primary-600 font-medium text-lg">{doctor.specialization}</p>
                <div className="mt-2 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">4.5 (128 reviews)</span>
                </div>
                <p className="mt-2 text-gray-600">{doctor.bio || 'No bio available'}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <Button 
                  size="lg"
                  onClick={() => navigate(`/book-appointment/${doctor._id}`)}
                  className="w-full md:w-auto"
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
         
            <div className="md:col-span-2">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-gray-600">Experience: {doctor.experience} years</span>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-gray-600">License: {doctor.licenseNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-gray-600">{doctor.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-primary-600 mr-2" />
                    <span className="text-gray-600">{doctor.email}</span>
                  </div>
                </div>
              </div>

              {doctor.education && doctor.education.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
                  <div className="space-y-3">
                    {doctor.education.map((edu, index) => (
                      <div key={index} className="flex items-start">
                        <GraduationCap className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">{edu.degree}</p>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doctor.achievements && doctor.achievements.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {doctor.achievements.map((achievement, index) => (
                      <li key={index} className="text-gray-600">{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            
            <div>
              <div className="bg-gray-50 rounded-lg p-5">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
                <div className="space-y-4">
                
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
                    <div key={day} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="font-medium">{day}</span>
                      <span className="text-gray-600">9:00 AM - 5:00 PM</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span className="font-semibold">${doctor.consultationFee}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Avg. Wait Time</span>
                    <span className="font-semibold">15 mins</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
