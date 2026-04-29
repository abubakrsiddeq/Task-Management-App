"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type SessionUser } from "@/lib/types";

type ProfileFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: SessionUser;
};

export function ProfileFormDialog({
  open,
  onOpenChange,
  user,
}: ProfileFormDialogProps) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          ...(password ? { password } : {}),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Failed to update profile.");
      }

      toast.success("Profile updated successfully. Refreshing...");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-md border-white/10 bg-slate-950 text-slate-100 sm:rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="mb-6">
            <DialogTitle className="text-xl text-slate-50">Edit Profile</DialogTitle>
            <DialogDescription className="text-sm text-slate-400">
              Update your account details. Leave password empty to keep it unchanged.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                value={name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a new password"
                type="password"
                value={password}
              />
            </div>
          </div>

          <DialogFooter className="mt-8">
            <Button
              className="w-full sm:w-auto"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
