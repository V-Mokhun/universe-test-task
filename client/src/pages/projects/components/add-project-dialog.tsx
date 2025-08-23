import { createProjectSchema, type CreateProjectBody } from "@/services";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";

interface AddProjectDialogProps {
  onSubmit: (data: CreateProjectBody) => Promise<void>;
  isPending: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddProjectDialog = ({
  onSubmit,
  isPending,
  isOpen,
  onOpenChange,
}: AddProjectDialogProps) => {
  const form = useForm<CreateProjectBody>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      repositoryPath: "",
    },
  });

  const handleSubmit = async (data: CreateProjectBody) => {
    await onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Enter the GitHub repository path to add it to your projects.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="repositoryPath"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository Path</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., facebook/react" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2"
              >
                {isPending ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Add Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
