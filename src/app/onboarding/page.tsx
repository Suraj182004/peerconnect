'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UploadCloud, Linkedin, Github, Twitter, Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { OnboardingFormData, UserProfile, ACADEMIC_YEARS, DEPARTMENTS, POPULAR_SKILLS, INTERESTS } from '@/lib/types';
import { setUserProfile, setOnboardingStatus } from '@/lib/localStorage';
import { APP_CONFIG, VALIDATION_RULES, INDIAN_COLLEGES, PROJECT_AREAS, SOCIAL_PLATFORMS } from '@/lib/constants';
import { v4 as uuidv4 } from 'uuid';

// Validation schemas for each step
const step1Schema = z.object({
  firstName: z.string().min(VALIDATION_RULES.NAME.MIN_LENGTH, 'First name is too short').max(VALIDATION_RULES.NAME.MAX_LENGTH, 'First name is too long'),
  lastName: z.string().min(VALIDATION_RULES.NAME.MIN_LENGTH, 'Last name is too short').max(VALIDATION_RULES.NAME.MAX_LENGTH, 'Last name is too long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, 'Password must be at least 8 characters'),
});

const step2Schema = z.object({
  university: z.string().min(1, 'Please select your university'),
  collegeId: z.string().min(VALIDATION_RULES.COLLEGE_ID.MIN_LENGTH, 'College ID is too short').max(VALIDATION_RULES.COLLEGE_ID.MAX_LENGTH, 'College ID is too long'),
  year: z.string().min(1, 'Please select your academic year'),
  department: z.string().min(1, 'Please select your department'),
});

const step3Schema = z.object({
  skills: z.array(z.string()).min(VALIDATION_RULES.SKILLS.MIN_COUNT, `Select at least ${VALIDATION_RULES.SKILLS.MIN_COUNT} skill`).max(VALIDATION_RULES.SKILLS.MAX_COUNT, `Select no more than ${VALIDATION_RULES.SKILLS.MAX_COUNT} skills`),
  interests: z.array(z.string()).min(VALIDATION_RULES.INTERESTS.MIN_COUNT, `Select at least ${VALIDATION_RULES.INTERESTS.MIN_COUNT} interest`).max(VALIDATION_RULES.INTERESTS.MAX_COUNT, `Select no more than ${VALIDATION_RULES.INTERESTS.MAX_COUNT} interests`),
  projectAreas: z.array(z.string()).min(VALIDATION_RULES.PROJECT_AREAS.MIN_COUNT, `Select at least ${VALIDATION_RULES.PROJECT_AREAS.MIN_COUNT} project area`).max(VALIDATION_RULES.PROJECT_AREAS.MAX_COUNT, `Select no more than ${VALIDATION_RULES.PROJECT_AREAS.MAX_COUNT} project areas`),
});

const step4Schema = z.object({
  bio: z.string().max(VALIDATION_RULES.BIO.MAX_LENGTH, `Bio should not exceed ${VALIDATION_RULES.BIO.MAX_LENGTH} characters`).optional(),
  profilePicture: z.any().optional(), 
  socialLinks: z.object({
    linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal('')),
    github: z.string().url("Invalid GitHub URL").optional().or(z.literal('')),
    twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal('')),
    portfolio: z.string().url("Invalid Portfolio URL").optional().or(z.literal('')),
  }).optional(),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;
type Step3Data = z.infer<typeof step3Schema>;
type Step4Data = z.infer<typeof step4Schema>;

const OnboardingPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const step1Form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    mode: 'onChange',
    defaultValues: formData.step1
  });

  const step2Form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    mode: 'onChange',
    defaultValues: formData.step2
  });

  const step3Form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    mode: 'onChange',
    defaultValues: { skills: [], interests: [], projectAreas: [], ...formData.step3 }
  });

  const step4Form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    mode: 'onChange',
    defaultValues: { bio: '', socialLinks: { linkedin: '', github: '', twitter: '', portfolio: '' }, ...formData.step4 }
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNextStep = () => setCurrentStep(prev => prev + 1);
  const handlePrevStep = () => setCurrentStep(prev => prev - 1);

  const onStep1Submit = (data: Step1Data) => {
    setFormData(prev => ({ ...prev, step1: data }));
    handleNextStep();
  };

  const onStep2Submit = (data: Step2Data) => {
    setFormData(prev => ({ ...prev, step2: data }));
    handleNextStep();
  };

  const onStep3Submit = (data: Step3Data) => {
    setFormData(prev => ({ ...prev, step3: data }));
    handleNextStep();
  };
  
  const onStep4Submit = (data: Step4Data) => {
    setFormData(prev => ({ ...prev, step4: data }));
    // For the final step, we don't call handleNextStep(), instead, final submission is handled by a dedicated button.
    // The actual submission will occur via handleFinalSubmit triggered by a button in Step 4 UI.
    // This function is mainly for validation and collecting data if we wanted an intermediate "Save Draft" for step 4.
    // For now, it just updates the form data.
  };

  const handleFinalSubmit = () => {
    // Trigger validation for the current step's form (Step 4)
    step4Form.handleSubmit(async (data) => {
      const updatedFormData = { ...formData, step4: data };
      setFormData(updatedFormData);

      if (updatedFormData.step1 && updatedFormData.step2 && updatedFormData.step3 && updatedFormData.step4) {
        const finalData: UserProfile = {
          id: uuidv4(),
          firstName: updatedFormData.step1.firstName,
          lastName: updatedFormData.step1.lastName,
          email: updatedFormData.step1.email,
          collegeId: updatedFormData.step2.collegeId,
          year: updatedFormData.step2.year,
          department: updatedFormData.step2.department,
          university: updatedFormData.step2.university,
          skills: updatedFormData.step3.skills,
          interests: updatedFormData.step3.interests,
          projectAreas: updatedFormData.step3.projectAreas,
          bio: updatedFormData.step4.bio || '',
          avatar: avatarPreview || '/avatars/default-avatar.png',
          socialLinks: updatedFormData.step4.socialLinks,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUserProfile(finalData);
        setOnboardingStatus(true);
        router.push('/dashboard');
      }
    })(); // Immediately invoke the submit handler
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > APP_CONFIG.maxFileSize) {
        step4Form.setError("profilePicture", { type: "manual", message: `File size should be less than ${APP_CONFIG.maxFileSize / (1024*1024)}MB` });
        return;
      }
      if (!APP_CONFIG.supportedImageTypes.includes(file.type)) {
        step4Form.setError("profilePicture", { type: "manual", message: "Invalid file type. Please upload JPG, PNG, or WebP." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        step4Form.setValue('profilePicture', reader.result as string); // Store base64 for simplicity
        step4Form.clearErrors("profilePicture");
      };
      reader.readAsDataURL(file);
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const MultiSelectItem = ({ label, isSelected, onToggle }: { label: string, isSelected: boolean, onToggle: () => void}) => (
    <Badge 
      variant={isSelected ? 'default' : 'outline'} 
      onClick={onToggle} 
      className="cursor-pointer text-sm px-3 py-1.5 hover:bg-accent/20 transition-colors duration-150"
    >
      {label}
    </Badge>
  );

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold text-foreground">{APP_CONFIG.name}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-2xl border-0 bg-card">
            <CardContent className="p-8">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="step1" variants={fadeInVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Let's get started</h2>
                        <p className="text-muted-foreground">Create your account to join the student community</p>
                      </div>
                      <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="firstName">First name</Label>
                            <Input id="firstName" placeholder="Enter your first name" {...step1Form.register('firstName')} className={step1Form.formState.errors.firstName ? 'border-destructive' : ''} />
                            {step1Form.formState.errors.firstName && <p className="text-sm text-destructive">{step1Form.formState.errors.firstName.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input id="lastName" placeholder="Enter your last name" {...step1Form.register('lastName')} className={step1Form.formState.errors.lastName ? 'border-destructive' : ''} />
                            {step1Form.formState.errors.lastName && <p className="text-sm text-destructive">{step1Form.formState.errors.lastName.message}</p>}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="Enter your email" {...step1Form.register('email')} className={step1Form.formState.errors.email ? 'border-destructive' : ''} />
                          {step1Form.formState.errors.email && <p className="text-sm text-destructive">{step1Form.formState.errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" placeholder="Enter your password" {...step1Form.register('password')} className={step1Form.formState.errors.password ? 'border-destructive' : ''} />
                          {step1Form.formState.errors.password && <p className="text-sm text-destructive">{step1Form.formState.errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full h-12 text-base font-medium" disabled={!step1Form.formState.isValid}>Next</Button>
                      </form>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step2" variants={fadeInVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="space-y-6">
                       <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Academic Information</h2>
                        <p className="text-muted-foreground">Tell us about your academic background</p>
                      </div>
                      <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="university">University</Label>
                          <Controller
                            name="university"
                            control={step2Form.control}
                            render={({ field }) => (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className={step2Form.formState.errors.university ? 'border-destructive' : ''}>
                                  <SelectValue placeholder="Select your university" />
                                </SelectTrigger>
                                <SelectContent>
                                  {INDIAN_COLLEGES.map((uni) => (
                                    <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {step2Form.formState.errors.university && <p className="text-sm text-destructive">{step2Form.formState.errors.university.message}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="collegeId">College ID</Label>
                          <Input id="collegeId" placeholder="Enter your college ID" {...step2Form.register('collegeId')} className={step2Form.formState.errors.collegeId ? 'border-destructive' : ''} />
                          {step2Form.formState.errors.collegeId && <p className="text-sm text-destructive">{step2Form.formState.errors.collegeId.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="year">Academic Year</Label>
                             <Controller
                              name="year"
                              control={step2Form.control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className={step2Form.formState.errors.year ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select year" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ACADEMIC_YEARS.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {step2Form.formState.errors.year && <p className="text-sm text-destructive">{step2Form.formState.errors.year.message}</p>}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Controller
                              name="department"
                              control={step2Form.control}
                              render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger className={step2Form.formState.errors.department ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Select department" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {DEPARTMENTS.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                            {step2Form.formState.errors.department && <p className="text-sm text-destructive">{step2Form.formState.errors.department.message}</p>}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" onClick={handlePrevStep} className="flex-1 h-12">Back</Button>
                          <Button type="submit" className="flex-1 h-12" disabled={!step2Form.formState.isValid}>Next</Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step3" variants={fadeInVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Skills & Interests</h2>
                        <p className="text-muted-foreground">Showcase your expertise and passions.</p>
                      </div>
                      <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-8">
                        <div>
                          <Label className="text-base font-semibold text-foreground">Your Skills</Label>
                          <p className="text-sm text-muted-foreground mb-3">Select up to {VALIDATION_RULES.SKILLS.MAX_COUNT} skills that best describe your expertise.</p>
                          <Controller
                            name="skills"
                            control={step3Form.control}
                            render={({ field }) => (
                              <div className="flex flex-wrap gap-3">
                                {POPULAR_SKILLS.map(skill => (
                                  <MultiSelectItem
                                    key={skill}
                                    label={skill}
                                    isSelected={field.value?.includes(skill) || false}
                                    onToggle={() => {
                                      const newValue = field.value?.includes(skill)
                                        ? field.value.filter(s => s !== skill)
                                        : [...(field.value || []), skill];
                                      field.onChange(newValue);
                                      step3Form.trigger("skills"); // Trigger validation on change
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          />
                          {step3Form.formState.errors.skills && <p className="text-sm text-destructive mt-2">{step3Form.formState.errors.skills.message}</p>}
                        </div>

                        <div>
                          <Label className="text-base font-semibold text-foreground">Your Interests</Label>
                          <p className="text-sm text-muted-foreground mb-3">Select up to {VALIDATION_RULES.INTERESTS.MAX_COUNT} interests.</p>
                          <Controller
                            name="interests"
                            control={step3Form.control}
                            render={({ field }) => (
                              <div className="flex flex-wrap gap-3">
                                {INTERESTS.map(interest => (
                                  <MultiSelectItem
                                    key={interest}
                                    label={interest}
                                    isSelected={field.value?.includes(interest) || false}
                                    onToggle={() => {
                                      const newValue = field.value?.includes(interest)
                                        ? field.value.filter(i => i !== interest)
                                        : [...(field.value || []), interest];
                                      field.onChange(newValue);
                                      step3Form.trigger("interests");
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          />
                          {step3Form.formState.errors.interests && <p className="text-sm text-destructive mt-2">{step3Form.formState.errors.interests.message}</p>}
                        </div>

                        <div>
                          <Label className="text-base font-semibold text-foreground">Project Areas</Label>
                          <p className="text-sm text-muted-foreground mb-3">What kind of projects are you interested in? Select up to {VALIDATION_RULES.PROJECT_AREAS.MAX_COUNT}.</p>
                          <Controller
                            name="projectAreas"
                            control={step3Form.control}
                            render={({ field }) => (
                              <div className="flex flex-wrap gap-3">
                                {PROJECT_AREAS.map(area => (
                                  <MultiSelectItem
                                    key={area}
                                    label={area}
                                    isSelected={field.value?.includes(area) || false}
                                    onToggle={() => {
                                      const newValue = field.value?.includes(area)
                                        ? field.value.filter(a => a !== area)
                                        : [...(field.value || []), area];
                                      field.onChange(newValue);
                                      step3Form.trigger("projectAreas");
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          />
                          {step3Form.formState.errors.projectAreas && <p className="text-sm text-destructive mt-2">{step3Form.formState.errors.projectAreas.message}</p>}
                        </div>

                        <div className="flex justify-between pt-4">
                          <Button type="button" variant="outline" onClick={handlePrevStep}>Previous</Button>
                          <Button type="submit">Next</Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="step4" variants={fadeInVariants} initial="hidden" animate="visible" exit="exit">
                    <div className="space-y-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Complete Your Profile</h2>
                        <p className="text-muted-foreground">Add the finishing touches to make your profile stand out.</p>
                      </div>
                      <form onSubmit={step4Form.handleSubmit(onStep4Submit)} className="space-y-8">
                        {/* Profile Picture Upload */}
                        <div>
                          <Label className="text-base font-semibold text-foreground">Profile Picture</Label>
                          <p className="text-sm text-muted-foreground mb-3">Upload a picture to make your profile more personal.</p>
                          <div className="flex items-center gap-6">
                            <Avatar className="w-24 h-24 border-2 border-muted cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                              <AvatarImage src={avatarPreview || undefined} alt="User avatar" />
                              <AvatarFallback className="text-3xl">
                                {formData.step1?.firstName?.[0]}
                                {formData.step1?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="relative">
                              <UploadCloud className="w-4 h-4 mr-2" /> Upload Photo
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                accept={APP_CONFIG.supportedImageTypes.join(',')}
                                onChange={handleAvatarUpload} 
                              />
                            </Button>
                          </div>
                          {step4Form.formState.errors.profilePicture && <p className="text-sm text-destructive mt-2">{step4Form.formState.errors.profilePicture.message}</p>}
                        </div>

                        {/* Bio */}
                        <div>
                          <Label htmlFor="bio" className="text-base font-semibold text-foreground">Your Bio</Label>
                          <p className="text-sm text-muted-foreground mb-3">Write a short bio about yourself (max {VALIDATION_RULES.BIO.MAX_LENGTH} characters).</p>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about your passion, projects, and what you're looking for..."
                            {...step4Form.register('bio')}
                            className="min-h-[120px]"
                          />
                          {step4Form.formState.errors.bio && <p className="text-sm text-destructive mt-2">{step4Form.formState.errors.bio.message}</p>}
                        </div>

                        {/* Social Links */}
                        <div>
                          <Label className="text-base font-semibold text-foreground">Social Links (Optional)</Label>
                          <p className="text-sm text-muted-foreground mb-4">Connect your other profiles.</p>
                          <div className="space-y-4">
                            {(Object.keys(SOCIAL_PLATFORMS) as Array<keyof typeof SOCIAL_PLATFORMS>).map(platformKey => {
                              const platform = SOCIAL_PLATFORMS[platformKey];
                              const IconComponent = 
                                platform.icon === 'linkedin' ? Linkedin :
                                platform.icon === 'github' ? Github :
                                platform.icon === 'twitter' ? Twitter :
                                Globe;
                              return (
                                <div key={platformKey} className="relative">
                                  <IconComponent className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground`} style={{ color: platform.color}} />
                                  <Input 
                                    id={`socialLinks.${platformKey.toLowerCase()}`}
                                    placeholder={`${platform.name} Profile URL (e.g. ${platform.baseUrl}yourusername)`}
                                    {...step4Form.register(`socialLinks.${platformKey.toLowerCase()}` as const)}
                                    className="pl-10"
                                  />
                                  {step4Form.formState.errors.socialLinks?.[platformKey.toLowerCase() as keyof Step4Data['socialLinks']] && 
                                    <p className="text-sm text-destructive mt-1">{step4Form.formState.errors.socialLinks?.[platformKey.toLowerCase() as keyof Step4Data['socialLinks']]?.message}</p>}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex justify-between pt-6">
                          <Button type="button" variant="outline" onClick={handlePrevStep}>Previous</Button>
                          <Button type="button" onClick={handleFinalSubmit} disabled={!step4Form.formState.isValid && Object.keys(step4Form.formState.touchedFields).length > 0 && Object.keys(step4Form.formState.errors).length > 0}>Complete Profile</Button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage; 