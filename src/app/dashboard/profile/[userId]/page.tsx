'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserProfile } from '@/lib/types';
import { getUserProfile as getCurrentUserProfile } from '@/lib/localStorage'; // Renamed to avoid conflict
import { allMockProfiles } from '@/lib/mockData'; // To find any user
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3, Mail, MapPin, Briefcase, Linkedin, Github, Twitter, ExternalLink, ShieldAlert, UserPlus, UserCheck, Clock, Link as LinkIcon, Star, Users2, Lightbulb, Palette, Award, Building, Globe, School, Rocket, PlusCircle, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useConnections } from '@/hooks/useConnections';
import AiAnalysisDialog from '@/components/dialogs/AiAnalysisDialog';
import Image from 'next/image';

const socialIconMap: { [key: string]: React.ElementType } = {
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  portfolio: ExternalLink,
  default: LinkIcon, 
};

const DynamicUserProfilePage = () => {
  const params = useParams();
  const userId = params?.userId as string;
  
  const router = useRouter();
  const [profileToShow, setProfileToShow] = useState<UserProfile | null | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAiAnalysisDialogOpen, setIsAiAnalysisDialogOpen] = useState(false);

  const { 
    getConnectionStatus,
    sendConnectionRequest,
    isLoading: connectionsLoading 
  } = useConnections();

  useEffect(() => {
    const cUser = getCurrentUserProfile();
    setCurrentUser(cUser);

    if (userId) {
      let foundProfile = allMockProfiles.find(p => p.id === userId);
      if (!foundProfile && cUser && cUser.id === userId) {
        foundProfile = cUser;
      }
      setProfileToShow(foundProfile || null); 
    } else {
      setProfileToShow(null); // No userId, profile not found
    }
  }, [userId]);

  const isCurrentUserProfile = useMemo(() => currentUser?.id === profileToShow?.id, [currentUser, profileToShow]);
  const connectionStatus = useMemo(() => {
    if (!currentUser || !profileToShow || isCurrentUserProfile) return 'none';
    return getConnectionStatus(profileToShow.id, currentUser.id);
  }, [currentUser, profileToShow, isCurrentUserProfile, getConnectionStatus]);


  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.07, duration: 0.4, ease: 'circOut' },
    }),
  };

  if (profileToShow === undefined) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-lg font-semibold text-primary mb-1">Loading Profile</p>
            <p className="text-sm text-muted-foreground">Fetching student details, please wait...</p>
        </div>
    );
  }

  if (!profileToShow) {
    return (
      <motion.div 
        variants={defaultVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
      >
        <ShieldAlert className="mx-auto h-20 w-20 text-destructive/70 mb-5" />
        <h1 className="text-3xl font-bold text-foreground">Profile Not Found</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Sorry, we couldn&apos;t find the profile you were looking for. It might have been removed or the link is incorrect.
        </p>
        <Button onClick={() => router.push('/dashboard/browse')} className="mt-8 text-base px-6 py-3">
          Browse Students
        </Button>
      </motion.div>
    );
  }

  const user = profileToShow;

  const handleConnect = () => {
    if (currentUser && !isCurrentUserProfile) {
      sendConnectionRequest(user.id, currentUser.id);
    }
  };

  const getConnectButton = () => {
    if (isCurrentUserProfile || !currentUser) return null;

    let icon = <UserPlus className="w-4 h-4 mr-2" />;
    let text = `Connect with ${user.firstName}`;
    let variant: "default" | "outline" = "default";
    let disabled = connectionsLoading || !currentUser;

    if (connectionStatus === 'accepted') {
      icon = <UserCheck className="w-4 h-4 mr-2 text-green-500" />;
      text = 'Connected';
      variant = 'outline';
      disabled = true; // Or enable for messaging/removing
    }
    if (connectionStatus === 'pending') {
      icon = <Clock className="w-4 h-4 mr-2" />;
      text = 'Request Sent';
      variant = 'outline';
      disabled = true;
    }

    return (
      <Button 
        onClick={handleConnect} 
        disabled={disabled}
        variant={variant}
        size="sm"
        className="shadow-sm hover:shadow-md transition-shadow whitespace-nowrap"
      >
        {icon} {text}
      </Button>
    );
  };

  const SectionCard: React.FC<{title: string, icon?: React.ElementType, children: React.ReactNode, customDelay?: number, className?: string}> = 
    ({title, icon: Icon, children, customDelay = 0, className = ""}) => (
    <motion.div variants={defaultVariants} custom={customDelay}>
        <Card className={`shadow-lg border-border/70 h-full ${className}`}>
            <CardHeader className="pb-3 pt-4 px-5">
                <CardTitle className="text-base sm:text-lg font-semibold text-foreground flex items-center">
                    {Icon && <Icon className="w-5 h-5 mr-2.5 text-primary/80" />} 
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm">
                {children}
            </CardContent>
        </Card>
    </motion.div>
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-6 md:py-8 space-y-6 md:space-y-8"
    >
      {/* Profile Header - Updated to match image */}
      <motion.div variants={defaultVariants} custom={0}>
        <Card className="overflow-hidden shadow-2xl border-border/50 rounded-xl bg-card">
          {/* Gradient Banner */}
          <div className="h-48 md:h-60 bg-gradient-to-r from-primary/80 via-accent/80 to-pink-600/70 relative group cursor-pointer transition-all duration-300 hover:from-primary/90 hover:via-accent/90 hover:to-pink-600/80">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all duration-300"></div>
            {/* Optional: Subtle pattern or texture can be added here if desired */}
          </div>

          {/* Content below banner */}
          <div className="p-5 sm:p-6 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-x-5 gap-y-4 -mt-28 sm:-mt-32 relative z-10">
              {/* Avatar - Larger and overlapping */}
              <motion.div 
                initial={{scale:0.5, opacity:0}} 
                animate={{scale:1, opacity:1}} 
                transition={{delay:0.1, duration:0.4, type: "spring", stiffness:120}} 
                className="shrink-0 group/avatar"
              >
                <Avatar className="w-40 h-40 md:w-44 md:h-44 rounded-full border-[6px] border-card bg-muted shadow-2xl transition-all duration-300 group-hover/avatar:scale-105 group-hover/avatar:shadow-primary/30 cursor-pointer">
                  <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback className="text-6xl md:text-7xl font-semibold bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover/avatar:text-primary/90 transition-colors">
                    {user.firstName[0]}{user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              {/* Text info block */}
              <div className="flex-1 text-center sm:text-left mt-3 sm:mt-0 sm:pb-2 min-w-0 group">
                <h1 
                    className="text-3xl md:text-4xl font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors duration-300 cursor-default" 
                    title={`${user.firstName} ${user.lastName}`}
                >
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-base text-primary/90 font-medium mt-0.5 truncate group-hover:text-primary transition-colors duration-300 cursor-default">
                  {user.department} &bull; {user.year}
                </p>
                {user.university && (
                  <p className="text-sm text-muted-foreground/90 flex items-center justify-center sm:justify-start mt-1.5 truncate cursor-default">
                    <School className="w-4 h-4 mr-1.5 text-muted-foreground/70 shrink-0" /> {user.university}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/80 mt-1.5 cursor-default">
                    Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>

              {/* Action button block - Aligned to the right */}
              <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto sm:ml-auto sm:self-end sm:pb-2">
                {isCurrentUserProfile ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => router.push('/onboarding')} 
                            className="shadow-md hover:shadow-lg transition-all duration-300 border-border/80 hover:border-primary/60 bg-card/90 backdrop-blur-sm w-full sm:w-auto group/button hover:scale-105">
                      <Edit3 className="w-4 h-4 mr-2 text-primary/90 group-hover/button:text-primary transition-colors" /> Edit My Profile
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/profile/add-project')}
                            className="shadow-md hover:shadow-lg transition-all duration-300 border-border/80 hover:border-primary/60 bg-card/90 backdrop-blur-sm w-full sm:w-auto group/button hover:scale-105">
                        <PlusCircle className="w-4 h-4 mr-2 text-primary/90 group-hover/button:text-primary transition-colors"/> Add Project
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    {getConnectButton()} 
                    <Button variant="outline" size="sm" onClick={() => setIsAiAnalysisDialogOpen(true)} 
                            className="shadow-md hover:shadow-lg transition-all duration-300 border-purple-500/50 hover:border-purple-500/80 bg-card/90 backdrop-blur-sm w-full sm:w-auto group/button hover:scale-105 text-purple-600 hover:text-purple-700">
                        <Sparkles className="w-4 h-4 mr-2 text-purple-500/90 group-hover/button:text-purple-600 transition-colors"/> AI Match Analysis
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* AI Analysis Dialog */}
      <AiAnalysisDialog 
        isOpen={isAiAnalysisDialogOpen}
        onClose={() => setIsAiAnalysisDialogOpen(false)}
        currentUserProfile={currentUser}
        viewedUserProfile={profileToShow}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column / Main Column */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {user.bio && (
            <SectionCard title="About Me" icon={Users2} customDelay={1}>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-balance">
                {user.bio}
              </p>
            </SectionCard>
          )}

          {/* Experience Section */}
          <SectionCard title="Experience" icon={Award} customDelay={2}>
            {user.experience && user.experience.length > 0 ? (
              <div className="space-y-5">
                {user.experience.map((exp, idx) => (
                  <motion.div 
                    key={exp.id} 
                    variants={defaultVariants} 
                    custom={idx * 0.5 + 2} // Stagger children
                    className="p-4 rounded-lg border border-border/70 hover:shadow-md transition-shadow bg-card/50 hover:bg-card/90"
                  >
                    <div className="flex items-start gap-3">
                        {exp.companyLogo ? 
                            <Avatar className="w-12 h-12 rounded-md border bg-background">
                                <AvatarImage src={exp.companyLogo} alt={exp.companyName} />
                                <AvatarFallback className="rounded-md"><Building className="w-5 h-5 text-muted-foreground"/></AvatarFallback>
                            </Avatar> : 
                            <div className="w-12 h-12 rounded-md bg-muted/70 flex items-center justify-center border border-border/50">
                                <Building className="w-6 h-6 text-primary/70"/>
                            </div>
                        }
                        <div className="flex-1">
                            <h3 className="font-semibold text-base text-foreground">{exp.title}</h3>
                            <p className="text-sm text-primary/90 font-medium">{exp.companyName}</p>
                            <p className="text-xs text-muted-foreground">
                                {exp.startDate} - {exp.endDate || 'Present'} {exp.location && `• ${exp.location}`}
                            </p>
                            {exp.employmentType && <Badge variant="outline" className="mt-1.5 text-xs font-normal border-border/70">{exp.employmentType}</Badge>}
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2.5 whitespace-pre-wrap leading-relaxed">{exp.description}</p>
                    {exp.skills && exp.skills.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-border/50">
                            <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Skills:</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {exp.skills.map(skill => <Badge key={skill} variant="secondary" className="text-xs font-normal px-2 py-0.5 border-transparent shadow-sm">{skill}</Badge>)}
                            </div>
                        </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Briefcase className="w-10 h-10 mx-auto mb-3 text-primary/30" />
                <p className="font-medium">No professional experience listed yet.</p>
                {isCurrentUserProfile && (
                    <Button variant="outline" size="sm" className="mt-4 group" onClick={() => router.push('/dashboard/profile/add-experience')}>
                        <PlusCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform"/> Add Experience
                    </Button>
                )}
              </div>
            )}
          </SectionCard>

          {/* Projects Section */}
          <SectionCard title="Projects" icon={Rocket} customDelay={3}>
            {user.projects && user.projects.length > 0 ? (
              <div className="space-y-5">
                {user.projects.map((proj, idx) => (
                  <motion.div 
                    key={proj.id} 
                    variants={defaultVariants} 
                    custom={idx * 0.5 + 3} // Stagger children
                    className="p-4 rounded-lg border border-border/70 hover:shadow-md transition-shadow bg-card/50 hover:bg-card/90"
                  >
                    {proj.imageUrl && (
                        <div className="mb-3 rounded-md overflow-hidden border border-border/50 max-h-48 relative">
                            <Image 
                                src={proj.imageUrl} 
                                alt={proj.title} 
                                width={800}
                                height={450}
                                className="w-full h-full object-cover"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    )}
                    <h3 className="font-semibold text-base text-foreground">{proj.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1.5">
                        {proj.startDate} {proj.endDate && ` - ${proj.endDate}`}
                    </p>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{proj.description}</p>
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-border/50">
                        <h4 className="text-xs font-semibold text-muted-foreground mb-1.5">Technologies:</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.technologies.map(tech => <Badge key={tech} variant="secondary" className="text-xs font-normal px-2 py-0.5 border-transparent shadow-sm">{tech}</Badge>)}
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-border/50">
                        {proj.url && 
                            <Button variant="outline" size="sm" asChild>
                                <Link href={proj.url} target="_blank" rel="noopener noreferrer">
                                    <Globe className="w-3 h-3 mr-1.5"/> Live Demo
                                </Link>
                            </Button>
                        }
                        {proj.repoUrl && 
                            <Button variant="outline" size="sm" asChild>
                                <Link href={proj.repoUrl} target="_blank" rel="noopener noreferrer">
                                    <Github className="w-3 h-3 mr-1.5"/> Source Code
                                </Link>
                            </Button>
                        }
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Lightbulb className="w-10 h-10 mx-auto mb-3 text-primary/30" />
                <p className="font-medium">No projects listed yet.</p>
                {isCurrentUserProfile && (
                    <Button variant="outline" size="sm" className="mt-4 group" onClick={() => router.push('/dashboard/profile/add-project')}>
                        <PlusCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform"/> Add Project
                    </Button>
                )}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column / Sidebar */}
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          {(user.skills && user.skills.length > 0) && (
            <SectionCard title="Skills" icon={Star} customDelay={4}>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => <Badge key={skill} variant="secondary" className="font-normal px-2.5 py-1 shadow-sm border-transparent text-sm">{skill}</Badge>)}
              </div>
            </SectionCard>
          )}

          {(user.interests && user.interests.length > 0) && (
            <SectionCard title="Interests" icon={Palette} customDelay={5}>
              <div className="flex flex-wrap gap-2">
                {user.interests.map(interest => <Badge key={interest} variant="outline" className="font-normal px-2.5 py-1 text-sm border-border/80">{interest}</Badge>)}
              </div>
            </SectionCard>
          )}
          
          {(user.projectAreas && user.projectAreas.length > 0) && (
            <SectionCard title="Interested in Projects Related To" icon={Lightbulb} customDelay={6}>
                <div className="flex flex-wrap gap-2">
                    {user.projectAreas.map(area => <Badge key={area} variant="default" className="font-normal px-2.5 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-primary/30 border">{area}</Badge>)}
                </div>
            </SectionCard>
          )}

          <SectionCard title="Contact & Socials" icon={LinkIcon} customDelay={7}>
            <div className="space-y-3">
                {user.email && (
                    <div className="flex items-center text-muted-foreground hover:text-primary transition-colors">
                        <Mail className="w-4 h-4 mr-2.5 shrink-0" /> 
                        <a href={`mailto:${user.email}`} className="truncate hover:underline">{user.email}</a>
                    </div>
                )}
                {user.location && (
                    <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2.5 shrink-0" /> {user.location}
                    </div>
                )}
                {user.socialLinks && Object.values(user.socialLinks).some(link => link) && (
                    <div className="pt-2 flex flex-wrap gap-3">
                        {Object.entries(user.socialLinks).map(([platform, link]) => {
                        if (!link) return null;
                        const Icon = socialIconMap[platform] || socialIconMap.default;
                        return (
                            <Link key={platform} href={link.startsWith('http') ? link : `https://${link}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                                <Icon className="w-5 h-5" />
                            </Link>
                        );
                        })}
                    </div>
                )}
                 {!user.email && !user.location && !(user.socialLinks && Object.values(user.socialLinks).some(link => link)) && (
                    <p className="text-xs text-muted-foreground/80 italic">No contact or social media links provided.</p>
                )}
            </div>
          </SectionCard>
        </div>
      </div>
    </motion.div>
  );
};

export default DynamicUserProfilePage; 