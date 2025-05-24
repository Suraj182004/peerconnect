'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, SearchFilters as ActiveFiltersType } from '@/lib/types';
import { allMockProfiles } from '@/lib/mockData'; // Using allMockProfiles
import { getUserProfile } from '@/lib/localStorage';
import { StudentCard } from '@/components/cards/StudentCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Search, ListFilter, LayoutGrid, List } from 'lucide-react';
import { SORT_OPTIONS, FILTER_CATEGORIES, SEARCH_CONFIG } from '@/lib/constants';
import { DEPARTMENTS, ACADEMIC_YEARS, POPULAR_SKILLS, INTERESTS, PROJECT_AREAS } from '@/lib/types'; // Corrected import
import useDebounce from '@/hooks/useDebounce';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from '@/components/ui/scroll-area';

const BrowseStudentsPage = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [allOtherProfiles, setAllOtherProfiles] = useState<UserProfile[]>([]);
  const [displayedProfiles, setDisplayedProfiles] = useState<UserProfile[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_CONFIG.DEBOUNCE_MS);
  
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS[0].value);
  const [activeFilters, setActiveFilters] = useState<ActiveFiltersType>({});
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  useEffect(() => {
    const user = getUserProfile();
    setCurrentUser(user);
    const profilesToDisplay = user 
      ? allMockProfiles.filter(p => p.id !== user.id)
      : allMockProfiles;
    setAllOtherProfiles(profilesToDisplay);
  }, []);

  useEffect(() => {
    let profiles = [...allOtherProfiles]; // Start with all profiles (excluding current user)

    // 1. Apply Search Term (Debounced)
    if (debouncedSearchTerm && debouncedSearchTerm.length >= SEARCH_CONFIG.MIN_QUERY_LENGTH) {
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase();
      profiles = profiles.filter(p => 
        p.firstName.toLowerCase().includes(lowerSearchTerm) ||
        p.lastName.toLowerCase().includes(lowerSearchTerm) ||
        p.department.toLowerCase().includes(lowerSearchTerm) ||
        p.skills.some(s => s.toLowerCase().includes(lowerSearchTerm)) ||
        p.interests.some(i => i.toLowerCase().includes(lowerSearchTerm)) ||
        p.projectAreas.some(pa => pa.toLowerCase().includes(lowerSearchTerm)) ||
        (p.university && p.university.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // 2. Apply Filters (Detailed filter logic will be built out)
    if (activeFilters.departments && activeFilters.departments.length > 0) {
      profiles = profiles.filter(p => activeFilters.departments!.includes(p.department));
    }
    if (activeFilters.years && activeFilters.years.length > 0) {
      profiles = profiles.filter(p => activeFilters.years!.includes(p.year));
    }
    if (activeFilters.skills && activeFilters.skills.length > 0) {
      profiles = profiles.filter(p => activeFilters.skills!.some(s => p.skills.includes(s)));
    }
    if (activeFilters.interests && activeFilters.interests.length > 0) {
      profiles = profiles.filter(p => activeFilters.interests!.some(i => p.interests.includes(i)));
    }
    if (activeFilters.projectAreas && activeFilters.projectAreas.length > 0) {
      profiles = profiles.filter(p => activeFilters.projectAreas!.some(pa => p.projectAreas.includes(pa)));
    }

    // 3. Apply Sorting
    switch (sortOption) {
      case 'newest':
        profiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name_asc': // Example: Add to SORT_OPTIONS if needed
        profiles.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
        break;
      case 'name_desc': // Example: Add to SORT_OPTIONS if needed
        profiles.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`));
        break;
      // Add cases for other sort options like 'connections', 'similar_skills' (more complex)
      // For 'connections', you might need to fetch connection counts or have it on the UserProfile
      // For 'similar_skills', you'd compare current user's skills with others.
      default:
        // Default sort (e.g., by newest or name)
        profiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setDisplayedProfiles(profiles);

  }, [debouncedSearchTerm, activeFilters, sortOption, allOtherProfiles]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
  };
  
  const handleFilterChange = (categoryKey: keyof ActiveFiltersType, value: string, checked: boolean) => {
    setActiveFilters(prevFilters => {
      const currentCategoryFilters = prevFilters[categoryKey] || [];
      let newCategoryFilters: string[];

      if (checked) {
        newCategoryFilters = [...currentCategoryFilters, value];
      } else {
        newCategoryFilters = currentCategoryFilters.filter(item => item !== value);
      }
      
      const updatedFilters = {
        ...prevFilters,
        [categoryKey]: newCategoryFilters.length > 0 ? newCategoryFilters : undefined
      };

      // Remove category if empty to simplify filter object
      if (updatedFilters[categoryKey]?.length === 0) {
        delete updatedFilters[categoryKey];
      }
      return updatedFilters;
    });
  };

  const clearAllFilters = () => {
    setActiveFilters({});
  };
  
  const filterOptions = useMemo(() => ({
    departments: DEPARTMENTS,
    years: ACADEMIC_YEARS,
    skills: POPULAR_SKILLS,
    interests: INTERESTS,
    projectAreas: PROJECT_AREAS,
  }), []);

  if (!currentUser) { 
    return <div className="p-8 text-center min-h-[calc(100vh-4rem)] flex items-center justify-center">Loading user information...</div>;
  }

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div 
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Discover Peers</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Connect with fellow students, share ideas, and collaborate on projects.
        </p>
      </motion.div>

      <motion.div 
        variants={fadeInUp} 
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
        className="mb-6 p-4 bg-card rounded-lg shadow flex flex-col md:flex-row gap-4 items-center sticky top-[65px] z-40 border border-border"
      >
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input 
            placeholder={`Search ${allOtherProfiles.length} students...`}
            className="pl-10 text-base h-11 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Select value={sortOption} onValueChange={setSortOption}> 
                <SelectTrigger className="h-11 w-full md:w-auto min-w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="h-11 w-full md:w-auto">
                    <ListFilter className="w-4 h-4 mr-2" /> Filters 
                    {Object.values(activeFilters).flat().length > 0 && 
                        <Badge variant="secondary" className="ml-2 rounded-full px-1.5 py-0.5 text-xs">
                            {Object.values(activeFilters).flat().length}
                        </Badge>
                    }
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
                <SheetHeader className="p-6 pb-4 border-b">
                  <SheetTitle className="text-xl">Filter Students</SheetTitle>
                  <SheetDescription>
                    Refine your search by selecting specific criteria.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-grow p-6">
                  <div className="space-y-6">
                    {(Object.keys(FILTER_CATEGORIES) as Array<keyof typeof FILTER_CATEGORIES>).map(categoryKey => {
                      const category = FILTER_CATEGORIES[categoryKey];
                      const optionsForCategory = filterOptions[category.key as keyof typeof filterOptions] || [];
                      return (
                        <div key={category.key}>
                          <h4 className="font-semibold text-foreground mb-3">{category.label}</h4>
                          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
                            {optionsForCategory.map(option => (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`${category.key}-${option}`}
                                  checked={activeFilters[category.key as keyof ActiveFiltersType]?.includes(option) || false}
                                  onCheckedChange={(checked) => handleFilterChange(category.key as keyof ActiveFiltersType, option, !!checked)}
                                />
                                <Label htmlFor={`${category.key}-${option}`} className="font-normal text-sm cursor-pointer hover:text-primary">
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
                <SheetFooter className="p-6 pt-4 border-t flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={clearAllFilters} className="w-full sm:w-auto" disabled={Object.keys(activeFilters).length === 0}>Clear All</Button>
                    <SheetClose asChild>
                        <Button className="w-full sm:w-auto">Apply Filters</Button>
                    </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
        </div>
        <div className="hidden md:flex items-center gap-1 p-1 bg-muted rounded-md">
            <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                <List className="w-5 h-5" />
            </Button>
        </div>
      </motion.div>

      {displayedProfiles.length === 0 && (debouncedSearchTerm || Object.keys(activeFilters).length > 0) && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold">No Students Found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters.</p>
        </motion.div>
      )}
      
      {displayedProfiles.length === 0 && !debouncedSearchTerm && Object.keys(activeFilters).length === 0 && (
         <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center py-12">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Discover Your Peers</h3>
            <p className="text-muted-foreground mt-1">Use the search and filters above to find students.</p>
        </motion.div>
      )}

      <motion.div 
        key={viewMode} 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5"
            : "space-y-4"
        }
      >
        {displayedProfiles.map(profile => (
          <motion.div key={profile.id} variants={fadeInUp}>
            <StudentCard profile={profile} /> 
          </motion.div>
        ))}
      </motion.div>
      
      {displayedProfiles.length > SEARCH_CONFIG.RESULTS_PER_PAGE && (
          <div className="mt-12 flex justify-center">
              <Button variant="outline">Load More Students</Button>
          </div>
      )}

    </div>
  );
};

export default BrowseStudentsPage; 