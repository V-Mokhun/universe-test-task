import { Search, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

interface NoSearchResultsProps {
  searchTerm: string;
  onClearSearch: () => void;
}

export const NoSearchResults = ({
  searchTerm,
  onClearSearch,
}: NoSearchResultsProps) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No projects found
        </h3>
        <p className="text-gray-500 mb-4">
          No projects match your search for "{searchTerm}".
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" onClick={onClearSearch}>
            <X className="w-4 h-4 mr-2" />
            Clear Search
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
