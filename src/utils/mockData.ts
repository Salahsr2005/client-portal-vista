
// Mock Data for Programs

export interface Program {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  duration: string;
  fees: number;
  startDate: string;
  endDate: string;
  eligibility: string;
  requirements: string[];
  language: string;
  seats: number;
  applicationDeadline: string;
  status: 'Open' | 'Closed' | 'Coming Soon';
  featured: boolean;
  rating: number;
  imageUrl: string;
  wilaya: string;
  university: string;
}

export const programTypes = [
  "Study Abroad",
  "University Exchange",
  "Language Course",
  "Summer School",
  "Internship",
  "Scholarship",
  "Research Program"
];

export const algerianWilayas = [
  "Algiers",
  "Oran",
  "Constantine",
  "Annaba",
  "Blida",
  "Batna",
  "Sétif",
  "Sidi Bel Abbès",
  "Biskra",
  "Tizi Ouzou",
  "Béjaïa",
  "Tlemcen",
  "Tiaret",
  "Djelfa",
  "Skikda"
];

export const algerianUniversities = [
  "University of Algiers",
  "University of Oran",
  "University of Constantine",
  "University of Annaba",
  "University of Blida",
  "University of Batna",
  "University of Sétif",
  "University of Sidi Bel Abbès",
  "University of Biskra",
  "University of Tizi Ouzou",
  "University of Béjaïa",
  "University of Tlemcen",
  "University of Tiaret",
  "University of Djelfa",
  "University of Skikda"
];

export const languages = ["Arabic", "French", "English", "Spanish", "German"];

export const mockPrograms: Program[] = [
  {
    id: "1",
    title: "Algerian-French Exchange Program",
    description: "An opportunity for Algerian students to study in top French universities for a semester.",
    type: "University Exchange",
    location: "Paris, France",
    duration: "6 months",
    fees: 2500,
    startDate: "2023-09-15",
    endDate: "2024-03-15",
    eligibility: "Undergraduate students in their 3rd year or above",
    requirements: ["Valid passport", "Academic transcript", "French language proficiency (B2)", "Recommendation letter"],
    language: "French",
    seats: 50,
    applicationDeadline: "2023-07-30",
    status: "Open",
    featured: true,
    rating: 4.8,
    imageUrl: "/placeholder.svg",
    wilaya: "Algiers",
    university: "University of Algiers"
  },
  {
    id: "2",
    title: "Summer Research in Renewable Energy",
    description: "A research program focusing on solar energy implementation in Saharan regions.",
    type: "Research Program",
    location: "Oran, Algeria",
    duration: "2 months",
    fees: 800,
    startDate: "2023-07-01",
    endDate: "2023-08-31",
    eligibility: "Engineering and Physics students",
    requirements: ["Academic transcript", "Research proposal", "Recommendation letter"],
    language: "Arabic",
    seats: 25,
    applicationDeadline: "2023-05-15",
    status: "Closed",
    featured: false,
    rating: 4.5,
    imageUrl: "/placeholder.svg",
    wilaya: "Oran",
    university: "University of Oran"
  },
  {
    id: "3",
    title: "English Language Immersion",
    description: "Intensive English language program with native speakers from the UK and USA.",
    type: "Language Course",
    location: "Constantine, Algeria",
    duration: "3 months",
    fees: 1200,
    startDate: "2023-10-01",
    endDate: "2023-12-31",
    eligibility: "Anyone aged 18-35 with basic English knowledge",
    requirements: ["Language assessment test", "Valid ID"],
    language: "English",
    seats: 100,
    applicationDeadline: "2023-09-15",
    status: "Open",
    featured: true,
    rating: 4.3,
    imageUrl: "/placeholder.svg",
    wilaya: "Constantine",
    university: "University of Constantine"
  },
  {
    id: "4",
    title: "Technology Entrepreneurship Workshop",
    description: "Learn to build and launch technology startups with mentorship from successful entrepreneurs.",
    type: "Summer School",
    location: "Algiers, Algeria",
    duration: "3 weeks",
    fees: 500,
    startDate: "2023-08-01",
    endDate: "2023-08-21",
    eligibility: "University students and recent graduates",
    requirements: ["Business idea pitch", "CV", "Motivation letter"],
    language: "Arabic",
    seats: 40,
    applicationDeadline: "2023-07-15",
    status: "Closed",
    featured: false,
    rating: 4.6,
    imageUrl: "/placeholder.svg",
    wilaya: "Algiers",
    university: "University of Algiers"
  },
  {
    id: "5",
    title: "Mediterranean Cultural Exchange",
    description: "Cultural exchange program with students from Mediterranean countries focusing on shared heritage.",
    type: "Study Abroad",
    location: "Multiple locations",
    duration: "1 month",
    fees: 1500,
    startDate: "2023-11-01",
    endDate: "2023-11-30",
    eligibility: "University students studying humanities or social sciences",
    requirements: ["Valid passport", "Academic transcript", "Motivation letter"],
    language: "French",
    seats: 30,
    applicationDeadline: "2023-09-30",
    status: "Open",
    featured: true,
    rating: 4.7,
    imageUrl: "/placeholder.svg",
    wilaya: "Béjaïa",
    university: "University of Béjaïa"
  },
  {
    id: "6",
    title: "Engineering Internship at Sonatrach",
    description: "Hands-on experience in Algeria's largest oil and gas company.",
    type: "Internship",
    location: "Hassi Messaoud, Algeria",
    duration: "3 months",
    fees: 0,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    eligibility: "Final year engineering students",
    requirements: ["Academic transcript", "CV", "Technical skills assessment"],
    language: "Arabic",
    seats: 15,
    applicationDeadline: "2023-11-30",
    status: "Coming Soon",
    featured: false,
    rating: 4.9,
    imageUrl: "/placeholder.svg",
    wilaya: "Ouargla",
    university: "University of Ouargla"
  },
  {
    id: "7",
    title: "Algerian History and Archaeology",
    description: "Field study of archaeological sites across Algeria with expert historians.",
    type: "Summer School",
    location: "Multiple locations",
    duration: "6 weeks",
    fees: 1000,
    startDate: "2023-07-15",
    endDate: "2023-08-30",
    eligibility: "History and archaeology students",
    requirements: ["Academic transcript", "Health certificate", "Recommendation letter"],
    language: "Arabic",
    seats: 20,
    applicationDeadline: "2023-06-15",
    status: "Closed",
    featured: true,
    rating: 4.4,
    imageUrl: "/placeholder.svg",
    wilaya: "Tlemcen",
    university: "University of Tlemcen"
  },
  {
    id: "8",
    title: "Environmental Conservation Project",
    description: "Participate in environmental conservation efforts in the Atlas Mountains.",
    type: "Research Program",
    location: "Atlas Mountains, Algeria",
    duration: "2 months",
    fees: 600,
    startDate: "2024-05-01",
    endDate: "2024-06-30",
    eligibility: "Environmental science and biology students",
    requirements: ["Academic transcript", "Physical fitness certificate", "Motivation letter"],
    language: "French",
    seats: 25,
    applicationDeadline: "2024-03-15",
    status: "Coming Soon",
    featured: false,
    rating: 4.2,
    imageUrl: "/placeholder.svg",
    wilaya: "Batna",
    university: "University of Batna"
  },
  {
    id: "9",
    title: "Full Scholarship for Computer Science",
    description: "Full academic scholarship for master's degree in computer science at USTHB.",
    type: "Scholarship",
    location: "Algiers, Algeria",
    duration: "2 years",
    fees: 0,
    startDate: "2023-09-15",
    endDate: "2025-06-30",
    eligibility: "Bachelor's degree holders with distinction in computer science",
    requirements: ["Academic transcript", "Research proposal", "Recommendation letters", "Interview"],
    language: "French",
    seats: 5,
    applicationDeadline: "2023-07-31",
    status: "Open",
    featured: true,
    rating: 4.9,
    imageUrl: "/placeholder.svg",
    wilaya: "Algiers",
    university: "University of Science and Technology Houari Boumediene"
  },
  {
    id: "10",
    title: "Algerian-German Technical Training",
    description: "Technical training program in mechanical engineering with German industrial partners.",
    type: "Internship",
    location: "Algiers and Berlin",
    duration: "4 months",
    fees: 1800,
    startDate: "2024-02-01",
    endDate: "2024-05-31",
    eligibility: "Engineering students with good academic standing",
    requirements: ["Academic transcript", "German language basics (A2)", "CV", "Technical assessment"],
    language: "German",
    seats: 15,
    applicationDeadline: "2023-12-15",
    status: "Coming Soon",
    featured: false,
    rating: 4.7,
    imageUrl: "/placeholder.svg",
    wilaya: "Algiers",
    university: "University of Algiers"
  }
];
