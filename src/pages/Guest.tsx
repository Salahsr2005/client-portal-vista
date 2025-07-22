import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Lock, CreditCard, User } from "lucide-react";
import { useGuestMode } from "@/contexts/GuestModeContext";

export default function Guest() {
  const navigate = useNavigate();
  const { enableGuestMode } = useGuestMode();

  useEffect(() => {
    enableGuestMode();
  }, [enableGuestMode]);

  const guestFeatures = [
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Browse Destinations",
      description: "Explore universities and programs worldwide",
      path: "/guest/destinations"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "View Programs",
      description: "Discover academic programs and requirements",
      path: "/guest/programs"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Check Services",
      description: "See our comprehensive service offerings",
      path: "/services"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Try Consultation",
      description: "Experience our automated consultation tool",
      path: "/guest/consultation"
    }
  ];

  const restrictions = [
    {
      icon: <Lock className="h-5 w-5" />,
      text: "Cannot apply to programs"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      text: "No payment features"
    },
    {
      icon: <User className="h-5 w-5" />,
      text: "Limited profile access"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-primary/20 text-primary">
            Guest Mode
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Euro Visa
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our platform and discover the possibilities. Sign up anytime to unlock full features.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {guestFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(feature.path)}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Restrictions Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="p-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
            <h3 className="text-lg font-semibold mb-4 text-amber-800 dark:text-amber-200">
              Guest Mode Limitations
            </h3>
            <div className="space-y-2">
              {restrictions.map((restriction, index) => (
                <div key={index} className="flex items-center space-x-3 text-amber-700 dark:text-amber-300">
                  {restriction.icon}
                  <span>{restriction.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to unlock full access?</h3>
          <div className="space-x-4">
            <Button 
              onClick={() => navigate("/register")}
              size="lg"
              className="px-8 py-3 rounded-full"
            >
              Sign Up Free
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate("/login")}
              size="lg"
              className="px-8 py-3 rounded-full"
            >
              Sign In
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}