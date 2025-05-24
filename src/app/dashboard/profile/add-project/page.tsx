'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { getUserProfile, updateUserProfile } from '@/lib/localStorage';
import { UserProfile, Project } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Rocket, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const projectSchema = z.object({
  projectName: z.string().min(3, { message: 'Project name must be at least 3 characters.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(1000),
  technologies: z.string().min(2, {message: 'Please list technologies used.'}).max(200),
  projectUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  repoUrl: z.string().url({ message: 'Please enter a valid URL.' }).optional().or(z.literal('')),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Please enter a valid start date.' }),
  endDate: z.string().optional().or(z.literal('')),
  teamMembers: z.string().max(200).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const AddProjectPage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = getUserProfile();
    if (user) {
      setCurrentUser(user);
    } else {
      toast({ title: 'Error', description: 'User profile not found. Redirecting...', variant: 'destructive' });
      router.push('/dashboard');
    }
  }, [router]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      description: '',
      technologies: '',
      projectUrl: '',
      repoUrl: '',
      startDate: '',
      endDate: '',
      teamMembers: '',
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    if (!currentUser) return;
    setIsLoading(true);

    const newProject: Project = {
      id: uuidv4(),
      title: data.projectName,
      description: data.description,
      technologies: data.technologies.split(',').map(tech => tech.trim()).filter(Boolean),
      startDate: data.startDate,
      url: data.projectUrl || undefined,
      repoUrl: data.repoUrl || undefined,
      endDate: data.endDate || undefined,
      teamMembers: data.teamMembers || undefined,
    };

    const updatedProjects = [...(currentUser.projects || []), newProject];
    const updatedProfile = { ...currentUser, projects: updatedProjects };

    updateUserProfile(updatedProfile);
    setCurrentUser(updatedProfile);
    toast({
      title: 'Project Added!',
      description: `Successfully added ${data.projectName} to your profile.`,
      variant: 'default',
    });
    reset();
    setIsLoading(false);
    router.push(`/dashboard/profile/${currentUser.id}`);
  };

  const defaultVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>; // Or a more sophisticated loader
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={defaultVariants}
      className="max-w-3xl mx-auto py-8 md:py-12 px-4"
    >
      <Button variant="outline" onClick={() => router.back()} className="mb-6 items-center">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Profile
      </Button>

      <Card className="shadow-xl border-border/70">
        <CardHeader className="bg-muted/30">
          <div className="flex items-center space-x-3">
            <Rocket className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Add New Project</CardTitle>
              <CardDescription>Showcase your projects and contributions.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={defaultVariants} custom={1} className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="projectName" className="font-medium">Project Name</Label>
                <Controller
                  name="projectName"
                  control={control}
                  render={({ field }) => <Input id="projectName" placeholder="e.g., PeerConnect Platform" {...field} className={errors.projectName ? 'border-destructive' : ''} />}
                />
                {errors.projectName && <p className="text-xs text-destructive">{errors.projectName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="technologies" className="font-medium">Technologies Used</Label>
                <Controller
                  name="technologies"
                  control={control}
                  render={({ field }) => <Input id="technologies" placeholder="e.g., React, Next.js, Tailwind CSS" {...field} className={errors.technologies ? 'border-destructive' : ''} />}
                />
                {errors.technologies && <p className="text-xs text-destructive">{errors.technologies.message}</p>}
              </div>
            </motion.div>

            <motion.div variants={defaultVariants} custom={2} className="space-y-1.5">
              <Label htmlFor="description" className="font-medium">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => <Textarea id="description" placeholder="Detailed description of your project, its features, and your role..." {...field} rows={5} className={errors.description ? 'border-destructive' : ''} />}
              />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </motion.div>

            <motion.div variants={defaultVariants} custom={3} className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="projectUrl" className="font-medium">Project URL (Optional)</Label>
                <Controller
                  name="projectUrl"
                  control={control}
                  render={({ field }) => <Input id="projectUrl" placeholder="https://yourproject.com" {...field} className={errors.projectUrl ? 'border-destructive' : ''} />}
                />
                {errors.projectUrl && <p className="text-xs text-destructive">{errors.projectUrl.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="repoUrl" className="font-medium">Repository URL (Optional)</Label>
                <Controller
                  name="repoUrl"
                  control={control}
                  render={({ field }) => <Input id="repoUrl" placeholder="https://github.com/your/repo" {...field} className={errors.repoUrl ? 'border-destructive' : ''} />}
                />
                {errors.repoUrl && <p className="text-xs text-destructive">{errors.repoUrl.message}</p>}
              </div>
            </motion.div>
            
            <motion.div variants={defaultVariants} custom={4} className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <Label htmlFor="startDate" className="font-medium">Start Date</Label>
                    <Controller name="startDate" control={control} render={({ field }) => <Input id="startDate" type="date" {...field} className={errors.startDate ? 'border-destructive' : ''} />} />
                    {errors.startDate && <p className="text-xs text-destructive">{errors.startDate.message}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="endDate" className="font-medium">End Date (Optional - leave blank if ongoing)</Label>
                    <Controller name="endDate" control={control} render={({ field }) => <Input id="endDate" type="date" {...field} className={errors.endDate ? 'border-destructive' : ''} />} />
                    {errors.endDate && <p className="text-xs text-destructive">{errors.endDate.message}</p>}
                </div>
            </motion.div>

            <motion.div variants={defaultVariants} custom={5} className="space-y-1.5">
                <Label htmlFor="teamMembers" className="font-medium">Team Members (Optional)</Label>
                <Controller
                  name="teamMembers"
                  control={control}
                  render={({ field }) => <Input id="teamMembers" placeholder="e.g., Suraj Yaligar, Gemini AI (separate with commas)" {...field} className={errors.teamMembers ? 'border-destructive' : ''} />}
                />
                {errors.teamMembers && <p className="text-xs text-destructive">{errors.teamMembers.message}</p>}
              </motion.div>

            <motion.div variants={defaultVariants} custom={6} className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="items-center gap-2 shadow-md hover:shadow-lg transition-shadow" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" /> Add Project
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AddProjectPage; 