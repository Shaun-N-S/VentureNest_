import { useState } from 'react';
import {
    Upload,
    Building2,
    FileText,
    Link2,
    Users,
    Tag,
    TrendingUp,
    Image,
    MapPin,
    DollarSign,
    Check,
    AlertCircle
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { Alert, AlertDescription } from '../../components/ui/alert';

// Types
interface FormErrors {
    startupName?: string;
    shortDescription?: string;
    pitchDeckUrl?: string;
    projectWebsite?: string;
    userRole?: string;
    teamSize?: string;
    category?: string;
    stage?: string;
    logoUrl?: string;
    coverImageUrl?: string;
    donationTarget?: string;
    submit?: string;
}

interface FormData {
    startupName: string;
    shortDescription: string;
    pitchDeckUrl: File | null;
    projectWebsite: string;
    userRole: string;
    teamSize: string;
    category: string;
    stage: string;
    logoUrl: File | null;
    coverImageUrl: File | null;
    location: string;
    donationEnabled: boolean;
    donationTarget: string;
}

// Validation schema
const projectSchema = {
    startupName: { required: true, minLength: 2, maxLength: 100 },
    shortDescription: { required: true, minLength: 10, maxLength: 500 },
    pitchDeckUrl: { required: false, maxSize: 10 * 1024 * 1024, accept: '.pdf' },
    projectWebsite: { required: false, pattern: /^https?:\/\/.+/ },
    userRole: { required: true },
    teamSize: { required: true },
    category: { required: true },
    stage: { required: true },
    logoUrl: { required: false, maxSize: 5 * 1024 * 1024, accept: 'image/*' },
    coverImageUrl: { required: false, maxSize: 5 * 1024 * 1024, accept: 'image/*' },
    location: { required: false, maxLength: 100 },
    donationEnabled: { required: false },
    donationTarget: { required: false, min: 0, max: 100000 },
};

const STAGES = [
    "Idea Stage",
    "Prototype Stage",
    "MVP",
    "Beta",
    "Live Project",
    "Seed Stage",
    "Early Growth",
    "Scaling Stage",
    "Established / Revenue Generating",
];

const SECTORS = [
    "AI/ML",
    "FinTech",
    "HealthTech",
    "EdTech",
    "AgriTech",
    "E-commerce",
    "SaaS",
    "BlockChain/Crypto",
    "GreenTech",
    "Real Estate/PropTech",
    "FoodTech",
    "Gaming",
    "Social Media",
    "Travel & Hospitality",
    "Logistic & SupplyChain",
    "CyberSecurity",
    "IoT/Hardware",
    "AR/VR",
    "Services",
];

const ROLES = ["Founder", "Co-Founder", "Developer", "Designer", "Marketing", "Other"];
const TEAM_SIZES = ["Solo", "2-5", "6-10", "11-20", "21-50", "50+"];

export default function AddProjectModal() {
    const [open, setOpen] = useState(true);
    const [errors, setErrors] = useState<FormErrors>({});
    const [formData, setFormData] = useState<FormData>({
        startupName: '',
        shortDescription: '',
        pitchDeckUrl: null,
        projectWebsite: '',
        userRole: '',
        teamSize: '',
        category: '',
        stage: '',
        logoUrl: null,
        coverImageUrl: null,
        location: '',
        donationEnabled: false,
        donationTarget: '',
    });

    const handleInputChange = (field: keyof FormData, value: string | boolean | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleFileChange = (field: 'pitchDeckUrl' | 'logoUrl' | 'coverImageUrl', file: File | null | undefined) => {
        const schema = projectSchema[field];

        if (file) {
            // Validate file size
            if (schema.maxSize && file.size > schema.maxSize) {
                setErrors(prev => ({
                    ...prev,
                    [field]: `File size must be less than ${schema.maxSize / (1024 * 1024)}MB`
                }));
                return;
            }

            // Validate file type for PDF
            if (field === 'pitchDeckUrl' && file.type !== 'application/pdf') {
                setErrors(prev => ({ ...prev, [field]: 'Only PDF files are allowed' }));
                return;
            }

            // Validate file type for images
            if ((field === 'logoUrl' || field === 'coverImageUrl') && !file.type.startsWith('image/')) {
                setErrors(prev => ({ ...prev, [field]: 'Only image files are allowed' }));
                return;
            }
        }

        handleInputChange(field, file || null);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Validate required fields
        if (!formData.startupName || formData.startupName.length < 2) {
            newErrors.startupName = 'Startup name must be at least 2 characters';
        }
        if (formData.startupName.length > 100) {
            newErrors.startupName = 'Startup name must be less than 100 characters';
        }

        if (!formData.shortDescription || formData.shortDescription.length < 10) {
            newErrors.shortDescription = 'Description must be at least 10 characters';
        }
        if (formData.shortDescription.length > 500) {
            newErrors.shortDescription = 'Description must be less than 500 characters';
        }

        if (!formData.userRole) {
            newErrors.userRole = 'Please select your role';
        }

        if (!formData.teamSize) {
            newErrors.teamSize = 'Please select team size';
        }

        if (!formData.category) {
            newErrors.category = 'Please select a category';
        }

        if (!formData.stage) {
            newErrors.stage = 'Please select a stage';
        }

        // Validate optional website URL
        if (formData.projectWebsite && !projectSchema.projectWebsite.pattern.test(formData.projectWebsite)) {
            newErrors.projectWebsite = 'Please enter a valid URL (starting with http:// or https://)';
        }

        // Validate donation target if enabled
        if (formData.donationEnabled) {
            const target = parseFloat(formData.donationTarget);
            if (!formData.donationTarget || isNaN(target)) {
                newErrors.donationTarget = 'Please enter a donation target amount';
            } else if (target < 0) {
                newErrors.donationTarget = 'Amount must be positive';
            } else if (target > 100000) {
                newErrors.donationTarget = 'Amount cannot exceed 1,00,000';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        // Create FormData for multipart/form-data submission
        const submitData = new FormData();

        // Add required fields
        submitData.append('userId', 'current-user-id'); // Replace with actual userId
        submitData.append('startupName', formData.startupName);
        submitData.append('shortDescription', formData.shortDescription);
        submitData.append('userRole', formData.userRole);
        submitData.append('teamSize', formData.teamSize);
        submitData.append('category', formData.category);
        submitData.append('stage', formData.stage);

        // Add optional fields only if they have values
        if (formData.pitchDeckUrl) {
            submitData.append('pitchDeckUrl', formData.pitchDeckUrl);
        }

        if (formData.projectWebsite) {
            submitData.append('projectWebsite', formData.projectWebsite);
        }

        if (formData.logoUrl) {
            submitData.append('logoUrl', formData.logoUrl);
        }

        if (formData.coverImageUrl) {
            submitData.append('coverImageUrl', formData.coverImageUrl);
        }

        if (formData.location) {
            submitData.append('location', formData.location);
        }

        if (formData.donationEnabled) {
            submitData.append('donationEnabled', 'true');
            submitData.append('donationTarget', formData.donationTarget.toString());
        }

        try {
            console.log('Form Data to Submit:');
            for (const [key, value] of submitData.entries()) {
                console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
            }

            // Example API call
            // const response = await fetch('/api/projects', {
            //   method: 'POST',
            //   body: submitData,
            // });
            // const data = await response.json();

            setOpen(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrors({ submit: 'Failed to create project. Please try again.' });
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-950">
            <Button onClick={() => setOpen(true)} className="mb-4 bg-blue-600 hover:bg-blue-700">
                Open Add Project Modal
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <div className="sticky top-0 z-10 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-b px-6 py-4">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Transform Your Idea Into Reality
                            </DialogTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Pitch your startup. Upload your deck. Inspire the world.
                            </p>
                        </DialogHeader>
                    </div>

                    <div className="px-6 py-6 space-y-6">
                        {errors.submit && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.submit}</AlertDescription>
                            </Alert>
                        )}

                        {/* Startup Name */}
                        <div className="space-y-2">
                            <Label htmlFor="startupName" className="flex items-center gap-2 text-sm font-medium">
                                <Building2 className="w-4 h-4 text-blue-600" />
                                Startup Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="startupName"
                                placeholder="Enter your startup name"
                                value={formData.startupName}
                                onChange={(e) => handleInputChange('startupName', e.target.value)}
                                className={`transition-all focus:ring-2 focus:ring-blue-500 ${errors.startupName ? 'border-red-500' : ''}`}
                            />
                            {errors.startupName && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.startupName}
                                </p>
                            )}
                        </div>

                        {/* Short Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Short Description <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="E.g., Simplifying project management"
                                value={formData.shortDescription}
                                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                                className={`min-h-[80px] transition-all focus:ring-2 focus:ring-blue-500 ${errors.shortDescription ? 'border-red-500' : ''}`}
                            />
                            <div className="flex justify-between items-center">
                                {errors.shortDescription && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.shortDescription}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 ml-auto">
                                    {formData.shortDescription.length}/500
                                </p>
                            </div>
                        </div>

                        {/* Pitch Deck Upload */}
                        <div className="space-y-2">
                            <Label className="flex items-center gap-2 text-sm font-medium">
                                <Upload className="w-4 h-4 text-blue-600" />
                                Pitch Deck <span className="text-xs text-gray-500">(10 mb max, optional)</span>
                            </Label>
                            <div
                                onClick={() => document.getElementById('pitchDeck')?.click()}
                                className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 ${errors.pitchDeckUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                            >
                                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                {formData.pitchDeckUrl ? (
                                    <p className="text-sm text-blue-600 font-medium">{formData.pitchDeckUrl.name}</p>
                                ) : (
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Click to upload or drag and drop
                                    </p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">PDF (max 10MB)</p>
                            </div>
                            <input
                                id="pitchDeck"
                                type="file"
                                accept=".pdf"
                                onChange={(e) => handleFileChange('pitchDeckUrl', e.target.files?.[0])}
                                className="hidden"
                            />
                            {errors.pitchDeckUrl && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.pitchDeckUrl}
                                </p>
                            )}
                        </div>

                        {/* Website URL */}
                        <div className="space-y-2">
                            <Label htmlFor="website" className="flex items-center gap-2 text-sm font-medium">
                                <Link2 className="w-4 h-4 text-blue-600" />
                                Website / Prototype URL <span className="text-xs text-gray-500">(optional)</span>
                            </Label>
                            <Input
                                id="website"
                                type="url"
                                placeholder="https://your-startup.com"
                                value={formData.projectWebsite}
                                onChange={(e) => handleInputChange('projectWebsite', e.target.value)}
                                className={`transition-all focus:ring-2 focus:ring-blue-500 ${errors.projectWebsite ? 'border-red-500' : ''}`}
                            />
                            {errors.projectWebsite && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.projectWebsite}
                                </p>
                            )}
                        </div>

                        {/* Role and Team Size */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    Your Role <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.userRole} onValueChange={(value) => handleInputChange('userRole', value)}>
                                    <SelectTrigger className={`transition-all focus:ring-2 focus:ring-blue-500 ${errors.userRole ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ROLES.map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.userRole && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.userRole}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    Team Size <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.teamSize} onValueChange={(value) => handleInputChange('teamSize', value)}>
                                    <SelectTrigger className={`transition-all focus:ring-2 focus:ring-blue-500 ${errors.teamSize ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select team size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TEAM_SIZES.map((size) => (
                                            <SelectItem key={size} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.teamSize && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.teamSize}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Category and Stage */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Tag className="w-4 h-4 text-blue-600" />
                                    Startup Category <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                    <SelectTrigger className={`transition-all focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SECTORS.map((sector) => (
                                            <SelectItem key={sector} value={sector}>
                                                {sector}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.category}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <TrendingUp className="w-4 h-4 text-blue-600" />
                                    Startup Stage <span className="text-red-500">*</span>
                                </Label>
                                <Select value={formData.stage} onValueChange={(value) => handleInputChange('stage', value)}>
                                    <SelectTrigger className={`transition-all focus:ring-2 focus:ring-blue-500 ${errors.stage ? 'border-red-500' : ''}`}>
                                        <SelectValue placeholder="Select stage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STAGES.map((stage) => (
                                            <SelectItem key={stage} value={stage}>
                                                {stage}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.stage && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.stage}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Logo and Cover Image */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Image className="w-4 h-4 text-blue-600" />
                                    Logo <span className="text-xs text-gray-500">(optional)</span>
                                </Label>
                                <div
                                    onClick={() => document.getElementById('logo')?.click()}
                                    className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 ${errors.logoUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                >
                                    <Image className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {formData.logoUrl ? formData.logoUrl.name : 'Upload logo'}
                                    </p>
                                </div>
                                <input
                                    id="logo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('logoUrl', e.target.files?.[0])}
                                    className="hidden"
                                />
                                {errors.logoUrl && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.logoUrl}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-sm font-medium">
                                    <Image className="w-4 h-4 text-blue-600" />
                                    Cover Image <span className="text-xs text-gray-500">(optional)</span>
                                </Label>
                                <div
                                    onClick={() => document.getElementById('cover')?.click()}
                                    className={`border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50 ${errors.coverImageUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                >
                                    <Image className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {formData.coverImageUrl ? formData.coverImageUrl.name : 'Upload cover'}
                                    </p>
                                </div>
                                <input
                                    id="cover"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange('coverImageUrl', e.target.files?.[0])}
                                    className="hidden"
                                />
                                {errors.coverImageUrl && (
                                    <p className="text-sm text-red-500 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        {errors.coverImageUrl}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Donation Options */}
                        <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="donation"
                                    checked={formData.donationEnabled}
                                    onCheckedChange={(checked) => handleInputChange('donationEnabled', !!checked)}
                                />
                                <Label htmlFor="donation" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-blue-600" />
                                    Enable donation option
                                    <span className="text-xs text-gray-500">(verify your account first)</span>
                                </Label>
                            </div>

                            {formData.donationEnabled && (
                                <div className="space-y-2 mt-3">
                                    <Label htmlFor="donationTarget" className="text-sm font-medium">
                                        Enter amount <span className="text-xs text-gray-500">(max 1,00,000)</span>
                                    </Label>
                                    <Input
                                        id="donationTarget"
                                        type="number"
                                        placeholder="50,000"
                                        value={formData.donationTarget}
                                        onChange={(e) => handleInputChange('donationTarget', e.target.value)}
                                        max={100000}
                                        className={`transition-all focus:ring-2 focus:ring-blue-500 ${errors.donationTarget ? 'border-red-500' : ''}`}
                                    />
                                    {errors.donationTarget && (
                                        <p className="text-sm text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.donationTarget}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                Location <span className="text-xs text-gray-500">(optional)</span>
                            </Label>
                            <Input
                                id="location"
                                placeholder="City, Country"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                className="transition-all focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="sticky bottom-0 -mx-6 -mb-6 p-6 bg-white dark:bg-gray-900 border-t mt-6">
                            <Button
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                                <Check className="w-5 h-5 mr-2" />
                                Launch Your Project
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}