import { formatNumber, formatUnixDate } from "@/shared/lib";
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  GitFork,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type { Project } from "@/services";

interface ProjectCardProps {
  project: Project;
  onDelete: (projectId: string) => Promise<void>;
  onRefresh: (projectId: string) => Promise<void>;
  isDeletePending: boolean;
  isRefreshPending: boolean;
}

export const ProjectCard = ({
  project,
  onDelete,
  onRefresh,
  isDeletePending,
  isRefreshPending,
}: ProjectCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 truncate">
              {project.owner}/{project.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">
                  Created {formatUnixDate(project.repoCreatedAt)}
                </span>
                <span className="text-xs text-gray-500">
                  (Unix timestamp: {project.repoCreatedAt})
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRefresh(project.id)}
              disabled={isRefreshPending}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project.id)}
              disabled={isDeletePending}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-600">
              <Star className="w-4 h-4" />
              <span className="font-semibold">
                {formatNumber(project.stars)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Stars</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <GitFork className="w-4 h-4" />
              <span className="font-semibold">
                {formatNumber(project.forks)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Forks</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="font-semibold">
                {formatNumber(project.openIssues)}
              </span>
            </div>
            <p className="text-xs text-gray-500">Issues</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => window.open(project.url, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
