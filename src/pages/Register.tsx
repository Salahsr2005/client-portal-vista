
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Lock, Mail, User, Calendar, Phone, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import { ParticleField } from "@/components/ParticleField";
import { z } from "zod";

// Define schema for form validation
const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  confirmEmail: z.string(),
  phone: z.string().min(10, "Phone number is too short"),
  confirmPhone: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  dateOfBirth: z.string().refine(value => !!value, "Date of birth is required"),
  agreeTerms: z.boolean().refine(value => value === true, "You must agree to the terms and conditions")
}).refine(data => data.email === data.confirmEmail, {
  message: "Email addresses don't match",
  path: ["confirmEmail"]
}).refine(data => data.phone === data.confirmPhone, {
  message: "Phone numbers don't match",
  path: ["confirmPhone"]
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    confirmEmail: "",
    phone: "",
    confirmPhone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    agreeTerms: false,
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp, signInWithGoogle, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear error when field is being edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    try {
      registerSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setFormErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Form validation failed",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Sign up with Supabase and save user metadata
      const { error } = await signUp(formData.email, formData.password, {
        first_name: formData.firstName,
        last_name: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        phone: formData.phone,
      });

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // The user profile will be created automatically now via the useUserProfile hook
        // when they first log in and visit the dashboard
        toast({
          title: "Success",
          description: "Your account has been created successfully. Please check your email to verify your account.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
        <ParticleField />
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="fixed top-4 right-4 z-50"
        >
          <ThemeToggle />
        </motion.div>
        
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="fixed top-4 left-4 z-50"
        >
          <Link
            to="/"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="font-medium">Back to Home</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15
          }}
          className="w-full max-w-md"
        >
          <div className="glass-light dark:glass-dark rounded-2xl p-8 shadow-lg backdrop-blur-md border border-white/10">
            <motion.div 
              variants={containerVariants}
              className="text-center mb-8"
            >
              <motion.h1 
                variants={itemVariants} 
                className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent"
              >
                Create Account
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-muted-foreground"
              >
                Join Euro Visa and explore global opportunities
              </motion.p>
            </motion.div>

            <motion.form 
              variants={containerVariants}
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <motion.div 
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`pl-10 ${formErrors.firstName ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.firstName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.firstName}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`pl-10 ${formErrors.lastName ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.lastName && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="mail@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 ${formErrors.email ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="confirmEmail" className="text-sm font-medium">Confirm Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    placeholder="mail@example.com"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    className={`pl-10 ${formErrors.confirmEmail ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.confirmEmail && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmEmail}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`pl-10 ${formErrors.phone ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="confirmPhone" className="text-sm font-medium">Confirm Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPhone"
                    name="confirmPhone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.confirmPhone}
                    onChange={handleChange}
                    className={`pl-10 ${formErrors.confirmPhone ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.confirmPhone && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPhone}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`pl-10 ${formErrors.dateOfBirth ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.dateOfBirth && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.dateOfBirth}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 ${formErrors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
                  )}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center space-x-2">
                <Checkbox
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => 
                    setFormData({...formData, agreeTerms: checked as boolean})
                  }
                />
                <label htmlFor="agreeTerms" className={`text-sm ${formErrors.agreeTerms ? 'text-red-500' : ''}`}>
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>
              {formErrors.agreeTerms && (
                <p className="text-red-500 text-xs mt-1">{formErrors.agreeTerms}</p>
              )}

              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="relative my-4">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-background px-2 text-muted-foreground text-sm">
                    Or continue with
                  </span>
                </div>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignIn}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign up with Google
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}
