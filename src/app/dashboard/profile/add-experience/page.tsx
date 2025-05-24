'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { getUserProfile, updateUserProfile } from '@/lib/localStorage';
import { UserProfile, Experience } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Briefcase, PlusCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

const experienceSchema = z.object({
  title: z.string().min(3, { message: 'Job title must be at least 3 characters.' }),
  companyName: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  location: z.string().optional(),
  employmentType: z.enum(['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract', 'Volunteer']),
  startDate: z.string().refine((date) => !isNaN(Date.parse(date)), { message: 'Please enter a valid start date.' }),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }).max(1000, { message: 'Description must not exceed 1000 characters.' }),
  skills: z.string().optional(), // Comma-separated skills
}).refine(data => {
    if (!data.isCurrent && !data.endDate) {
      return false;
    }
    return true;
  }, { message: 'End date is required if not currently working here.', path: ['endDate'] });

type ExperienceFormData = z.infer<typeof experienceSchema>;

const AddExperiencePage = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const user = getUserProfile();
    if (!user) {
      router.push('/onboarding'); // Should not happen if navigating from profile
    } else {
      setCurrentUser(user);
    }
  }, [router]);

  const form = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      title: '',
      companyName: '',
      location: '',
      employmentType: 'Internship',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      skills: '',
    },
  });

  const onSubmit = (data: ExperienceFormData) => {
    if (!currentUser) return;

    const newExperience: Experience = {
      id: uuidv4(),
      title: data.title,
      companyName: data.companyName,
      location: data.location,
      employmentType: data.employmentType,
      startDate: new Date(data.startDate).toISOString(), // Store as ISO string or consistent format
      endDate: data.isCurrent ? undefined : (data.endDate ? new Date(data.endDate).toISOString() : undefined),
      description: data.description,
      skills: data.skills?.split(',').map(s => s.trim()).filter(s => s) || [],
    };

    const updatedProfile: UserProfile = {
      ...currentUser,
      experience: [...(currentUser.experience || []), newExperience],
    };

    updateUserProfile(updatedProfile);
    toast({
      title: 'Experience Added',
      description: `${data.title} at ${data.companyName} has been added to your profile.`,
      variant: 'success',
    });
    router.push(`/dashboard/profile/${currentUser.id}`);
    router.refresh(); // to ensure profile page re-fetches or re-renders with new data
  };
  
  const isCurrentJob = form.watch('isCurrent');

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
        <Button variant="outline" size="sm" className="mb-6 group" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"/> Back to Profile
        </Button>
      <Card className="shadow-xl border-border/60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="w-7 h-7 text-primary" />
            <CardTitle className="text-2xl font-bold">Add Work Experience</CardTitle>
          </div>
          <CardDescription>
            Showcase your professional journey, internships, and volunteer roles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title / Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineering Intern, Marketing Lead" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Google, Teach For India" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="employmentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employment type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {['Internship', 'Full-time', 'Part-time', 'Freelance', 'Contract', 'Volunteer'].map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bengaluru, India or Remote" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!isCurrentJob && (
                    <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                            <Input type="month" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
              </div>

              <FormField
                control={form.control}
                name="isCurrent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-2 mb-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      I am currently working in this role
                    </FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements... (min. 10 characters)"
                        className="min-h-[100px] resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills Utilized (Optional, comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., React, Project Management, Public Speaking" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full sm:w-auto group" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adding...' : 'Add Experience'}
                <PlusCircle className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform"/>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddExperiencePage; 