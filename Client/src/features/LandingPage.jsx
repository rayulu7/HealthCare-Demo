import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Shield, 
  Clock, 
  Star, 
  ArrowRight, 
  Heart,
  Activity,
  Award,
  Stethoscope,
  Search,
  UserPlus
} from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  const features = [
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Easy Booking',
      description: 'Book appointments with top doctors in just a few clicks'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Expert Doctors',
      description: 'Connect with verified healthcare professionals'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure Platform',
      description: 'Your health data is protected with advanced security'
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for your needs'
    },
  ];

  const stats = [
    { icon: <Users className="h-8 w-8" />, value: '10,000+', label: 'Happy Patients' },
    { icon: <Stethoscope className="h-8 w-8" />, value: '500+', label: 'Expert Doctors' },
    { icon: <Calendar className="h-8 w-8" />, value: '50,000+', label: 'Appointments' },
    { icon: <Award className="h-8 w-8" />, value: '4.9/5', label: 'Rating' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'MediCare made booking appointments so easy. The platform is intuitive and the doctors are excellent.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      content: 'As a healthcare provider, I love how MediCare streamlines patient management and scheduling.',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Patient',
      content: 'The ML recommendations helped me find the perfect specialist for my condition. Highly recommended!',
      rating: 5
    },
  ];

  return (
    <div className="min-h-screen">
      
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Your Health,{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                    Our Priority
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Book appointments with top healthcare professionals, manage your health records, 
                  and get personalized care recommendations powered by AI.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  icon={<Calendar className="h-5 w-5" />}
                  className="hover:scale-105 transform transition-all"
                >
                  <Link to="/doctors">Find Doctors</Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  icon={<UserPlus className="h-5 w-5" />}
                >
                  <Link to="/register">Create Account</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-400 to-secondary-400 border-2 border-white"></div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">10,000+ patients trust us</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">Quick Stats</h3>
                    <Activity className="h-8 w-8 text-primary-600" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center p-4 rounded-xl bg-gradient-to-br from-primary-50 to-secondary-50">
                        <div className="text-primary-600 mb-2 flex justify-center">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
          
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full opacity-20 animate-pulse-slow"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-secondary-400 to-accent-400 rounded-full opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose MediCare?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with compassionate care to provide 
              you with the best healthcare experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 rounded-2xl border border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="text-primary-600 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting healthcare has never been easier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Find Doctor',
                description: 'Browse our network of verified healthcare professionals',
                icon: <Search className="h-8 w-8" />
              },
              {
                step: '2',
                title: 'Book Appointment',
                description: 'Select a convenient time and date for your visit',
                icon: <Calendar className="h-8 w-8" />
              },
              {
                step: '3',
                title: 'Consult & Care',
                description: 'Receive expert care and follow-up treatment',
                icon: <Heart className="h-8 w-8" />
              },
            ].map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <div className="text-primary-600 mb-4 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
                
                {index < 2 && (
                  <ArrowRight className="hidden md:block absolute top-8 -right-4 lg:-right-8 h-6 w-6 text-primary-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of patients and healthcare professionals
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

   
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Heart className="h-16 w-16 text-white mx-auto mb-8" fill="white" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of patients who trust MediCare for their healthcare needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="hover:scale-105 transform transition-all"
            >
              <Link to="/doctors">Find a Doctor</Link>
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="text-white border-white hover:bg-white/10"
            >
              <Link to="/register">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
