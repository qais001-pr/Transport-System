import { Link } from 'react-router-dom';
import {
  Bus,
  Shield,
  MapPin,
  Clock,
  Users,
  Star,
  CheckCircle,
  Bell,
  Route,
  UserCheck,
  ArrowRight,
  Play,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function HomePage() {
  const features = [
    {
      icon: MapPin,
      title: 'Real-Time GPS Tracking',
      description: 'Track your child\'s van in real-time with live location updates and arrival notifications.',
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: Shield,
      title: 'Girls-Only Van Policy',
      description: 'Enhanced safety with mandatory gender-based vehicle allocation for girls aged 10+.',
      color: 'text-accent',
      bgColor: 'bg-accent-50',
    },
    {
      icon: Route,
      title: 'AI Route Optimization',
      description: 'Smart route planning based on school timings, locations, and traffic patterns.',
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
    {
      icon: UserCheck,
      title: 'Driver Verification',
      description: 'Complete background checks with license verification and photo identification.',
      color: 'text-primary',
      bgColor: 'bg-primary-50',
    },
    {
      icon: Bell,
      title: 'Instant Notifications',
      description: 'Get real-time alerts for pickups, drop-offs, delays, and important updates.',
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
    {
      icon: Star,
      title: 'Rating & Feedback',
      description: 'Rate drivers and provide feedback to ensure quality service for everyone.',
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Students', icon: Users },
    { value: '500+', label: 'Verified Drivers', icon: UserCheck },
    { value: '50+', label: 'Partner Schools', icon: Bus },
    { value: '4.9', label: 'Average Rating', icon: Star },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Register & Verify',
      description: 'Create your account as a parent, driver, or school administrator. Complete verification process.',
      icon: UserCheck,
    },
    {
      step: '02',
      title: 'Search & Book',
      description: 'Parents search for available vans by location, timing, cost, and ratings. Book seats instantly.',
      icon: MapPin,
    },
    {
      step: '03',
      title: 'Track & Monitor',
      description: 'Track your child\'s van in real-time with GPS. Receive notifications for all activities.',
      icon: Clock,
    },
    {
      step: '04',
      title: 'Rate & Review',
      description: 'Provide feedback after each trip to help maintain quality and safety standards.',
      icon: Star,
    },
  ];

  const testimonials = [
    {
      name: 'Muhammad Bilal',
      role: 'Parent',
      avatar: 'SJ',
      rating: 5,
      comment: 'This system has given me complete peace of mind. I can track my daughter\'s van in real-time and the drivers are thoroughly verified.',
    },
    {
      name: 'Ali Hamza',
      role: 'Van Driver',
      avatar: 'MC',
      rating: 5,
      comment: 'The route optimization feature saves me time and fuel. The platform is easy to use and parents appreciate the transparency.',
    },
    {
      name: 'Luqman Asif',
      role: 'School Administrator',
      avatar: 'ER',
      rating: 5,
      comment: 'Managing school transport has never been easier. We can monitor all vans, verify drivers, and handle complaints efficiently.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-primary via-primary-600 to-secondary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white animate-slide-up">
              <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-0">
                <Shield className="w-4 h-4" />
                Safe & Secure Transport
              </Badge>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                School Transport
                <span className="block text-highlight">Made Simple</span>
              </h1>

              <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
                Connect parents, drivers, and schools with our intelligent transport management system.
                Real-time tracking, verified drivers, and complete transparency.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-neutral-100 shadow-soft-lg">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center md:text-left">
                    <div className="text-3xl font-bold text-highlight mb-1">{stat.value}</div>
                    <div className="text-sm text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Illustration */}
            <div className="relative animate-fade-in">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Floating Cards */}
                <div className="absolute top-10 right-0 animate-float">
                  <Card className="p-4 shadow-card-hover">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Van Arrived</p>
                        <p className="text-xs text-neutral-600">2 mins ago</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="absolute bottom-10 left-0 animate-float" style={{ animationDelay: '1s' }}>
                  <Card className="p-4 shadow-card-hover">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-secondary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">Live Tracking</p>
                        <p className="text-xs text-neutral-600">5 km away</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Central Image Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-white/20">
                    <Bus className="w-40 h-40 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-16 animate-slide-up">
            <Badge variant="primary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Everything You Need for
              <span className="gradient-text"> Safe Transport</span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Comprehensive features designed to ensure safety, efficiency, and peace of mind for everyone involved.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              Process
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Get started in four simple steps and experience hassle-free school transportation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <Card hover className="h-full">
                  <div className="text-6xl font-bold text-primary-100 mb-4">{item.step}</div>
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-primary-200" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="section bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="danger" className="mb-4">
                <Shield className="w-4 h-4" />
                Safety First
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
                Your Child's Safety is Our
                <span className="gradient-text"> Top Priority</span>
              </h2>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                We've implemented multiple layers of safety features to ensure every journey is secure and monitored.
              </p>

              <div className="space-y-4">
                {[
                  'Complete driver background verification and license validation',
                  'Real-time GPS tracking with geofencing alerts',
                  'Girls-Only van policy for enhanced security',
                  'School guard verification at pickup and drop-off points',
                  'Emergency contact system and instant notifications',
                  'Driver photo verification for parental assurance',
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-neutral-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/safety">
                  <Button variant="primary" size="lg">
                    Learn More About Safety
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">100%</h3>
                  <p className="text-sm text-neutral-600">Verified Drivers</p>
                </Card>

                <Card className="p-6 mt-8">
                  <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mb-4">
                    <MapPin className="w-6 h-6 text-secondary-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">24/7</h3>
                  <p className="text-sm text-neutral-600">Live Tracking</p>
                </Card>

                <Card className="p-6">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-4">
                    <Bell className="w-6 h-6 text-accent-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">Instant</h3>
                  <p className="text-sm text-neutral-600">Alerts & Notifications</p>
                </Card>

                <Card className="p-6 mt-8">
                  <div className="w-12 h-12 bg-highlight-100 rounded-xl flex items-center justify-center mb-4">
                    <Star className="w-6 h-6 text-highlight-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">4.9/5</h3>
                  <p className="text-sm text-neutral-600">Parent Rating</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <Badge variant="warning" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Hear from parents, drivers, and administrators who trust our platform daily.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} hover>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-highlight text-highlight" />
                  ))}
                </div>
                <CardContent>
                  <p className="text-neutral-700 mb-6 leading-relaxed">"{testimonial.comment}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id='contact' className="section bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your School Transport?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of parents, drivers, and schools who trust our platform for safe and efficient transportation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-neutral-100 shadow-soft-lg">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
