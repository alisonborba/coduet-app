import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Wallet,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";

export const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Use the current user's ID for profile lookup, not wallet address
  const { data: profile, isLoading } = useProfile(user?.id);
  const updateProfile = useUpdateProfile();

  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    country: "",
    birth_date: "",
    email: "",
    skype: "",
    specialties: [] as string[],
    wallet_address: "",
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        phone: profile.phone || "",
        country: profile.country || "",
        birth_date: profile.birth_date || "",
        email: profile.email || "",
        skype: profile.skype || "",
        specialties: profile.specialties || [],
        wallet_address: profile.wallet_address || "",
      });
    }
  }, [profile]);

  const isOwnProfile = true; // Always own profile for now since we're using user ID

  const countries = [
    "Brazil",
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Australia",
    "Japan",
    "Other",
  ];

  const availableSpecialties = [
    "React",
    "Vue",
    "Angular",
    "Node.js",
    "Python",
    "Java",
    "TypeScript",
    "JavaScript",
    "Solana",
    "Ethereum",
    "Rust",
    "Go",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Kubernetes",
    "DevOps",
    "Mobile Development",
    "UI/UX",
  ];

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    if (profile) {
      setProfileData({
        name: profile.name || "",
        phone: profile.phone || "",
        country: profile.country || "",
        birth_date: profile.birth_date || "",
        email: profile.email || "",
        skype: profile.skype || "",
        specialties: profile.specialties || [],
        wallet_address: profile.wallet_address || "",
      });
    }
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setProfileData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  if (!user) {
    return (
      <div className="container py-8">
        <div className="text-center">Please log in to view your profile.</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {isOwnProfile
                  ? "Your Profile"
                  : `${profileData.name}'s Profile`}
              </h1>
              <p className="text-muted-foreground">
                {isOwnProfile
                  ? "Manage your profile information"
                  : "Developer profile"}
              </p>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      disabled={updateProfile.isPending}
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel} size="sm">
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.name || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.phone || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  {isEditing ? (
                    <Select
                      value={profileData.country}
                      onValueChange={value =>
                        setProfileData(prev => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.country || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">Data de Nascimento</Label>
                  {isEditing ? (
                    <Input
                      id="birth_date"
                      type="date"
                      value={profileData.birth_date}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          birth_date: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {profileData.birth_date
                          ? new Date(
                              profileData.birth_date
                            ).toLocaleDateString()
                          : "Not set"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.email || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skype">Skype</Label>
                  {isEditing ? (
                    <Input
                      id="skype"
                      value={profileData.skype}
                      onChange={e =>
                        setProfileData(prev => ({
                          ...prev,
                          skype: e.target.value,
                        }))
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.skype || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Wallet Address</Label>
                {isEditing ? (
                  <Input
                    value={profileData.wallet_address}
                    onChange={e =>
                      setProfileData(prev => ({
                        ...prev,
                        wallet_address: e.target.value,
                      }))
                    }
                    placeholder="Enter your Solana wallet address"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-sm">
                      {profileData.wallet_address || "Not set"}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Especialidades</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Selecione suas especialidades técnicas:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableSpecialties.map(specialty => (
                      <Badge
                        key={specialty}
                        variant={
                          profileData.specialties.includes(specialty)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleSpecialtyToggle(specialty)}
                      >
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.specialties.length > 0 ? (
                    profileData.specialties.map(specialty => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No specialties set</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
