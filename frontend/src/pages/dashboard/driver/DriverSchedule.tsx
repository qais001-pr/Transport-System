import { useContext, useState } from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  School,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Navigation,
} from 'lucide-react';
import userContext from "../../../context/userContext";

export default function DriverSchedule() {
  const [currentWeek, setCurrentWeek] = useState(0);
  const { user, logOut }: any = useContext(userContext);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const schedule = {
    Monday: [
      {
        id: 1,
        type: 'pickup',
        route: 'Route A - Morning Pickup',
        time: '7:00 AM - 8:30 AM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'completed',
      },
      {
        id: 2,
        type: 'dropoff',
        route: 'Route A - Afternoon Drop',
        time: '2:30 PM - 4:00 PM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'scheduled',
      },
    ],
    Tuesday: [
      {
        id: 3,
        type: 'pickup',
        route: 'Route A - Morning Pickup',
        time: '7:00 AM - 8:30 AM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'completed',
      },
      {
        id: 4,
        type: 'dropoff',
        route: 'Route A - Afternoon Drop',
        time: '2:30 PM - 4:00 PM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'scheduled',
      },
    ],
    Wednesday: [
      {
        id: 5,
        type: 'pickup',
        route: 'Route A - Morning Pickup',
        time: '7:00 AM - 8:30 AM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'in-progress',
      },
      {
        id: 6,
        type: 'dropoff',
        route: 'Route A - Afternoon Drop',
        time: '2:30 PM - 4:00 PM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'scheduled',
      },
    ],
    Thursday: [
      {
        id: 7,
        type: 'pickup',
        route: 'Route A - Morning Pickup',
        time: '7:00 AM - 8:30 AM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'scheduled',
      },
      {
        id: 8,
        type: 'dropoff',
        route: 'Route A - Afternoon Drop',
        time: '2:30 PM - 4:00 PM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'scheduled',
      },
    ],
    Friday: [
      {
        id: 9,
        type: 'pickup',
        route: 'Route A - Morning Pickup',
        time: '7:00 AM - 8:30 AM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'scheduled',
      },
      {
        id: 10,
        type: 'dropoff',
        route: 'Route A - Afternoon Drop',
        time: '2:30 PM - 4:00 PM',
        school: 'Lincoln Elementary',
        students: 12,
        stops: 8,
        status: 'scheduled',
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3" />
            In Progress
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="secondary">
            <Calendar className="w-3 h-3" />
            Scheduled
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="danger">
            <XCircle className="w-3 h-3" />
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const stats = [
    {
      title: 'This Week',
      value: '10',
      subtitle: 'Total Routes',
      icon: Navigation,
      color: 'text-primary',
      bgColor: 'bg-primary-50',
    },
    {
      title: 'Completed',
      value: '4',
      subtitle: 'Routes Done',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Upcoming',
      value: '6',
      subtitle: 'Scheduled',
      icon: Clock,
      color: 'text-secondary',
      bgColor: 'bg-secondary-50',
    },
    {
      title: 'Total Hours',
      value: '15',
      subtitle: 'This Week',
      icon: Clock,
      color: 'text-highlight',
      bgColor: 'bg-highlight-50',
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar
        userRole={user?.role || "Guest"}
        userName={user?.full_name || "Zaman Ali"}
        userEmail={user?.email || "zaman.ali@example.com"}
        logOut={logOut}
      />

      <div className="flex-1">
        <Header title="My Schedule" subtitle="View and manage your weekly route schedule" role={user?.role}
          profile={user?.profile_photo || ""}/>

        <main className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-neutral-600">{stat.title}</p>
                  <p className="text-xs text-neutral-500">{stat.subtitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Week Navigation */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                  Previous Week
                </Button>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {currentWeek === 0 ? 'Current Week' : `Week ${currentWeek > 0 ? '+' : ''}${currentWeek}`}
                  </h3>
                  <p className="text-sm text-neutral-600">October 7 - October 11, 2025</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek + 1)}>
                  Next Week
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Schedule Grid */}
          <div className="grid lg:grid-cols-5 gap-6">
            {weekDays.map((day) => (
              <Card key={day} className={day === 'Wednesday' ? 'border-2 border-primary' : ''}>
                <CardHeader>
                  <CardTitle className="text-center">
                    {day}
                    {day === 'Wednesday' && (
                      <Badge variant="primary" className="ml-2 text-xs">
                        Today
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {schedule[day as keyof typeof schedule].length} routes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {schedule[day as keyof typeof schedule].map((route) => (
                      <div
                        key={route.id}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer hover:shadow-card ${
                          route.status === 'in-progress'
                            ? 'border-primary bg-primary-50'
                            : route.status === 'completed'
                            ? 'border-green-200 bg-green-50'
                            : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="mb-3">
                          {getStatusBadge(route.status)}
                        </div>

                        <div className="mb-3">
                          <Badge variant={route.type === 'pickup' ? 'primary' : 'secondary'} className="text-xs mb-2">
                            {route.type === 'pickup' ? 'Pickup' : 'Drop-off'}
                          </Badge>
                          <h4 className="font-semibold text-neutral-900 text-sm mb-1">
                            {route.route}
                          </h4>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Clock className="w-3 h-3" />
                            <span>{route.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <School className="w-3 h-3" />
                            <span>{route.school}</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <Users className="w-3 h-3" />
                            <span>{route.students} students</span>
                          </div>
                          <div className="flex items-center gap-2 text-neutral-600">
                            <MapPin className="w-3 h-3" />
                            <span>{route.stops} stops</span>
                          </div>
                        </div>

                        {route.status === 'in-progress' && (
                          <Button variant="primary" size="sm" className="w-full mt-3">
                            <Navigation className="w-3 h-3" />
                            Continue
                          </Button>
                        )}

                        {route.status === 'scheduled' && (
                          <Button variant="outline" size="sm" className="w-full mt-3">
                            View Details
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Monthly Overview */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>October 2025 statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-neutral-50 rounded-lg">
                  <p className="text-3xl font-bold text-neutral-900 mb-1">40</p>
                  <p className="text-sm text-neutral-600">Total Routes</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600 mb-1">35</p>
                  <p className="text-sm text-neutral-600">Completed</p>
                </div>
                <div className="text-center p-4 bg-secondary-50 rounded-lg">
                  <p className="text-3xl font-bold text-secondary mb-1">5</p>
                  <p className="text-sm text-neutral-600">Remaining</p>
                </div>
                <div className="text-center p-4 bg-highlight-50 rounded-lg">
                  <p className="text-3xl font-bold text-highlight mb-1">98%</p>
                  <p className="text-sm text-neutral-600">On-Time Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
