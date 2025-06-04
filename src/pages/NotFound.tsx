
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg border-0 bg-background/80 backdrop-blur-md">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4"
            >
              <span className="text-4xl font-bold text-primary">404</span>
            </motion.div>
            <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
            <CardDescription className="text-base">
              The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground text-center">
              <strong>Path:</strong> {location.pathname}
            </div>
            
            <div className="flex flex-col gap-3">
              <Link to="/" className="w-full">
                <Button className="w-full gap-2" size="lg">
                  <Home className="h-4 w-4" />
                  Return to Home
                </Button>
              </Link>
              
              <Link to="/dashboard" className="w-full">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  <ArrowLeft className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
              
              <Link to="/programs" className="w-full">
                <Button variant="ghost" className="w-full gap-2" size="lg">
                  <Search className="h-4 w-4" />
                  Browse Programs
                </Button>
              </Link>
            </div>
            
            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              If you believe this is an error, please contact support.
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default NotFound;
