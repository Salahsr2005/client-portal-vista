
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";

export function FaqSection() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: "What services does Euro Visa offer?",
      answer: "Euro Visa offers comprehensive visa consultation, educational program placement, immigration guidance, document preparation, application submission, and post-approval support services for students and professionals seeking international opportunities."
    },
    {
      question: "How long does the visa application process take?",
      answer: "The visa application process varies depending on the destination country and visa type. Typically, processing times range from 2 weeks to 3 months. Our consultants will provide you with specific timelines based on your individual case."
    },
    {
      question: "Do you guarantee visa approval?",
      answer: "While we cannot guarantee visa approval as the final decision rests with immigration authorities, we have a high success rate due to our expertise in preparing complete and accurate applications that meet all requirements and address potential concerns."
    },
    {
      question: "What educational programs can you help me apply to?",
      answer: "We assist with applications to a wide range of educational programs including undergraduate degrees, master's programs, PhDs, language courses, vocational training, and professional certifications across multiple countries and institutions."
    },
    {
      question: "How do I schedule a consultation?",
      answer: "You can schedule a consultation by filling out the contact form on our website, calling our office directly, or sending us an email. Our team will respond within 24 hours to arrange a convenient time for your consultation."
    },
    {
      question: "What documents will I need for my application?",
      answer: "Required documents vary based on the visa type and destination country, but typically include passport, educational certificates, financial statements, proof of accommodation, and language proficiency tests. Our consultants will provide you with a detailed checklist tailored to your specific application."
    },
    {
      question: "Do you offer services for family immigration?",
      answer: "Yes, we provide comprehensive family immigration services including spouse visas, dependent visas, family reunification, and permanent residency applications for families looking to relocate together."
    },
    {
      question: "What happens if my visa application is rejected?",
      answer: "In case of a rejection, our team will analyze the reasons provided, address any issues with your application, and assist with reapplication or appeals as appropriate. Our experience with handling complex cases allows us to effectively navigate rejections and improve outcomes."
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("faq.title", "Frequently Asked Questions")}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("faq.subtitle", "Find answers to common questions about our services and processes.")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            {t("faq.moreQuestions", "Still have questions? ")}
            <Link to="/contact" className="text-primary hover:underline">
              {t("faq.contactUs", "Contact our support team")}
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
