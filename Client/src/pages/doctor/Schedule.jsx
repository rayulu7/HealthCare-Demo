import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react';
import { scheduleAPI } from '../../services/api';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    isAvailable: true
  });

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
     
      const mockSchedule = [
        { id: 1, day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { id: 2, day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { id: 3, day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { id: 4, day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true },
        { id: 5, day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true },
      ];
      setSchedule(mockSchedule);
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlot = () => {
    const newSlotWithId = {
      ...newSlot,
      id: Date.now() 
    };
    setSchedule([...schedule, newSlotWithId]);
    setNewSlot({
      day: 'Monday',
      startTime: '09:00',
      endTime: '17:00',
      isAvailable: true
    });
  };

  const handleDeleteSlot = (id) => {
    setSchedule(schedule.filter(slot => slot.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSlot({
      ...newSlot,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <Loader size="lg" text="Loading schedule..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Schedule</h1>
        <Button variant="primary" onClick={fetchSchedule}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Time Slot</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  name="day"
                  value={newSlot.day}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      name="startTime"
                      value={newSlot.startTime}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      name="endTime"
                      value={newSlot.endTime}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={newSlot.isAvailable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Available for appointments
                </label>
              </div>

              <Button 
                variant="primary" 
                onClick={handleAddSlot}
                className="w-full flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Current Schedule</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {schedule.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No schedule slots</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by adding a new time slot.</p>
                </div>
              ) : (
                schedule.map((slot) => (
                  <div key={slot.id} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">{slot.day}</h3>
                        <p className="text-sm text-gray-500">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        slot.isAvailable 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {slot.isAvailable ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        onClick={() => handleDeleteSlot(slot.id)}
                        className="ml-4 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
