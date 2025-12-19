import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Abdelhamid",
  lastName: "MAAIDNI",
  name: `ABDELHAMID MAAIDNI`,
  role: "Web Developer",
  avatar: "/images/avatar.jpg",
  email: "geek.Abdel@gmail.com",
  location: "Africa/Casablanca", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Arabic", "French"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: true,
  title: <>Contact Us</>,
  description: <>Get in touch with us for any inquiries or questions</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/geekabdel",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/abdelhamidmaaidni/",
  },
  {
    name: "Instagram",
    icon: "instagram",
    link: "https://www.instagram.com/senior.abdel/",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: "/",
  image: "/images/og/home.jpg",
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building modern web and mobile experiences that bring ideas to life.</>,
  featured: {
    display: false,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Once UI</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/building-once-ui-a-customizable-design-system",
  },
  subline: (
    <>
      Hi, I'm Abdelhamid Maaidni, a Web & Mobile Developer dedicated to crafting smooth, engaging digital experiences.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from Morocco, Casablanca`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com/abdel-maa-j3hsxy/30min?overlayCalendar=true",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
       I am a Web & Mobile Developer, passionate and dedicated to my work. With 7
      years of experience as a professional Web & Mobile Developer, I have
      acquired the skills and knowledge necessary to make your project a success. I
      enjoy every step of the design process, from discussion to collaboration.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Acwady",
        timeframe: "2023 - Present",
        role: "IT Project Manager",
        achievements: [
          <>
            IT Manager at Acwady, leading a team of 5 developers and overseeing the entire project lifecycle, including planning, development, testing, and deployment.
          </>,
          <>
            Developed a fully customized Flutter application for digital products.
          </>,
          <>
            Worked on Magento 2, including migration, module integration, template integration, and template edits.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "Once UI Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Ibtikarsoft SA",
        timeframe: "2020 - 2022",
        role: "Web Developer",
        achievements: [
          <>
            Developed and customized templates for various CMS and eCommerce platforms, including WordPress, OpenCart, PrestaShop, and Magento, to meet client needs and business goals.
          </>,
        ],
        images: [],
      },
      {
        company: "HOST5G",
        timeframe: "2020",
        role: "Personal Project",
        achievements: [
          <>
            Developed a personal project called HOST5G, a web hosting and domain management platform offering solutions for server deployment and management.
          </>,
        ],
        images: [],
      },
      {
        company: "TechTrend",
        timeframe: "2018 - 2019",
        role: "Web Developer",
        achievements: [
          <>
            Developed and maintained web applications using modern technologies such as HTML, CSS, JavaScript, Bootstrap, and jQuery.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Bachelor's Degree - Software engineer",
        description: <>National School of Applied Sciences<br />2020 - 2021 Khouribga, Morocco</>,
      },
      {
        name: "Diploma In Computer Network Techniques - OFPPT",
        description: <>2013 - 2015 Oued Zem, Morocco</>,
      },
      {
        name: "Baccalaureate in Physics",
        description: <>Ibn tofail Highschool<br />2012 - 2013 Oued Zem, Morocco</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Frontend Development",
        description: <></>,
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "Next.js",
            icon: "nextjs",
          },
          {
            name: "React",
          },
          {
            name: "TypeScript",
          },
          {
            name: "Tailwind",
          },
          {
            name: "Flutter",
          },
          {
            name: "Dart",
          },
        ],
        images: [],
      },
      {
        title: "Backend Development",
        description: <></>,
        tags: [
          {
            name: "PHP",
          },
          {
            name: "Laravel",
          },
          {
            name: "MySQL",
          },
          {
            name: "PostgreSQL",
          },
          {
            name: "Supabase",
            icon: "supabase",
          },
          {
            name: "REST API",
          },
        ],
        images: [],
      },
      {
        title: "DevOps and Deployment",
        description: <></>,
        tags: [
          {
            name: "Docker",
          },
          {
            name: "CI/CD",
          },
          {
            name: "Web Panel",
          },
          {
            name: "Vercel",
          },
        ],
        images: [],
      },
      {
        title: "Other Technologies",
        description: <></>,
        tags: [
          {
            name: "Magento",
          },
          {
            name: "Prestashop",
          },
          {
            name: "OpenCart",
          },
          {
            name: "WordPress",
          },
          {
            name: "WooCommerce",
          },
          {
            name: "Postman",
          },
          {
            name: "Scribe Doc",
          },
          {
            name: "Jira",
          },
          {
            name: "Git",
          },
          {
            name: "GitHub",
          },
          {
            name: "Figma",
            icon: "figma",
          },
          {
            name: "Photoshop",
          },
        ],
        images: [],
      },
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
