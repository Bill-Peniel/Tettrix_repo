import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Handlebars
app.engine('hbs', engine({ 
  extname: '.hbs',
  defaultLayout: false,
  partialsDir: path.join(__dirname, '../client/src/components')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../client/src'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client')));

// In-memory storage for contacts (as requested, no database)
const contacts = [];

// Website data for Handlebars templates
const siteData = {
  companyName: 'Tettrix',
  navItems: [
    { id: 'home', title: 'Home', href: '#home' },
    { id: 'about', title: 'About', href: '#about' },
    { id: 'services', title: 'Services', href: '#services' },
    { id: 'pricing', title: 'Pricing', href: '#pricing' },
    { id: 'team', title: 'Team', href: '#team' },
    { id: 'contact', title: 'Contact', href: '#contact', isPrimary: true }
  ],
  hero: {
    title: 'Professional IT Services for Modern Business',
    description: 'Tettrix delivers cutting-edge website design, robust system administration, and comprehensive IT security solutions to elevate your business.',
    buttons: [
      {
        id: 'explore-services',
        text: 'Explore Services',
        href: '#services',
        icon: 'fas fa-rocket',
        classes: 'bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200'
      },
      {
        id: 'get-started',
        text: 'Get Started',
        href: '#contact',
        icon: 'fas fa-phone',
        classes: 'bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-200'
      }
    ],
    features: [
      {
        title: 'Web Development',
        subtitle: 'Custom Solutions',
        icon: 'fas fa-laptop-code'
      },
      {
        title: 'System Administration',
        subtitle: '24/7 Support',
        icon: 'fas fa-server'
      },
      {
        title: 'IT Security',
        subtitle: 'Advanced Protection',
        icon: 'fas fa-shield-alt'
      }
    ]
  },
  about: {
    title: 'About Tettrix',
    subtitle: 'Transforming businesses through innovative technology solutions and unparalleled expertise.',
    image: {
      src: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600',
      alt: 'Modern office workspace with computers and technology'
    },
    heading: 'Pioneering IT Excellence Since 2015',
    paragraphs: [
      'Founded with a vision to bridge the gap between complex technology and business success, Tettrix has grown into a trusted partner for organizations seeking reliable IT solutions.',
      'Our team of certified professionals combines deep technical expertise with a customer-first approach, ensuring every project delivers measurable value and exceeds expectations.'
    ],
    stats: [
      { id: 'clients', value: '500+', label: 'Clients Served' },
      { id: 'projects', value: '1200+', label: 'Projects Completed' },
      { id: 'experience', value: '8+', label: 'Years Experience' }
    ]
  },
  services: {
    title: 'Our Services',
    subtitle: 'Comprehensive IT solutions tailored to drive your business forward.',
    items: [
      {
        id: 'website-design',
        title: 'Website Design',
        description: 'Create stunning, responsive websites that capture your brand essence and drive conversions. Our designs are optimized for all devices and search engines.',
        icon: 'fas fa-paint-brush',
        features: ['Responsive Design', 'SEO Optimization', 'E-commerce Integration', 'Content Management']
      },
      {
        id: 'system-admin',
        title: 'System & Network Administration',
        description: 'Maintain optimal performance with our comprehensive system and network management services. We ensure your infrastructure runs smoothly 24/7.',
        icon: 'fas fa-cogs',
        features: ['Server Management', 'Network Monitoring', 'Cloud Migration', 'Backup Solutions']
      },
      {
        id: 'security',
        title: 'IT Security',
        description: 'Protect your digital assets with enterprise-grade security solutions. Our comprehensive approach safeguards against evolving cyber threats.',
        icon: 'fas fa-shield-alt',
        features: ['Threat Assessment', 'Security Auditing', 'Firewall Configuration', 'Employee Training']
      }
    ]
  },
  pricing: {
    title: 'Transparent Pricing',
    subtitle: 'Choose the perfect package for your business needs. All plans include ongoing support and maintenance.',
    plans: [
      {
        id: 'website',
        title: 'Website Design',
        price: '$2,500',
        period: 'Starting Price',
        features: [
          'Responsive Design (5-10 pages)',
          'SEO Optimization',
          'CMS Integration',
          'Mobile Optimization',
          '3 Months Free Support'
        ],
        buttonText: 'Get Quote',
        buttonClass: 'bg-blue-600 text-white hover:bg-blue-700'
      },
      {
        id: 'admin',
        title: 'System Administration',
        price: '$150',
        period: 'Per Month',
        isPopular: true,
        popularLabel: 'Most Popular',
        features: [
          '24/7 Server Monitoring',
          'Regular Backups',
          'Security Updates',
          'Performance Optimization',
          'Emergency Response'
        ],
        buttonText: 'Start Now',
        buttonClass: 'bg-green-500 text-white hover:bg-green-600'
      },
      {
        id: 'security',
        title: 'IT Security',
        price: '$200',
        period: 'Per Month',
        features: [
          'Security Assessment',
          'Firewall Management',
          'Threat Monitoring',
          'Vulnerability Scans',
          'Staff Training'
        ],
        buttonText: 'Secure Now',
        buttonClass: 'bg-blue-600 text-white hover:bg-blue-700'
      }
    ],
    customSolution: {
      text: 'Need a custom solution? We\'d love to hear about your specific requirements.',
      buttonText: 'Contact Us',
      buttonClass: 'text-blue-600 hover:text-blue-700 border border-blue-600 hover:bg-blue-50',
      icon: 'fas fa-comments'
    }
  },
  team: {
    title: 'Our Expert Team',
    subtitle: 'Meet the professionals who make your success possible.',
    members: [
      {
        id: 'john',
        name: 'John Smith',
        role: 'Lead Developer',
        bio: 'Full-stack developer with 10+ years of experience in web technologies and system architecture.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face',
        imageAlt: 'John Smith - Lead Developer',
        socialLinks: [
          { platform: 'linkedin', url: '#', icon: 'fab fa-linkedin' },
          { platform: 'github', url: '#', icon: 'fab fa-github' }
        ]
      },
      {
        id: 'sarah',
        name: 'Sarah Johnson',
        role: 'System Administrator',
        bio: 'Infrastructure specialist focused on cloud solutions and network security with enterprise experience.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b601?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face',
        imageAlt: 'Sarah Johnson - System Administrator',
        socialLinks: [
          { platform: 'linkedin', url: '#', icon: 'fab fa-linkedin' },
          { platform: 'twitter', url: '#', icon: 'fab fa-twitter' }
        ]
      },
      {
        id: 'mike',
        name: 'Mike Chen',
        role: 'Security Specialist',
        bio: 'Cybersecurity expert specializing in threat assessment and penetration testing for businesses.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face',
        imageAlt: 'Mike Chen - Security Specialist',
        socialLinks: [
          { platform: 'linkedin', url: '#', icon: 'fab fa-linkedin' },
          { platform: 'github', url: '#', icon: 'fab fa-github' }
        ]
      },
      {
        id: 'emily',
        name: 'Emily Davis',
        role: 'UI/UX Designer',
        bio: 'Creative designer focused on user experience and modern interface design for web and mobile.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=300&h=300&fit=crop&crop=face',
        imageAlt: 'Emily Davis - UI/UX Designer',
        socialLinks: [
          { platform: 'linkedin', url: '#', icon: 'fab fa-linkedin' },
          { platform: 'dribbble', url: '#', icon: 'fab fa-dribbble' }
        ]
      }
    ]
  },
  contact: {
    title: 'Get In Touch',
    subtitle: 'Ready to transform your business with professional IT services? We\'re here to help.',
    info: {
      title: 'Contact Information',
      items: [
        {
          id: 'phone',
          title: 'Phone',
          content: '+1 (555) 123-4567',
          icon: 'fas fa-phone'
        },
        {
          id: 'email',
          title: 'Email',
          content: 'info@tettrix.com',
          icon: 'fas fa-envelope'
        },
        {
          id: 'address',
          title: 'Address',
          content: '123 Tech Street<br>San Francisco, CA 94105',
          icon: 'fas fa-map-marker-alt'
        },
        {
          id: 'hours',
          title: 'Business Hours',
          content: 'Mon - Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM<br>Sun: Closed',
          icon: 'fas fa-clock'
        }
      ]
    },
    form: {
      title: 'Send us a message',
      submitText: 'Send Message',
      fields: [
        {
          id: 'firstName',
          label: 'First Name',
          type: 'text',
          placeholder: 'Your first name',
          required: true,
          isHalf: true
        },
        {
          id: 'lastName',
          label: 'Last Name',
          type: 'text',
          placeholder: 'Your last name',
          required: true,
          isHalf: true
        },
        {
          id: 'email',
          label: 'Email',
          type: 'email',
          placeholder: 'your@email.com',
          required: true
        },
        {
          id: 'company',
          label: 'Company',
          type: 'text',
          placeholder: 'Your company name'
        },
        {
          id: 'service',
          label: 'Service Interest',
          isSelect: true,
          placeholder: 'Select a service',
          options: [
            { value: 'website-design', text: 'Website Design' },
            { value: 'system-admin', text: 'System Administration' },
            { value: 'it-security', text: 'IT Security' },
            { value: 'consultation', text: 'Consultation' },
            { value: 'other', text: 'Other' }
          ]
        },
        {
          id: 'message',
          label: 'Message',
          isTextarea: true,
          rows: 4,
          placeholder: 'Tell us about your project or questions...',
          required: true
        }
      ]
    }
  },
  footer: {
    company: {
      name: 'Tettrix',
      description: 'Professional IT services for modern businesses. We deliver innovative solutions that drive growth and success.',
      socialLinks: [
        { platform: 'facebook', url: '#', icon: 'fab fa-facebook' },
        { platform: 'twitter', url: '#', icon: 'fab fa-twitter' },
        { platform: 'linkedin', url: '#', icon: 'fab fa-linkedin' },
        { platform: 'github', url: '#', icon: 'fab fa-github' }
      ]
    },
    sections: [
      {
        title: 'Services',
        links: [
          { text: 'Website Design', href: '#services' },
          { text: 'System Administration', href: '#services' },
          { text: 'IT Security', href: '#services' },
          { text: 'Consultation', href: '#contact' }
        ]
      },
      {
        title: 'Company',
        links: [
          { text: 'About Us', href: '#about' },
          { text: 'Our Team', href: '#team' },
          { text: 'Careers', href: '#contact' },
          { text: 'Blog', href: '#contact' }
        ]
      }
    ],
    contactInfo: {
      title: 'Get in Touch',
      items: [
        { icon: 'fas fa-phone', content: '+1 (555) 123-4567' },
        { icon: 'fas fa-envelope', content: 'info@tettrix.com' },
        { icon: 'fas fa-map-marker-alt', content: '123 Tech Street<br>San Francisco, CA', multiline: true }
      ]
    },
    copyright: '© 2024 Tettrix. All rights reserved.',
    legalLinks: [
      { text: 'Privacy Policy', href: '#' },
      { text: 'Terms of Service', href: '#' }
    ]
  }
};

// API Routes
app.post('/api/contact', (req, res) => {
  try {
    const { firstName, lastName, email, company, service, message } = req.body;
    
    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.'
      });
    }
    
    // Store contact (in memory for demo)
    const contact = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      company: company || '',
      service: service || '',
      message,
      createdAt: new Date()
    };
    
    contacts.push(contact);
    
    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      id: contact.id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// Get all contacts (for admin)
app.get('/api/contacts', (req, res) => {
  res.json(contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Main route - render the complete page
app.get('/', (req, res) => {
  res.render('index', siteData);
});

// Serve static files
app.use('/src', express.static(path.join(__dirname, '../client/src')));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});