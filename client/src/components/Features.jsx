import React from 'react'

const Features = () => {
    return (
      <div className="w-full flex justify-center py-20 bg-cover bg-center" >
        <div className="w-[95%] max-w-[1200px] grid md:grid-cols-2 gap-8 text-white">
          <div>
            <h2 className="text-3xl font-bold text-teal-500">What does Queuely do?</h2>
            <p className="mt-4 text-gray-300">
            Queuely helps businesses manage queues efficiently, reducing wait times and improving customer experience with smart scheduling and real-time updates.
            </p>
            <button className="bg-teal-400 text-white px-6 py-2 rounded-full mt-6 hover:bg-teal-300">
              Let’s be in touch!
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-teal-800">Book Anytime, Anywhere</h3>
              <p className="text-sm text-black ">
              Skip the hassle of visiting in person—schedule your appointment online in seconds.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-teal-800"> No More Long Waits</h3>
              <p className="text-sm text-black ">
              Arrive just in time with automated reminders and updates.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-teal-800"> Skip the Crowds</h3>
              <p className="text-sm text-black ">
              No more waiting in packed clinics—book online and arrive just in time.
              </p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h3 className="font-bold text-teal-800">Minimize Missed Appointments</h3>
              <p className="text-sm text-black ">
              Timely reminders help ensure every slot is utilized efficiently.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default Features