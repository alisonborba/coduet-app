
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin, 
  Wallet,
  Edit,
  Save,
  X
} from 'lucide-react';

export const Profile = () => {
  const { walletAddress } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'João Silva',
    phone: '+55 11 99999-9999',
    country: 'Brazil',
    birthDate: '1990-05-15',
    email: 'joao@example.com',
    skype: 'joao.silva.dev',
    specialties: ['React', 'Node.js', 'TypeScript', 'Solana'],
    bio: 'Desenvolvedor Full Stack com 5 anos de experiência em React e blockchain.'
  });

  const isOwnProfile = true; // Will be determined by comparing with connected wallet

  const countries = [
    'Brazil', 'United States', 'Canada', 'United Kingdom', 'Germany', 
    'France', 'Spain', 'Italy', 'Australia', 'Japan', 'Other'
  ];

  const availableSpecialties = [
    'React', 'Vue', 'Angular', 'Node.js', 'Python', 'Java', 'TypeScript',
    'JavaScript', 'Solana', 'Ethereum', 'Rust', 'Go', 'PostgreSQL', 'MongoDB',
    'AWS', 'Docker', 'Kubernetes', 'DevOps', 'Mobile Development', 'UI/UX'
  ];

  const handleSave = () => {
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    // Here you would save the profile data
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data if needed
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setProfileData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {isOwnProfile ? 'Your Profile' : `${profileData.name}'s Profile`}
              </h1>
              <p className="text-muted-foreground">
                {isOwnProfile ? 'Manage your profile information' : 'Developer profile'}
              </p>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} size="sm">
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
                      onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  {isEditing ? (
                    <Select value={profileData.country} onValueChange={(value) => setProfileData(prev => ({ ...prev, country: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.country}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  {isEditing ? (
                    <Input
                      id="birthDate"
                      type="date"
                      value={profileData.birthDate}
                      onChange={(e) => setProfileData(prev => ({ ...prev, birthDate: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(profileData.birthDate).toLocaleDateString()}</span>
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
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skype">Skype</Label>
                  {isEditing ? (
                    <Input
                      id="skype"
                      value={profileData.skype}
                      onChange={(e) => setProfileData(prev => ({ ...prev, skype: e.target.value }))}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profileData.skype}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Solana Address</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">
                    {walletAddress || '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkV'}
                  </span>
                </div>
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
                        variant={profileData.specialties.includes(specialty) ? "default" : "outline"}
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
                  {profileData.specialties.map(specialty => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  placeholder="Conte um pouco sobre sua experiência e especialidades..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  className="min-h-24"
                />
              ) : (
                <p className="text-muted-foreground">{profileData.bio}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
