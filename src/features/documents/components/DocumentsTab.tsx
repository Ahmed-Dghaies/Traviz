import { useState } from "react";

import { FileText, Upload, Trash2, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useAddDocumentMutation,
  useDeleteDocumentMutation,
  useGetDocumentsQuery,
} from "@/lib/supabase/tripsApi";

export function DocumentsTab({ tripId }: { tripId: string }) {
  const { data: documents } = useGetDocumentsQuery(tripId);
  const [addDocument] = useAddDocumentMutation();
  const [deleteDocument] = useDeleteDocumentMutation();
  const tripDocuments = (documents ?? []).filter((doc) => doc.tripId === tripId);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      // In a real app, you'd upload to a cloud storage service
      const reader = new FileReader();
      reader.onload = () => {
        addDocument({
          tripId,
          name: file.name,
          type: file.type,
          url: reader.result as string,
          size: file.size,
        });
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return "🖼️";
    if (type.includes("pdf")) return "📄";
    if (type.includes("word")) return "📝";
    return "📎";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Documents</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload travel documents, tickets, or reservations
            </p>
            <Input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
              disabled={uploading}
              className="max-w-xs mx-auto"
            />
            {uploading && <p className="text-xs text-muted-foreground mt-2">Uploading...</p>}
          </div>
        </div>

        {tripDocuments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No documents uploaded yet</p>
            <p className="text-sm">Upload tickets, reservations, or other travel documents</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tripDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="text-2xl">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(doc.size)}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {doc.type.split("/")[1]?.toUpperCase() || "FILE"}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocument(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
