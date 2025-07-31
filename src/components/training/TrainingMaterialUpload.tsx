import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { useFileUpload } from '@/hooks/use-file-upload';
import enhancedTrainingService from '@/services/enhancedTrainingService';
import { supabase } from '@/integrations/supabase/client';

interface TrainingMaterialUploadProps {
  sessionId?: string;
  courseId?: string;
  onUploadComplete?: () => void;
}

const TrainingMaterialUpload: React.FC<TrainingMaterialUploadProps> = ({
  sessionId,
  courseId,
  onUploadComplete
}) => {
  const [materialData, setMaterialData] = useState({
    name: '',
    description: '',
    content_type: '',
    duration_minutes: 0
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const {
    file,
    handleFileChange,
    clearFile,
    error: fileError
  } = useFileUpload({
    maxSizeMB: 100, // 100MB limit for training materials
    allowedTypes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/pdf',
      'video/mp4',
      'video/webm',
      'audio/mp3',
      'audio/wav'
    ]
  });

  const contentTypes = [
    { value: 'presentation', label: 'PowerPoint Presentation' },
    { value: 'document', label: 'PDF Document' },
    { value: 'video', label: 'Video Training' },
    { value: 'audio', label: 'Audio Training' },
    { value: 'manual', label: 'Training Manual' },
    { value: 'checklist', label: 'Checklist' },
    { value: 'assessment', label: 'Assessment Material' }
  ];

  const handleUpload = async () => {
    if (!file || !materialData.name || !materialData.content_type) {
      toast({
        title: "Missing Information",
        description: "Please provide file, name, and content type",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      await enhancedTrainingService.uploadTrainingMaterial(file, {
        session_id: sessionId,
        course_id: courseId,
        name: materialData.name,
        description: materialData.description,
        content_type: materialData.content_type,
        file_type: file.type,
        duration_minutes: materialData.duration_minutes || undefined,
        uploaded_by: user.id,
        upload_date: new Date().toISOString(),
        is_active: true
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reset form
      setMaterialData({
        name: '',
        description: '',
        content_type: '',
        duration_minutes: 0
      });
      clearFile();
      
      toast({
        title: "Upload Successful",
        description: "Training material has been uploaded successfully"
      });

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload training material",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Training Material
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="file-upload">Training File *</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".ppt,.pptx,.pdf,.mp4,.webm,.mp3,.wav"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {file ? (
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <File className="h-8 w-8" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PPT, PDF, MP4, MP3 (max 100MB)
                  </p>
                </div>
              )}
            </label>
          </div>
          {fileError && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              {fileError}
            </div>
          )}
        </div>

        {/* Material Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="material-name">Material Name *</Label>
            <Input
              id="material-name"
              value={materialData.name}
              onChange={(e) => setMaterialData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Food Safety Training Presentation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content-type">Content Type *</Label>
            <Select
              value={materialData.content_type}
              onValueChange={(value) => setMaterialData(prev => ({ ...prev, content_type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                {contentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={materialData.duration_minutes}
            onChange={(e) => setMaterialData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
            placeholder="Estimated duration in minutes"
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={materialData.description}
            onChange={(e) => setMaterialData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of the training material content..."
            rows={3}
          />
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={!file || !materialData.name || !materialData.content_type || uploading}
          className="w-full"
        >
          {uploading ? (
            <>
              <Upload className="h-4 w-4 mr-2 animate-pulse" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Training Material
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TrainingMaterialUpload;