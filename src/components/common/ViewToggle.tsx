import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/types/patient";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  mode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

export const ViewToggle = ({ mode, onToggle }: ViewToggleProps) => (
  <div className="flex items-center rounded-lg border bg-card p-1 gap-0.5">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle("grid")}
      className={cn("h-8 px-3", mode === "grid" && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
    >
      <LayoutGrid className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle("list")}
      className={cn("h-8 px-3", mode === "list" && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground")}
    >
      <List className="h-4 w-4" />
    </Button>
  </div>
);
