
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  FileText, 
  Calendar, 
  CreditCard, 
  Globe, 
  TrendingUp, 
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  BookOpen,
  Target,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function EnhancedDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ['user-data', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('client_users')
        .select('*, client_profiles(*)')
        .eq('client_id', user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch applications data
  const { data: applications = [] } = useQuery({
    queryKey: ['user-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('applications')
        .select('*, programs(name, university, country)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch payments data
  const { data: payments = [] } = useQuery({
    queryKey: ['user-payments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch appointments data
  const { data: appointments = [] } = useQuery({
    queryKey: ['user-appointments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('appointments')
        .select('*, appointment_slots(date_time, location)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Calculate statistics
  const stats = {
    applications: applications.length,
    submitted: applications.filter(app => app.status === 'Submitted').length,
    approved: applications.filter(app => app.status === 'Approved').length,
    totalPaid: payments.filter(p => p.status === 'Completed').reduce((sum, p) => sum + parseFloat(String(p.amount)), 0),
    upcomingAppointments: appointments.filter(app => app.status === 'Reserved').length,
  };

  const profileCompletion = calculateProfileCompletion(userData);

  function calculateProfileCompletion(data: any) {
    if (!data) return 0;
    const fields = [
      data?.first_name,
      data?.last_name,
      data?.phone,
      data?.date_of_birth,
      data?.nationality,
      data?.client_profiles?.[0]?.current_address,
      data?.client_profiles?.[0]?.education_background,
    ];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {userData?.first_name || 'Student'}! 👋
              </h1>
              <p className="text-violet-100 text-lg">
                Ready to continue your study abroad journey?
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-sm opacity-90">Profile Completion</p>
                <div className="flex items-center gap-2 mt-2">
                  <Progress value={profileCompletion} className="w-20" />
                  <span className="font-bold">{profileCompletion}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Applications</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.applications}</p>
                </div>
                <div className="bg-blue-600 p-3 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100">{stats.approved}</p>
                </div>
                <div className="bg-green-600 p-3 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Paid</p>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">{formatCurrency(stats.totalPaid)}</p>
                </div>
                <div className="bg-purple-600 p-3 rounded-full">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Appointments</p>
                  <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{stats.upcomingAppointments}</p>
                </div>
                <div className="bg-orange-600 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Applications
              </CardTitle>
              <CardDescription className="text-violet-100">
                Your latest program applications
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.slice(0, 3).map((app, index) => (
                    <motion.div
                      key={app.application_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700"
                    >
                      <div>
                        <h4 className="font-medium">{app.programs?.name}</h4>
                        <p className="text-sm text-muted-foreground">{app.programs?.university}, {app.programs?.country}</p>
                      </div>
                      <Badge 
                        variant={app.status === 'Approved' ? 'default' : app.status === 'Submitted' ? 'secondary' : 'outline'}
                        className={app.status === 'Approved' ? 'bg-green-600' : ''}
                      >
                        {app.status}
                      </Badge>
                    </motion.div>
                  ))}
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/applications')}
                  >
                    View All Applications
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No applications yet</p>
                  <Button onClick={() => navigate('/applications/new')} className="bg-gradient-to-r from-violet-600 to-purple-600">
                    Create First Application
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription className="text-indigo-100">
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 gap-2 hover:bg-violet-50"
                  onClick={() => navigate('/programs')}
                >
                  <BookOpen className="h-6 w-6 text-violet-600" />
                  <span className="text-sm">Browse Programs</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 gap-2 hover:bg-blue-50"
                  onClick={() => navigate('/consultation')}
                >
                  <User className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">Get Consultation</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 gap-2 hover:bg-green-50"
                  onClick={() => navigate('/payments')}
                >
                  <CreditCard className="h-6 w-6 text-green-600" />
                  <span className="text-sm">Make Payment</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex flex-col h-24 gap-2 hover:bg-orange-50"
                  onClick={() => navigate('/appointments')}
                >
                  <Calendar className="h-6 w-6 text-orange-600" />
                  <span className="text-sm">Book Meeting</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
