import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export function PlatformPreviewSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 relative bg-gradient-to-br from-background via-background/90 to-muted/20">
      <div className="container max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Explore our platform
          </h2>
          <h3 className="text-2xl md:text-3xl text-muted-foreground">
            before the official launch
          </h3>

          {/* Laptop mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative">
              {/* Laptop frame */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-t-3xl p-8 shadow-2xl">
                {/* Screen bezel */}
                <div className="bg-black rounded-lg p-4 relative overflow-hidden">
                  {/* Screen content */}
                  <div className="bg-white rounded-lg h-80 md:h-96 relative overflow-hidden">
                    {/* Mock consultation interface */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-lg font-semibold text-gray-800">Consultation Automatique</h4>
                          <div className="text-sm text-gray-600">Questionnaire Avancé</div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="text-sm text-gray-600 mb-2">Questionnaire interactif</div>
                              <div className="space-y-2">
                                <div className="h-2 bg-green-200 rounded-full"></div>
                                <div className="h-2 bg-green-200 rounded-full w-3/4"></div>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 shadow-sm">
                              <div className="text-sm text-gray-600">Analyse automatique</div>
                            </div>
                          </div>
                          
                          <div className="bg-green-500 rounded-lg p-6 text-white">
                            <div className="text-xl font-bold mb-2">Questionnaire Guidé</div>
                            <div className="text-sm opacity-90 mb-4">
                              Commencez le questionnaire interactif pour découvrir les destinations et universités qui correspondent à votre profil
                            </div>
                            <button className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium">
                              Commencer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Laptop base */}
              <div className="bg-gradient-to-br from-gray-700 to-gray-800 h-8 rounded-b-3xl relative">
                <div className="absolute inset-x-0 top-2 flex justify-center">
                  <div className="w-16 h-1 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-teal-500/20 blur-3xl opacity-50 -z-10 scale-110"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}