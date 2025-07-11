import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MacbookPro } from "@/components/MacbookPro";
import { SpotlightGrid } from "@/components/ui/spotlight-grid";

export function PlatformPreviewSection() {
  const { t } = useTranslation();

  return (
    <SpotlightGrid className="py-24 relative bg-gradient-to-br from-background via-background/90 to-muted/20">
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

          {/* Advanced MacBook */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <MacbookPro />
          </motion.div>
        </motion.div>
      </div>
    </SpotlightGrid>
  );
}