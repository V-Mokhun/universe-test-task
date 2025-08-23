import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

interface EmptyStateProps {
  onAddProject: () => void;
}

export const EmptyState = ({ onAddProject }: EmptyStateProps) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Plus className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No projects yet
        </h3>
        <p className="text-gray-500 mb-4">
          Start by adding your first GitHub repository to track its metrics.
        </p>
        <Button onClick={onAddProject}>
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Project
        </Button>
      </CardContent>
    </Card>
  );
};
