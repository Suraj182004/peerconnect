'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Shield, Sparkles, ArrowRight, Search, Users2, Code2, Lightbulb, Rocket, UserPlus, Handshake, Quote } from 'lucide-react';
import { getUserProfile, getOnboardingStatus } from '@/lib/localStorage';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HomePage() {
  const router = useRouter();

  // Ref for the "How it Works" section
  const howItWorksRef = useRef(null);
  const { scrollYProgress: howItWorksScrollYProgress } = useScroll({
    target: howItWorksRef,
    offset: ["start end", "center center"] // Start when section top hits viewport bottom, end when section center hits viewport center
  });
  // Transform scroll progress (0 to 1) to pathLength (0 to 1)
  const pathLength = useTransform(howItWorksScrollYProgress, [0, 0.7], [0, 1]); // Draw line as section scrolls halfway

  useEffect(() => {
    // Add class to body for landing page specific cursor styles
    document.body.classList.add('landing-cursor-active');

    // Check if user exists and has completed onboarding
    const user = getUserProfile();
    const hasCompletedOnboarding = getOnboardingStatus();

    if (user && hasCompletedOnboarding) {
      router.replace('/dashboard');
    }

    // Custom cursor logic
    const cursorElement = document.createElement('div');
    cursorElement.classList.add('custom-cursor');
    const cursorDot = document.createElement('div');
    cursorDot.classList.add('cursor-dot');
    cursorElement.appendChild(cursorDot);
    document.body.appendChild(cursorElement);

    const onMouseMove = (e: MouseEvent) => {
      cursorElement.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    // Parallax elements for CTA
    const parallaxBg1 = document.querySelector('.animate-pulse-bg-1') as HTMLElement;
    const parallaxBg2 = document.querySelector('.animate-pulse-bg-2') as HTMLElement;

    const onScroll = () => {
      const scrollY = window.scrollY;
      if (parallaxBg1) {
        // Slower movement for bg1 (appears further away)
        parallaxBg1.style.transform = `translateY(${scrollY * 0.1}px) translate(-10%, -10%) scale(1)`; 
      }
      if (parallaxBg2) {
        // Slightly faster movement for bg2 (appears closer)
        parallaxBg2.style.transform = `translateY(${scrollY * 0.2}px) translate(10%, 10%) scale(1)`; 
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial call to set position if already scrolled
    onScroll();

    // Cursor interaction enhancements
    const interactiveElements = document.querySelectorAll('a, button');
    const addInteractiveHover = () => cursorElement.classList.add('interactive-hover');
    const removeInteractiveHover = () => cursorElement.classList.remove('interactive-hover');
    const addActiveState = () => cursorElement.classList.add('active-state');
    const removeActiveState = () => cursorElement.classList.remove('active-state');

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', addInteractiveHover);
      el.addEventListener('mouseleave', removeInteractiveHover);
      el.addEventListener('mousedown', addActiveState);
      el.addEventListener('mouseup', removeActiveState);
    });

    // Cleanup function
    return () => {
      // Remove class from body when component unmounts
      document.body.classList.remove('landing-cursor-active');

      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      if (document.body.contains(cursorElement)) {
        document.body.removeChild(cursorElement);
      }
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', addInteractiveHover);
        el.removeEventListener('mouseleave', removeInteractiveHover);
        el.removeEventListener('mousedown', addActiveState);
        el.removeEventListener('mouseup', removeActiveState);
      });
    };
  }, [router]);

  const defaultVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.7,
        ease: "easeInOut"
      }
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.25 },
    },
  };

  // const features = [ // Commented out unused variable
  //   {
  //     icon: <Users className="w-8 h-8" />,
  //     title: 'Connect with Peers',
  //     description: 'Discover and connect with students who share your interests and academic focus.',
  //   },
  //   {
  //     icon: <Zap className="w-8 h-8" />,
  //     title: 'Collaborate on Projects',
  //     description: 'Find project partners and collaborate on exciting academic and personal ventures.',
  //   },
  //   {
  //     icon: <Shield className="w-8 h-8" />,
  //     title: 'Student-Only Platform',
  //     description: 'A safe, verified community exclusively for students to network and learn.',
  //   },
  //   {
  //     icon: <Globe className="w-8 h-8" />,
  //     title: 'Global Network',
  //     description: 'Connect with students from universities around the world and expand your horizons.',
  //   },
  // ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
      {/* Animated Gradient Background - applied to a pseudo-element or a fixed div */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-gradient-xy"></div>
      </div>

      {/* Header */}
      <motion.header 
        variants={defaultVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 sticky top-0 z-50 bg-background/80 backdrop-blur-md print:hidden"
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="text-2xl font-bold text-foreground">PeerConnect</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => router.push('/onboarding')} 
              className="shadow-sm hover:shadow-primary/50 transition-all duration-300 group bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Get Started Free 
              <motion.div 
                className="ml-2 inline-block"
                whileHover={{ x: 3, transition: { type: 'spring', stiffness: 400, damping: 10 } }} // Arrow moves right on hover
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative isolate pt-14 pb-20 md:pt-20 md:pb-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={defaultVariants}>
              <Badge variant="outline" className="mb-6 py-1.5 px-4 border-primary/50 text-primary font-medium text-sm">
                <Sparkles className="w-4 h-4 mr-2 text-primary/80" /> Connect. Innovate. Succeed.
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={defaultVariants}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
            >
              Unlock Your Potential.<br /> 
              <span className="relative">
                <span className="animated-gradient-text bg-clip-text text-transparent">
                  Connect with Brilliance.
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              variants={defaultVariants}
              className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
            >
              PeerConnect is your exclusive gateway to a vibrant student community. Find collaborators, share knowledge, and build your future, one connection at a time.
            </motion.p>
            
            <motion.div 
              variants={defaultVariants}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button 
                size="lg" 
                className="text-base px-8 py-6 shadow-lg hover:shadow-primary/60 transition-all duration-300 transform hover:scale-105"
                onClick={() => router.push('/onboarding')}
              >
                Join the Network
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base px-8 py-6 hidden sm:flex group items-center"
                onClick={() => {
                  const featuresSection = document.getElementById('features-section');
                  if (featuresSection) {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Explore Features <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16 md:mb-20"
          >
            <motion.h2 
              variants={defaultVariants}
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Everything You Need to <span className="text-primary">Thrive</span>
            </motion.h2>
            <motion.p 
              variants={defaultVariants}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              PeerConnect provides a comprehensive suite of tools designed for student success, collaboration, and growth in a supportive community.
            </motion.p>
          </motion.div>

          {[{
            icon: <Users2 className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />,
            title: 'Vibrant Student Network',
            description: 'Connect with peers across departments and years. Expand your academic and social circle effortlessly.',
          }, {
            icon: <Code2 className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />,
            title: 'Discover & Join Projects',
            description: 'Find exciting student-led projects or recruit talent for your own. Innovation starts here.',
          }, {
            icon: <Lightbulb className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />,
            title: 'Showcase Your Skills',
            description: 'Build a rich profile that highlights your unique skills, experiences, and project contributions.',
          },{
            icon: <Rocket className="w-12 h-12 text-primary group-hover:scale-110 transition-transform duration-300" />,
            title: 'Academic & Career Growth',
            description: 'Share resources, gain insights, and explore opportunities that align with your career aspirations.'
          }].map((feature, index) => (
            <motion.div 
              key={index} 
              variants={defaultVariants} 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className={`flex flex-col md:flex-row items-center gap-8 lg:gap-12 py-10 md:py-12 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <motion.div 
                className="w-full md:w-1/2 flex justify-center items-center p-6 group"
                initial={{ opacity:0, scale: 0.8}}
                whileInView={{ opacity:1, scale: 1}}
                transition={{ duration: 0.7, delay: 0.2, ease: "circOut"}}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 rounded-2xl shadow-xl w-52 h-52 flex items-center justify-center transition-all duration-300 group-hover:shadow-primary/30 group-hover:from-primary/15 group-hover:to-accent/15">
                    {feature.icon} 
                </div>
              </motion.div>
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why PeerConnect? Section - NEW */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16 md:mb-20"
          >
            <motion.h2 
              variants={defaultVariants}
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Why <span className="animated-gradient-text bg-clip-text text-transparent">PeerConnect</span>?
            </motion.h2>
            <motion.p 
              variants={defaultVariants}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Unlock a focused, collaborative, and growth-oriented networking experience tailored for students.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10"
          >
            {[{
              icon: <Shield className="w-10 h-10 text-primary" />,
              title: 'Exclusively Students',
              description: 'Connect in a verified, safe space designed for academic and peer collaboration, free from external noise.',
            }, {
              icon: <Zap className="w-10 h-10 text-primary" />,
              title: 'Laser-Focused Networking',
              description: 'Find peers by specific skills, project interests, or academic departments. Make relevant connections, fast.',
            }, {
              icon: <Rocket className="w-10 h-10 text-primary" />,
              title: 'Accelerate Your Growth',
              description: 'From finding project partners to sharing niche knowledge, PeerConnect is your launchpad for success.',
            }].map((item, index) => (
              <motion.div 
                key={index} 
                variants={defaultVariants} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: index * 0.2 + 0.3 }}
                className="bg-card p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 border border-border/60 hover:border-primary/50 transform hover:-translate-y-1.5 group"
              >
                <div className="flex items-center justify-center mb-5 w-16 h-16 bg-gradient-to-br from-primary/15 to-accent/15 text-primary rounded-full mx-auto shadow-inner ring-2 ring-primary/20 transition-all duration-300 group-hover:from-primary/20 group-hover:to-accent/20 group-hover:ring-primary/30">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 text-center">{item.title}</h3>
                <p className="text-muted-foreground text-sm text-center leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 md:py-28 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16 md:mb-20"
          >
            <motion.h2 
              variants={defaultVariants}
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Get Started in <span className="text-primary">Minutes</span>
            </motion.h2>
            <motion.p 
              variants={defaultVariants}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Joining PeerConnect is simple. Follow these easy steps to start connecting with a vibrant student community today.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            {/* Connecting line - updated */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 h-full z-0">
              <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="fill-none stroke-primary/40">
                <motion.path 
                  d="M50 50 Q 250 20 500 50 T 950 50"
                  strokeWidth="3"
                  strokeDasharray="10 10"
                  style={{ pathLength }}
                />
              </svg>
            </div>

            {[{
              icon: <UserPlus className="w-10 h-10 text-primary" />,
              title: 'Create Your Profile',
              description: 'Sign up in minutes and build a comprehensive profile to showcase your skills and interests.',
            }, {
              icon: <Search className="w-10 h-10 text-primary" />,
              title: 'Discover & Connect',
              description: 'Browse student profiles, filter by interests or skills, and send connection requests.',
            }, {
              icon: <Handshake className="w-10 h-10 text-primary" />,
              title: 'Collaborate & Grow',
              description: 'Join projects, share knowledge, and expand your network for academic and career success.',
            }].map((step, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 60, scale: 0.85 }}
                whileInView={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1, 
                    transition: { 
                        duration: 0.7,
                        delay: index * 0.25 + 0.3,
                        ease: "circOut"
                    }
                }}
                viewport={{ once: true, amount: 0.4 }}
                className="bg-card p-6 rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 z-10 border border-border/70 transform hover:-translate-y-1.5 hover:border-primary/40"
              >
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5}}
                    whileInView={{ opacity: 1, scale: 1, transition: { duration:0.4, delay: index * 0.2 + 0.4 }}}
                    viewport={{ once: true, amount: 0.3 }}
                    className="flex items-center justify-center mb-5 w-16 h-16 bg-gradient-to-br from-primary/10 to-accent/10 text-primary rounded-full mx-auto shadow-md ring-2 ring-primary/15 group-hover:ring-primary/30 transition-all duration-300"
                >
                  {step.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-foreground mb-2 text-center">{step.title}</h3>
                <p className="text-muted-foreground text-sm text-center leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16 md:mb-20"
          >
            <motion.h2 
              variants={defaultVariants}
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl"
            >
              Loved by <span className="text-primary">Students Like You</span>
            </motion.h2>
            <motion.p 
              variants={defaultVariants}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Hear what fellow students are saying about their experiences on PeerConnect.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            {[{
              name: 'Priya Sharma',
              role: 'Computer Science, 3rd Year',
              testimonial: 'PeerConnect helped me find a fantastic group for my capstone project. The platform is intuitive and easy to use!',
              avatarUrl: 'https://i.pravatar.cc/150?img=1',
              fallback: 'PS'
            }, {
              name: 'Rahul Verma',
              role: 'Mechanical Engineering, 2nd Year',
              testimonial: "I was struggling to find people interested in robotics. PeerConnect made it super simple to connect with like-minded students.",
              avatarUrl: 'https://i.pravatar.cc/150?img=2',
              fallback: 'RV'
            }, {
              name: 'Aisha Khan',
              role: 'Business Administration, Final Year',
              testimonial: "A great way to network beyond my immediate classes. I've made some valuable connections for future collaborations.",
              avatarUrl: 'https://i.pravatar.cc/150?img=3',
              fallback: 'AK'
            }].map((testimonial, index) => (
              <motion.div 
                key={index} 
                variants={defaultVariants} 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: index * 0.2 + 0.3 }}
              >
                <Card className="h-full flex flex-col bg-card shadow-lg hover:shadow-2xl transition-all duration-300 border-border/60 rounded-xl overflow-hidden transform hover:-translate-y-1 group">
                  <CardContent className="p-6 md:p-8 flex-grow flex flex-col items-start text-left relative">
                    <Quote className="w-10 h-10 text-primary/30 absolute top-4 right-4 transform transition-transform duration-300 group-hover:scale-110 group-hover:text-primary/50" />
                    <Avatar className="w-16 h-16 mb-5 ring-4 ring-primary/20 shadow-md border-2 border-card">
                      <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                      <AvatarFallback className="text-xl bg-muted text-muted-foreground font-semibold">{testimonial.fallback}</AvatarFallback>
                    </Avatar>
                    <blockquote className="text-muted-foreground text-base leading-relaxed mb-5 flex-grow">
                      {testimonial.testimonial}
                    </blockquote>
                    <div className="mt-auto w-full pt-4 border-t border-border/50">
                        <p className="font-semibold text-foreground text-base">{testimonial.name}</p>
                        <p className="text-sm text-primary/90 font-medium">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden bg-background">
          {/* Background decorative elements - Updated with new animation class */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
            {/* Ensure these elements do not have their own translateY transform conflicting with JS */}
            <div className="absolute -left-40 -top-40 w-[50rem] h-[50rem] bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl opacity-50 animate-pulse-bg-1" 
                 style={{ transform: 'translate(-10%, -10%) scale(1)' }}></div>
            <div className="absolute -right-60 -bottom-52 w-[60rem] h-[60rem] bg-gradient-to-tl from-accent/15 to-transparent rounded-full blur-3xl opacity-50 animate-pulse-bg-2" 
                 style={{ transform: 'translate(10%, 10%) scale(1)' }}></div>
          </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "circOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="relative z-10"
          >
            <Card className="bg-card shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12 lg:p-16">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                    Ready to Build Your <span className="text-primary">Future</span>?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-8">
                    Sign up today and unlock a world of opportunities. Connect with peers, collaborate on innovative projects, and accelerate your academic journey with PeerConnect.
                  </p>
                  <Button 
                    size="lg" 
                    className="text-base px-8 py-6 shadow-lg hover:shadow-primary/60 transition-all duration-300 transform hover:scale-105"
                    onClick={() => router.push('/onboarding')}
                  >
                    Create Your Free Profile <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                <div className="hidden md:block relative h-64 md:h-full">
                  {/* Placeholder for an engaging image or abstract graphic */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-accent/80 to-pink-500/80 opacity-70"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-24 h-24 text-white/50 animate-pulse" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-16 pb-12 bg-muted/40 relative">
        {/* Subtle gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold text-foreground">PeerConnect</span>
            </div>
            
            <nav className="flex justify-center gap-x-5 md:gap-x-7">
              {[
                { label: "About", href: "#features-section" }, 
                { label: "How it Works", href: "#how-it-works-section" }, // Example links
                { label: "Testimonials", href: "#testimonials-section" },
                // { label: "Contact", href: "#" }
              ].map(link => (
                <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 font-medium">
                  {link.label}
                </Link>
              ))}
            </nav>

            <p className="text-sm text-muted-foreground text-center md:text-right">
              &copy; {new Date().getFullYear()} PeerConnect. All rights reserved.
            </p>
          </div>
          <div className="mt-10 pt-8 border-t border-border/60 text-center text-xs text-muted-foreground/80">
            Built by students, for students, with <span className="text-primary/90 font-medium">passion</span>.
          </div>
        </div>
      </footer>
    </div>
  );
}
